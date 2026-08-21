import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Package, 
  ArrowLeft, 
  Share2, 
  ShoppingCart, 
  CheckCircle2, 
  ShieldCheck, 
  Truck,
  ChevronRight,
  Info
} from 'lucide-react';
import { bundleService } from '../services/bundleService';
import { Bundle } from '../types/bundle';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { getBundlePricing } from '../utils/pricing';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { PageTransition } from '../components/ui/PageTransition';

import { SEO } from '../components/ui/SEO';

export const BundleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { addBundle } = useCart();
  
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBundle = async () => {
      if (!id) return;
      try {
        const data = await bundleService.getBundleById(id);
        setBundle(data);
      } catch (e) {
        console.error('Error fetching bundle', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!bundle) return <div className="p-10 text-center">Combo no encontrado</div>;

  const pricing = getBundlePricing(bundle);
  const isAvailable = (bundle as any).isAvailable;

  return (
    <PageTransition>
      <SEO 
        title={bundle.name}
        description={bundle.description}
        ogImage={bundle.image_url}
        ogType="product"
      />
      <div className="pb-20">
        {/* Header Navigation */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-mare-navy hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <span className="font-black text-mare-navy text-[10px] tracking-widest uppercase truncate max-w-[200px]">
            {bundle.name}
          </span>

          <button className="p-2 -mr-2 text-mare-navy hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white">
          <div className="relative aspect-video sm:aspect-[21/9] overflow-hidden bg-gray-50">
            {bundle.image_url ? (
              <img 
                src={bundle.image_url} 
                alt={bundle.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package size={64} strokeWidth={1} />
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="gold" className="shadow-lg">COMBO ESPECIAL</Badge>
              {pricing.hasOffer && (
                <Badge variant="success" className="shadow-lg">AHORRA {pricing.discountPercentage}%</Badge>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-mare-navy mb-2 leading-tight uppercase">
                {bundle.name}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {bundle.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8">
              <div className="flex flex-col mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Precio Combo</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-mare-navy">{formatPrice(pricing.finalPrice)}</span>
                  {pricing.hasOffer && (
                    <span className="text-sm text-gray-400 line-through font-bold">{formatPrice(pricing.originalPrice)}</span>
                  )}
                </div>
                {pricing.hasOffer && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 size={12} />
                    Te ahorras {formatPrice(pricing.savings)}
                  </div>
                )}
              </div>

              <Button 
                className="w-full h-14 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-mare-green/20"
                onClick={() => addBundle(bundle)}
                disabled={!isAvailable}
              >
                <ShoppingCart size={18} className="mr-2" />
                {isAvailable ? 'Agregar Combo al Pedido' : 'Temporalmente Agotado'}
              </Button>
            </div>

            {/* Components List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-mare-navy text-sm uppercase tracking-widest flex items-center gap-2">
                  <Package size={18} className="text-mare-turquoise" />
                  Qué incluye este combo
                </h2>
                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {bundle.items?.length} PRODUCTOS
                </span>
              </div>

              <div className="grid gap-3">
                {bundle.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                      {item.product?.imagenes?.[0] ? (
                        <img 
                          src={item.product.imagenes[0]} 
                          alt={item.product.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-mare-navy uppercase truncate leading-tight">
                        {item.product?.nombre}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium">Cantidad: {item.quantity} unidades</p>
                    </div>
                    <Link to={`/producto/${item.product?.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-400">
                        <ChevronRight size={18} />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Features / Trust */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                <ShieldCheck className="text-mare-turquoise mb-2" size={24} />
                <span className="text-[10px] font-black text-mare-navy uppercase tracking-wider mb-1">Garantía</span>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Productos 100% verificados</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
                <Truck className="text-mare-turquoise mb-2" size={24} />
                <span className="text-[10px] font-black text-mare-navy uppercase tracking-wider mb-1">Entrega</span>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Envío rápido a domicilio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
