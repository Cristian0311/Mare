import { locationService } from "../services/locations";
import { orderService } from "../services/orders";
import { configService } from "../services/config";
import React from 'react';
import { ArrowLeft, Check, MessageSquare, Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePromotions } from '../contexts/PromotionContext';
import { useToast } from '../contexts/ToastContext';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { cubaLocations } from '../data/cubaLocations';
import { storeConfig } from '../config/store';
import { IconButton } from '../components/ui/IconButton';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { promotionService } from "../services/promotion";
import { CustomerInformation } from '../components/checkout/CustomerInformation';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { generateOrderId } from '../utils/generateOrderId';
import { generateWhatsAppMessage } from '../utils/generateWhatsAppMessage';
import { getProductPricing } from '../utils/pricing';
import { SEO } from '../components/ui/SEO';
import { AdvisorSelector } from '../components/ui/AdvisorSelector';
import { Modal } from '../components/ui/Modal';
import { CartUpsell } from '../components/CartUpsell';

import { useNetworkStatus } from '../hooks/useNetworkStatus';

const Divider = () => <div className="w-full border-b border-dashed border-mare-navy/15 my-4"></div>;

export function Checkout() {
  const navigate = useNavigate();
  const { items, totalItems } = useCart();
  const { currency: currentCurrency, formatPrice, convertPrice } = useCurrency();
  const { getBestPrice, activePromotions } = usePromotions();
  const { toast } = useToast();
  const isOnline = useNetworkStatus();
  
  const subtotal = items.reduce((acc, item) => {
    const pricing = getBestPrice(item, item.quantity, !!item.isWholesale);
    const price = pricing.finalPrice;
    const finalPrice = price;
    const unitsPerPresentacion = (item.isWholesale && item.ventaMayorista) ? (item.ventaMayorista.presentacion === 'Unidad' ? 1 : (item.ventaMayorista.unidadesPorPresentacion || 1)) : 1;
    return acc + (finalPrice * item.quantity * unitsPerPresentacion);
  }, 0);


  const { data, updateField, errors, validate, isValid, isRecovered } = useCheckoutForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [advisorSelectorOpen, setAdvisorSelectorOpen] = useState(false);
  const [preparedOrderInfo, setPreparedOrderInfo] = useState<any>(null);

  const selectedProvince = cubaLocations.find(p => p.id === data.provincia);
  const municipalities = locationService.getMunicipalitiesByProvinceSync(data.provincia);
  
  const deliveryCostMN = data.metodoEntrega === 'domicilio' && data.municipio
    ? municipalities.find(m => m.nombre === data.municipio)?.precioEntregaMN ?? configService.getConfigSync().delivery.defaultCostMN
    : 0;

  const couponDiscount = 0;

  const total = Math.max(0, subtotal - couponDiscount) + deliveryCostMN;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/mi-pedido');
    }
    window.scrollTo(0, 0);
  }, [items, navigate]);

  const handleReview = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validate()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalConfirm = () => {
    if (!isOnline) {
      toast({
        type: 'error',
        title: 'Sin conexión',
        description: 'Necesitas conexión a Internet para enviar el pedido por WhatsApp. Tu pedido se ha guardado localmente.'
      });
      return;
    }

    setIsSubmitting(true);
    const orderId = generateOrderId();
    
    // Preparar datos para el mensaje de WhatsApp y persistencia temporal
    const orderInfo = {
      orderId,
      customer: {
        nombre: `${data.nombre} ${data.apellidos}`.trim(),
        telefono: data.telefono,
        whatsapp: data.whatsapp || data.telefono,
        correo: data.email,
      },
      delivery: {
        metodo: data.metodoEntrega,
        provincia: selectedProvince?.nombre || '',
        municipio: data.municipio,
        direccion: data.direccion,
        referencia: data.referencia,
        puntoRecogida: data.puntoRecogida,
      },
      items: items.map(item => ({
        ...item,
        precioBaseMN: item.precioMN, // Always keep MN for reference
        selectedVariantInfo: undefined 
      })),
      subtotal: subtotal,
      deliveryCost: deliveryCostMN,
      total: total,
      coupon: undefined,
      currency: currentCurrency,
      observaciones: data.observaciones,
      timestamp: new Date().toISOString()
    };

    // Guardar en localStorage para la pantalla de éxito
    localStorage.setItem('mare-last-order', JSON.stringify({
       ...orderInfo,
       items: orderInfo.items.map(item => ({
         ...item,
         precioDisplay: convertPrice(item.precioMN) // Usar un nombre que indique que es para visualización
       })),
       subtotalDisplay: convertPrice(orderInfo.subtotal),
       deliveryCostDisplay: convertPrice(orderInfo.deliveryCost),
       totalDisplay: convertPrice(orderInfo.total)
    }));
    
    // Generar mensaje de WhatsApp
    const message = generateWhatsAppMessage(orderInfo, formatPrice, activePromotions);
    setPreparedOrderInfo({ orderInfo, message });
    setIsSubmitting(false);
    setAdvisorSelectorOpen(true);
  };

  const handleAdvisorSelect = async (advisor: any) => {
    if (!preparedOrderInfo) return;

    try {
      setIsSubmitting(true);
      const { orderInfo, message } = preparedOrderInfo;
      
      // Intentar guardar en base de datos
      try {
        let orderType = 'retail';
        if (orderInfo.items.some((i: any) => i.isWholesale)) {
          orderType = 'wholesale';
        }
        
        await orderService.createOrder({
          order_number: orderInfo.orderId,
          order_type: orderType as any,
          customer_data: {
            nombre: orderInfo.customer.nombre,
            telefono: orderInfo.customer.telefono,
            whatsapp: orderInfo.customer.whatsapp,
            correo: orderInfo.customer.correo
          },
          advisor_id: advisor.id,
          subtotal_cup: orderInfo.subtotal,
          delivery_fee_cup: orderInfo.deliveryCost,
          total_cup: orderInfo.total,
          province_id: selectedProvince?.id,
          municipality_id: municipalities.find(m => m.nombre === data.municipio)?.id,
          address: orderInfo.delivery.direccion,
          customer_notes: orderInfo.observaciones,
          items: orderInfo.items.map((item: any) => ({
            product_id: item.id,
            product_name: item.nombre,
            unit_price_cup: item.precioBaseMN || item.precioMN,
            quantity: item.quantity,
            subtotal_cup: (item.precioBaseMN || item.precioMN) * item.quantity,
            units_per_presentation: item.isWholesale && item.ventaMayorista 
              ? (item.ventaMayorista.unidadesPorPresentacion || 1) 
              : 1
          }))
        });
      } catch (dbError) {
        console.error("Failed to save order to DB:", dbError);
        // Continuar con WhatsApp incluso si falla la DB
      }

      const whatsappUrl = `https://wa.me/${advisor.whatsapp}?text=${encodeURIComponent(message)}`;

      // Abrir WhatsApp y navegar a éxito
      window.open(whatsappUrl, '_blank');
      navigate('/pedido-completado');
      setAdvisorSelectorOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-32">
      <SEO title="Finalizar Pedido" noindex={true} />
      
      {/* Selector de Asesores */}
      <Modal 
        isOpen={advisorSelectorOpen}
        onClose={() => setAdvisorSelectorOpen(false)}
        title="Tu Pedido está listo"
      >
        <AdvisorSelector 
          onSelect={handleAdvisorSelect}
        />
      </Modal>

      {/* Indicador de progreso compacto */}
      <div className="flex items-center justify-between mb-8 max-w-sm mx-auto bg-gray-50 p-2 rounded-full border border-gray-100">
         <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-colors ${step >= 1 ? 'bg-mare-navy text-white' : 'bg-white text-gray-400'}`}>1</div>
         <div className={`flex-1 h-0.5 mx-2 transition-colors ${step >= 1 ? 'bg-mare-navy' : 'bg-gray-200'}`}></div>
         <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-colors ${step >= 2 ? 'bg-mare-navy text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>2</div>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <IconButton variant="ghost" onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="hover:bg-gray-100">
          <ArrowLeft strokeWidth={1.5} className="w-5 h-5" />
        </IconButton>
        <div>
          <h1 className="text-xl font-black text-mare-navy leading-none">FINALIZAR PEDIDO</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {step === 1 ? 'Datos de contacto y entrega' : 'Confirmación final'}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isRecovered && step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-mare-turquoise/10 border border-mare-turquoise/20 p-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Check strokeWidth={1.5} className="w-3 h-3 text-mare-turquoise" />
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-wider">Datos recuperados</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Izquierda: Formulario o Confirmación */}
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          
          {step === 1 ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Tus productos (Resumen compacto) */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-mare-navy/5 rounded-lg">
                      <Package strokeWidth={1.5} className="w-4 h-4 text-mare-navy" />
                    </div>
                    <h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">01 — PRODUCTOS</h2>
                  </div>
                  <button onClick={() => navigate('/mi-pedido')} className="text-[10px] font-bold text-mare-green hover:underline uppercase tracking-wider">
                    Editar
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {items.map((item, idx) => {
                    const pricing = getProductPricing(item as any, item.quantity);
                    const isWholesale = !!(item.isWholesale && item.ventaMayorista);
                    
                    return (
                      <div key={idx} className="flex gap-3 py-2 rounded-xl transition-colors border-b border-gray-50 last:border-0 group">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1 shadow-sm transition-shadow">
                          <img src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[12px] font-black text-mare-navy truncate">{item.nombre}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded-md">
                                  x{item.quantity}
                                </span>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                {`${formatPrice(isWholesale ? item.ventaMayorista!.precioMN : pricing.finalPrice)} u`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </section>

              <CustomerInformation 
                data={data} 
                updateField={updateField} 
                errors={errors} 
              />

              <DeliveryOptions 
                metodo={data.metodoEntrega} 
                onChange={(val) => updateField('metodoEntrega', val)} 
              />

              <AddressSelector 
                data={data} 
                updateField={updateField} 
                errors={errors} 
              />

              <CartUpsell location="checkout" />

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-mare-navy/5 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-mare-navy" />
                  </div>
                  <h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">05 — OBSERVACIONES</h2>
                </div>

                <textarea
                  value={data.observaciones}
                  onChange={(e) => updateField('observaciones', e.target.value)}
                  placeholder="Ej: Llamar antes de llegar..."
                  className="w-full h-20 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mare-turquoise/20 focus:border-mare-turquoise transition-all text-sm font-bold resize-none"
                />
              </section>
              
              {/* Botón para continuar a validación en móvil (visible solo si estamos en móvil) */}
              <div className="lg:hidden mt-2">
                <Button variant="primary" fullWidth onClick={handleReview} className="h-14 rounded-2xl font-black tracking-widest text-[11px] shadow-lg shadow-mare-green/20 gap-2">
                  REVISAR PEDIDO
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Confirmación Final */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-mare-green"></div>
                
                <h2 className="text-lg font-black text-mare-navy mb-1 tracking-tight">06 — CONFIRMACIÓN</h2>
                <p className="text-xs font-medium text-gray-500 mb-6">Por favor, revisa tus datos antes de enviar el pedido.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cliente</h4>
                      <p className="text-sm font-bold text-mare-navy">{data.nombre} {data.apellidos}</p>
                      <p className="text-xs text-gray-500">{data.telefono}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[10px] font-bold text-mare-green hover:underline uppercase tracking-wider">Editar</button>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entrega</h4>
                      <p className="text-sm font-bold text-mare-navy capitalize">{data.metodoEntrega.replace('-', ' ')}</p>
                      {data.metodoEntrega === 'domicilio' ? (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {selectedProvince?.nombre}, {data.municipio}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {data.puntoRecogida === 'pendiente' ? 'Punto de recogida: Pendiente' : data.puntoRecogida}
                        </p>
                      )}
                      {data.metodoEntrega === 'domicilio' && data.direccion && (
                        <p className="text-xs text-gray-500 mt-1">{data.direccion}</p>
                      )}
                    </div>
                    <button onClick={() => setStep(1)} className="text-[10px] font-bold text-mare-green hover:underline uppercase tracking-wider">Editar</button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

        </div>

        {/* Derecha: Resumen Sticky */}
        <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
          <OrderSummary 
            subtotal={subtotal} 
            deliveryCost={deliveryCostMN}
            discount={couponDiscount}
            isValid={step === 2 || isValid} 
            onReview={step === 1 ? handleReview : handleFinalConfirm}
            isSubmitting={isSubmitting}
            step={step}
          />
        </div>
      </div>
    </div>
  );
}
