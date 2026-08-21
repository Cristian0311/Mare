import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecommendedItem } from '../types/recommendation';
import { recommendationEngine } from '../services/recommendationEngine';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Button } from './ui/Button';

interface CartUpsellProps {
  location?: 'cart' | 'checkout' | 'post_order';
  isWholesale?: boolean;
}

export function CartUpsell({ location = 'cart', isWholesale = false }: CartUpsellProps) {
  const { items, addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const cartProductIds = items.map(i => i.id).filter(Boolean);

  useEffect(() => {
    if (cartProductIds.length === 0) return;

    let isMounted = true;
    const fetchUpsells = async () => {
      try {
        const limit = location === 'checkout' ? 2 : 3;
        const upsells = await recommendationEngine.getCartUpsellRecommendations(cartProductIds, limit, isWholesale);
        if (isMounted) {
          setRecommendations(upsells);
        }
      } catch (e) {
        // Silently handle recommendations fetch error
      }
    };

    fetchUpsells();
    return () => { isMounted = false; };
  }, [items.length, location, isWholesale]);

  if (cartProductIds.length === 0 || recommendations.length === 0) return null;

  const title = location === 'checkout' 
    ? '¿Olvidaste algo?' 
    : location === 'post_order'
    ? 'También puedes explorar'
    : 'Quizás también necesites...';

  const handleAdd = (item: RecommendedItem) => {
    if (item.product) {
      addItem(item.product, 1, undefined, undefined, isWholesale);
      setAddedMap(prev => ({ ...prev, [item.product!.id]: true }));
      recommendationEngine.trackEvent('add_to_cart', item.product.id, item.product.categoria_id, `cart_upsell_${location}`);
    }
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      location === 'checkout' 
        ? 'bg-amber-50/40 border-amber-200/50 my-4' 
        : 'bg-gray-50/70 border-gray-100 my-6'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className={location === 'checkout' ? 'text-amber-600' : 'text-mare-turquoise'} />
        <h4 className="text-xs font-black text-mare-navy uppercase tracking-wider">{title}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {recommendations.map((item, idx) => {
          const product = item.product;
          const bundle = item.bundle;

          if (bundle) {
            return (
              <div key={`upsell-bundle-${bundle.id}-${idx}`} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-mare-navy uppercase truncate">{bundle.name}</p>
                  <p className="text-xs font-black text-amber-600">{formatPrice(bundle.price_value)}</p>
                </div>
                <Link to={`/combos/${bundle.id}`} className="p-2 rounded-lg bg-amber-500 text-white font-bold text-xs">
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          }

          if (!product) return null;
          const isAdded = addedMap[product.id];
          const hasWholesale = product.ventaMayorista?.habilitada;
          const retailPrice = product.precioMN;
          const wholesalePrice = product.ventaMayorista?.precioMN;

          return (
            <div key={`upsell-prod-${product.id || idx}-${idx}`} className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center gap-3">
              <img 
                src={product.imagenes?.[0] || ''} 
                alt="" 
                className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-mare-navy uppercase truncate">{product.nombre}</p>
                {hasWholesale ? (
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-mare-navy">{formatPrice(retailPrice)} / u</span>
                    <span className="text-[9px] font-black text-mare-green">{formatPrice(wholesalePrice || 0)} / {product.ventaMayorista?.presentacion?.toLowerCase() || 'lote'}</span>
                  </div>
                ) : (
                  <p className="text-xs font-black text-mare-turquoise">{formatPrice(retailPrice)}</p>
                )}
              </div>
              <button
                onClick={() => handleAdd(item)}
                disabled={isAdded}
                className={`p-2 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                  isAdded 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-mare-navy text-white hover:bg-mare-turquoise'
                }`}
              >
                {isAdded ? <Check size={14} /> : <Plus size={14} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
