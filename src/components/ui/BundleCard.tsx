import React from 'react';
import { motion } from 'motion/react';
import { Package, ChevronRight, Info } from 'lucide-react';
import { Bundle } from '../../types/bundle';
import { useCurrency } from '../../contexts/CurrencyContext';
import { getBundlePricing } from '../../utils/pricing';
import { Badge } from './Badge';
import { Button } from './Button';
import { useCart } from '../../contexts/CartContext';

interface BundleCardProps {
  bundle: Bundle & { availability?: number, isAvailable?: boolean };
  onViewDetails?: (bundle: Bundle) => void;
}

export const BundleCard: React.FC<BundleCardProps> = ({ bundle, onViewDetails }) => {
  const { formatPrice } = useCurrency();
  const { addBundle } = useCart();
  const pricing = getBundlePricing(bundle);

  const typeLabels = {
    combo: 'COMBO',
    pack: 'PACK',
    kit: 'KIT'
  };

  const typeVariants = {
    combo: 'gold' as const,
    pack: 'success' as const,
    kit: 'default' as const
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {bundle.image_url ? (
          <img
            src={bundle.image_url}
            alt={bundle.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package size={48} strokeWidth={1} />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant={typeVariants[bundle.type]}>{typeLabels[bundle.type]}</Badge>
          {pricing.discountPercentage > 0 && (
            <Badge variant="gold">AHORRA {pricing.discountPercentage}%</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-mare-navy text-sm uppercase tracking-tight line-clamp-1 mb-1">
          {bundle.name}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {bundle.description}
        </p>

        {/* Components Preview */}
        <div className="mt-auto space-y-1.5 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Incluye:</p>
          <div className="flex flex-col gap-1">
            {bundle.items?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-mare-navy font-medium">
                <div className="w-1 h-1 rounded-full bg-mare-turquoise" />
                <span className="flex-1 truncate">{item.product?.nombre}</span>
                <span className="text-gray-400 font-bold">x{item.quantity}</span>
              </div>
            ))}
            {(bundle.items?.length || 0) > 3 && (
              <p className="text-[10px] text-mare-turquoise font-bold italic">
                + {(bundle.items?.length || 0) - 3} productos más
              </p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between gap-2 mt-2">
          <div className="flex flex-col">
            {pricing.hasOffer && (
              <span className="text-[10px] text-gray-400 line-through font-bold">
                {formatPrice(pricing.originalPrice)}
              </span>
            )}
            <span className="text-lg font-black text-mare-navy leading-none">
              {formatPrice(pricing.finalPrice)}
            </span>
          </div>

          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 rounded-xl"
              onClick={() => onViewDetails?.(bundle)}
            >
              <Info size={16} />
            </Button>
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl font-black text-[10px] tracking-wider uppercase"
              onClick={() => addBundle(bundle)}
              disabled={!bundle.isAvailable}
            >
              {bundle.isAvailable ? 'AGREGAR' : 'AGOTADO'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
