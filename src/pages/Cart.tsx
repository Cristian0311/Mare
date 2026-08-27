import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, Send, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { useCart, getCartItemId } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import { useState, useEffect } from 'react';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { cubaLocations } from '../data/cubaLocations';
import { usePromotions } from '../contexts/PromotionContext';
import { SEO } from '../components/ui/SEO';
import { CartUpsell } from '../components/CartUpsell';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getBestPrice } = usePromotions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Delivery estimation
  const { data: checkoutData } = useCheckoutForm();
  
  const selectedProvince = checkoutData ? cubaLocations.find(p => p.id === checkoutData.provincia) : undefined;
  const municipalities = selectedProvince?.municipios || [];
  
  const deliveryCost = checkoutData?.metodoEntrega === 'domicilio' && checkoutData?.municipio
    ? municipalities.find(m => m.id === checkoutData.municipio || m.nombre === checkoutData.municipio)?.precioEntregaMN || 0
    : 0;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = items.reduce((acc, item) => {
    const pricing = getBestPrice(item, item.quantity, !!item.isWholesale);
    const price = pricing.finalPrice;
    const finalPrice = price;
    const unitsPerPresentacion = (item.isWholesale && item.ventaMayorista) ? (item.ventaMayorista.presentacion === 'Unidad' ? 1 : (item.ventaMayorista.unidadesPorPresentacion || 1)) : 1;
    return acc + (finalPrice * item.quantity * unitsPerPresentacion);
  }, 0);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const handleRemove = (itemId: string, nombre: string) => {
    removeItem(itemId);
    toast({
      title: 'Producto eliminado', type: 'info',
      description: `${nombre} ha sido eliminado.`,
    });
  };

  const handleToggleFavorite = (item: any) => {
    toggleFavorite(item);
    const isFav = !isFavorite(item.id);
    toast({
      title: isFav ? 'Agregado a favoritos' : 'Eliminado de favoritos',
      description: isFav ? 'El producto se guardó en tus favoritos.' : 'El producto se eliminó de favoritos.',
      type: isFav ? 'success' : 'info'
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in fade-in duration-500">
        <SEO title="Mi Pedido - Vacío" noindex={true} />
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
          <ShoppingBag strokeWidth={1} className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-mare-navy mb-3 tracking-tighter">Tu pedido está vacío</h2>
        <p className="text-sm font-medium text-gray-500 mb-8 text-center max-w-sm">
          Aún no has agregado productos. Explora nuestro catálogo y encuentra lo que necesitas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            className="px-8 font-black text-[11px] tracking-widest h-12 shadow-lg shadow-mare-green/20"
          >
            EXPLORAR PRODUCTOS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-32 md:pb-12">
      <SEO title="Mi Pedido" noindex={true} />
      
      {/* Header Mi Pedido */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-black text-mare-navy tracking-tighter leading-none">Mi Pedido</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="btn-keep-shopping"
            onClick={() => navigate('/')}
            className="text-[9px] font-black text-mare-navy/50 uppercase tracking-widest hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3 h-3" />
            Seguir comprando
          </button>
          <button 
            id="btn-clear-cart"
            onClick={() => setShowClearConfirm(true)}
            className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            Vaciar
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
        {/* Lista de Productos */}
        <div className="w-full lg:flex-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const itemId = getCartItemId(item);
                const isItemAvailable = item.available !== false;
                const fav = isFavorite(item.id);
                const pricing = getBestPrice(item, item.quantity, !!item.isWholesale);
                
                return (
                  <motion.div
                    key={itemId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col"
                  >
                    <div className="flex flex-row gap-3 sm:gap-4 py-3 relative">
                      {/* Imagen Compacta */}
                      <div 
                        className="w-[72px] h-[72px] sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden shrink-0 cursor-pointer border border-gray-100 flex items-center justify-center p-1 shadow-sm"
                        onClick={() => navigate(`/producto/${item.slug}`)}
                      >
                        <img 
                          src={item.imagenes[0]} 
                          alt={item.nombre} 
                          className={`w-full h-full object-contain transition-transform duration-300 hover:scale-110 ${!isItemAvailable ? 'opacity-50 grayscale' : ''}`} 
                        />
                      </div>

                      {/* Información del Producto */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Header del item: Nombre y Eliminar */}
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div className="flex flex-col min-w-0 pr-2">
                            <h3 
                              className="text-[12px] sm:text-sm font-bold text-mare-navy truncate cursor-pointer hover:text-mare-green leading-tight"
                              onClick={() => navigate(`/producto/${item.slug}`)}
                            >
                              {item.nombre}
                            </h3>
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center flex-wrap gap-x-1">
                              {item.isWholesale ? "Precio unitario mayorista" : (pricing.hasOffer && !item.isBundle ? "Precio oferta unitario" : "Precio unitario")}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleFavorite(item)}
                              className={`p-1.5 rounded-lg transition-colors ${fav ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-500'}`}
                            >
                              <Heart strokeWidth={1.5} className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                            </button>
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg h-8 shadow-sm">
                              <button
                                onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1 || !isItemAvailable}
                                className="w-8 h-full flex items-center justify-center rounded-l-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 transition-colors text-mare-navy"
                              >
                                <Minus strokeWidth={2.5} className="w-2.5 h-2.5" />
                              </button>
                              <div className="px-2 min-w-[28px] h-full flex items-center justify-center border-x border-gray-100 bg-gray-50/50">
                                <span className="text-[12px] font-black text-mare-navy">
                                  {item.quantity}
                                </span>
                              </div>
                              <button
                                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                disabled={!isItemAvailable}
                                className="w-8 h-full flex items-center justify-center rounded-r-lg hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 transition-colors text-mare-navy"
                              >
                                <Plus strokeWidth={2.5} className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {!isItemAvailable && (
                          <div className="mt-2">
                            <span className="text-[8px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-red-100">
                              Agotado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < items.length - 1 && <div className="w-full border-b border-dashed border-gray-200 my-1"></div>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Cart Upsells "Quizás también necesites..." */}
          <CartUpsell location="cart" />
        </div>

        {/* Resumen Sticky */}
        <div className="w-full lg:w-[340px] shrink-0 sticky top-24">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
              <h2 className="text-[11px] font-black text-mare-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-3 bg-mare-gold rounded-full"></div>
                RESUMEN
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Subtotal de Compra</span>
                  <span className="font-black text-mare-navy">
                    {formatPrice(items.reduce((acc, item) => {
                      const pricing = getBestPrice(item, item.quantity, !!item.isWholesale);
                      const isWholesale = item.isWholesale && item.ventaMayorista;
                      const price = isWholesale ? item.ventaMayorista!.precioMN : pricing.finalPrice;
                      const unitsPerPresentacion = isWholesale ? (item.ventaMayorista!.presentacion === 'Unidad' ? 1 : (item.ventaMayorista!.unidadesPorPresentacion || 1)) : 1;
                      return acc + (price * item.quantity * unitsPerPresentacion);
                    }, 0))}
                  </span>
                </div>

                
                <div className="w-full border-b border-dashed border-gray-200 my-2"></div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Entrega</span>
                  {deliveryCost > 0 ? (
                    <span className="font-black text-mare-navy">{formatPrice(deliveryCost)}</span>
                  ) : (
                    <span className="text-[9px] font-black text-mare-green tracking-widest uppercase italic">
                      Pendiente
                    </span>
                  )}
                </div>
                {checkoutData.provincia && (
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-medium text-gray-400 truncate max-w-[200px]">
                        {checkoutData.metodoEntrega === 'domicilio' ? 'A domicilio: ' : 'Recogida: '}
                        {checkoutData.municipio}
                     </span>
                     <button
                        onClick={() => navigate('/pedido')}
                       className="text-[9px] font-black text-mare-green hover:underline uppercase tracking-wider ml-2"
                     >
                        Editar
                     </button>
                  </div>
                )}
                
                <div className="w-full border-b-2 border-mare-navy mt-4 mb-2"></div>
                
                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Total a pagar hoy</p>
                    <p className="text-2xl sm:text-3xl font-black text-mare-navy leading-none tracking-tighter">
                      {formatPrice(subtotal + deliveryCost)}
                    </p>
                  </div>
                </div>
                
              </div>

              <Button 
                id="btn-checkout-desktop"
                variant="primary" 
                fullWidth 
                onClick={() => navigate('/pedido')}
                className="h-12 rounded-xl shadow-md font-black tracking-[0.15em] text-[10px] gap-2 group"
              >
                CONTINUAR AL CHECKOUT
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>          
          </div>
        </div>
      </div>

      {/* Barra Inferior Móvil Fija */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</span>
             <span className="text-xl font-black text-mare-navy leading-none">{formatPrice(subtotal + deliveryCost)}</span>
          </div>
          <Button 
            id="btn-checkout-mobile"
            variant="primary" 
            onClick={() => navigate('/pedido')}
            className="h-12 rounded-xl font-black text-[11px] tracking-widest gap-2 shadow-lg shadow-mare-green/20 px-6"
          >
            CONTINUAR
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modal de Confirmación para Vaciar */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="¿Vaciar tu pedido?"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-500 mb-8 font-medium text-sm max-w-[240px] mx-auto leading-relaxed">
            ¿Estás seguro? Se eliminarán todos los productos de tu pedido actual.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => setShowClearConfirm(false)}
              className="h-12 rounded-xl font-black text-[10px] tracking-widest border-gray-200"
            >
              CANCELAR
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleClearCart}
              className="h-12 rounded-xl bg-red-500 border-red-500 hover:bg-red-600 font-black text-[10px] tracking-widest text-white shadow-lg shadow-red-500/20"
            >
              SÍ, VACIAR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
