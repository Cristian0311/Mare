import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShoppingCart, Tag, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecommendedItem, RecommendationType } from '../types/recommendation';
import { recommendationEngine } from '../services/recommendationEngine';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCart } from '../contexts/CartContext';
import { Badge } from './ui/Badge';

interface ProductRecommendationsProps {
  productId?: string;
  categoryId?: string;
  type?: RecommendationType;
  title?: string;
  isWholesale?: boolean;
}

export function ProductRecommendations({ 
  productId, 
  categoryId, 
  type = 'related', 
  title, 
  isWholesale = false 
}: ProductRecommendationsProps) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [items, setItems] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setLoading(true);
      try {
        let data: RecommendedItem[] = [];

        if (type === 'related' && productId) {
          data = await recommendationEngine.getRelatedProducts(productId, categoryId, 4, isWholesale);
        } else if (type === 'complementary' && productId) {
          data = await recommendationEngine.getComplementaryProducts(productId, 4, isWholesale);
        } else if (type === 'popular') {
          data = await recommendationEngine.getPopularProducts(4, isWholesale);
        } else if (type === 'trending') {
          data = await recommendationEngine.getTrendingProducts(4, isWholesale);
        } else if (type === 'for_you') {
          data = await recommendationEngine.getForYouRecommendations(4, isWholesale);
        } else if (type === 'recently_viewed') {
          data = await recommendationEngine.getRecentlyViewedProducts(6, isWholesale);
        }

        if (isMounted) {
          setItems(data);
        }
      } catch (e) {
        console.error('Error in ProductRecommendations component:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchItems();

    return () => { isMounted = false; };
  }, [productId, categoryId, type, isWholesale]);

  if (loading || items.length === 0) return null;

  const defaultTitles: Record<RecommendationType, string> = {
    related: 'También te puede interesar',
    complementary: 'Completa tu compra',
    popular: 'Más Vendidos',
    trending: 'En Tendencia',
    best_rated: 'Mejor Valorados',
    offers: 'Ofertas Destacadas',
    combos: 'Combos Recomendados',
    recently_viewed: 'Visto Recientemente',
    for_you: 'Pensado para ti'
  };

  const sectionTitle = title || defaultTitles[type] || 'Recomendados para ti';

  return (
    <div className="space-y-4 my-8">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-mare-turquoise/10 flex items-center justify-center text-mare-turquoise">
            <Sparkles size={14} />
          </div>
          <h3 className="text-xs font-black text-mare-navy uppercase tracking-wider">{sectionTitle}</h3>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar scroll-smooth">
        {items.map((item, idx) => {
          const product = item.product;
          const bundle = item.bundle;

          if (bundle) {
            return (
              <motion.div 
                key={`rec-bundle-${type}-${bundle.id}-${idx}`}
                whileHover={{ y: -2 }}
                className="shrink-0 w-44 bg-amber-50/50 rounded-2xl border border-amber-200/60 p-3 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="gold" className="text-[9px] px-1.5 py-0.5">COMBO</Badge>
                  </div>
                  <Link 
                    to={`/combos/${bundle.id}`}
                    onClick={() => recommendationEngine.trackEvent('click', undefined, undefined, 'recommendation_bundle', bundle.id)}
                  >
                    <div className="aspect-square rounded-xl bg-white overflow-hidden mb-2 relative">
                      {bundle.image_url ? (
                        <img src={bundle.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <h4 className="text-[11px] font-black text-mare-navy uppercase truncate">{bundle.name}</h4>
                  </Link>
                </div>
                <div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-mare-navy">{formatPrice(bundle.price_value)}</span>
                    <Link 
                      to={`/combos/${bundle.id}`} 
                      className="p-1.5 rounded-xl bg-mare-turquoise text-white hover:bg-mare-navy transition-colors"
                    >
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          }

          if (!product) return null;

          const retailPrice = product.precioMN;
          const hasWholesale = product.ventaMayorista?.habilitada;
          const wholesalePrice = product.ventaMayorista?.precioMN;

          return (
            <motion.div 
              key={`rec-prod-${type}-${product.id || idx}-${idx}`}
              whileHover={{ y: -2 }}
              className="shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <Link 
                to={`/producto/${product.slug}`}
                onClick={() => recommendationEngine.trackEvent('click', product.id, product.categoria_id, type)}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                  <img 
                    src={product.imagenes?.[0] || ''} 
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.badge && (
                    <div className="absolute top-1.5 left-1.5">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        item.badge === 'COMBO'
                          ? 'bg-purple-600 text-white'
                          : 'bg-mare-turquoise text-white'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="text-[10px] font-black text-mare-navy uppercase truncate leading-tight mb-1">{product.nombre}</h4>
              </Link>

              <div className="pt-2 flex flex-col gap-1.5 border-t border-gray-50">
                <div className="flex flex-col">
                  {hasWholesale ? (
                    <>
                      <div className="flex flex-col mb-1">
                        <span className="text-[6px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">Unidad</span>
                        <span className="text-[10px] font-black text-mare-navy">
                          {retailPrice > 0 ? formatPrice(retailPrice) : 'Sólo mayorista'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[6px] text-mare-green font-bold uppercase tracking-widest leading-none mb-0.5">Mayorista</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[11px] font-black text-mare-green">{formatPrice(wholesalePrice || 0)}</span>
                          <span className="text-[6px] text-gray-400 font-bold uppercase tracking-widest">/{product.ventaMayorista?.presentacion?.toLowerCase() || 'lote'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-black text-mare-navy">{formatPrice(retailPrice)}</span>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      addItem(product, 1, undefined, undefined, isWholesale);
                      recommendationEngine.trackEvent('add_to_cart', product.id, product.categoria_id, type);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 text-mare-navy hover:bg-mare-turquoise hover:text-white transition-colors"
                    title="Agregar al pedido"
                  >
                    <ShoppingCart size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
