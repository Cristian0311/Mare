import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Package, MapPin, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import { CartUpsell } from '../components/CartUpsell';

export function OrderSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem('mare-last-order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      // Limpiar carrito ya que el pedido se generó
      clearCart();
      // Limpiar también localStorage de checkout si se desea, pero 
      // mejor mantenerlo por si el usuario vuelve a comprar.
    } else {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!order) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-mare-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-mare-green" />
        </motion.div>
        
        <h1 className="text-3xl font-black text-mare-navy tracking-tight mb-2">🎉 ¡Pedido preparado!</h1>
        <p className="text-gray-500 font-medium max-w-xs mx-auto">
          Tu pedido está listo para coordinarse por WhatsApp. 
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Card de Identificador */}
        <div className="bg-mare-navy text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mare-turquoise opacity-10 blur-2xl rounded-full translate-x-10 -translate-y-10"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">ID del Pedido</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight">{order.orderId}</span>
                <button 
                  onClick={copyOrderId}
                  className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-mare-green" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <Logo variant="symbol" className="opacity-50" iconClassName="h-8 w-8" />
          </div>

          <div className="flex gap-4 relative z-10 pt-4 border-t border-white/10">
             <div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Fecha</span>
                <span className="text-xs font-bold">{new Date(order.timestamp).toLocaleDateString('es-CU')}</span>
             </div>
             <div>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Total</span>
                <span className="text-xs font-bold">{order.totalDisplay.toLocaleString()} {order.currency}</span>
             </div>
          </div>
        </div>

        {/* Resumen de Datos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
           <div className="flex items-start gap-4 pb-4 border-b border-gray-50">
              <div className="bg-mare-green/5 p-2 rounded-xl text-mare-green shrink-0">
                 <Package className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-xs font-black text-mare-navy uppercase tracking-tight mb-1">Productos</h3>
                 <p className="text-xs text-gray-400 font-bold leading-tight">
                    {order.items.length} {order.items.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                 </p>
              </div>
           </div>

           <div className="flex items-start gap-4">
              <div className="bg-mare-turquoise/5 p-2 rounded-xl text-mare-turquoise shrink-0">
                 <MapPin className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-xs font-black text-mare-navy uppercase tracking-tight mb-1">Entrega</h3>
                 <p className="text-xs text-gray-400 font-bold leading-tight">
                    {order.delivery.metodo === 'domicilio' 
                      ? `${order.delivery.municipio}, ${order.delivery.provincia}` 
                      : 'Recogida'}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <CartUpsell location="post_order" />

      <div className="flex flex-col gap-3">
        <Link to="/">
          <Button 
            variant="primary" 
            fullWidth
            className="h-14 rounded-2xl font-black text-xs tracking-[0.15em] shadow-lg shadow-mare-green/20 gap-2"
          >
            VOLVER A LA TIENDA
          </Button>
        </Link>
      </div>
      
      <p className="text-center mt-12 text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
        Gracias por elegir MARÉ
      </p>
    </div>
  );
}
