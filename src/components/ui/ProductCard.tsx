import React from 'react';
import { ShareNetwork, Heart } from 'phosphor-react';
import { Product, ProductAvailability } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { HighlightedText } from './HighlightedText';
import { Image } from './Image';
import { useToast } from '../../contexts/ToastContext';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { usePromotions } from '../../contexts/PromotionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { shareProduct, buildProductWhatsAppShare, copyToClipboard } from '../../utils/share';
import { getProductPricing } from '../../utils/pricing';

interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
  onClick?: (product: Product) => void;
  highlight?: string;
}

const availabilityConfig: Record<string, { text: string; color: string; dot: string }> = {
  'disponible': { text: 'Disponible', color: 'text-green-600', dot: 'bg-green-500' },
  'available': { text: 'Disponible', color: 'text-green-600', dot: 'bg-green-500' },
  'agotado': { text: 'Agotado', color: 'text-red-600', dot: 'bg-red-500' },
  'out_of_stock': { text: 'Agotado', color: 'text-red-600', dot: 'bg-red-500' },
};

export function ProductCard({ product, onAdd, onClick, highlight = '' }: ProductCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getBestPrice } = usePromotions();
  
  const pricing = getBestPrice(product, 1, false);

  const favorite = isFavorite(product.id);

  // Use availability_status if available, fallback to legacy disponibilidad
  const availKey = (product.availability_status || product.disponibilidad || 'disponible').toLowerCase();
  
  let avail;
  if (availabilityConfig[availKey]) {
    avail = availabilityConfig[availKey];
  } else if (availKey === 'agotado') {
    avail = { text: 'Agotado', color: 'text-red-600', dot: 'bg-red-500' };
  } else {
    avail = { text: 'Disponible', color: 'text-green-600', dot: 'bg-green-500' };
  }

  const displayTags = [];
  
  // Si no es reserva, mostramos el estado de disponibilidad si es algo especial (ej: 24h, 48h, etc)
  if (availKey !== 'disponible' && availKey !== 'available') {
    displayTags.push({ text: avail.text, variant: availKey === 'agotado' || availKey === 'out_of_stock' ? 'error' : 'default' as const });
  }

  if (pricing.discountPercentage > 0) displayTags.push({ text: `-${pricing.discountPercentage}%`, variant: 'gold' as const });
  else if (product.oferta) displayTags.push({ text: 'Oferta', variant: 'gold' as const });
  if (product.ventaMayorista?.habilitada) displayTags.push({ text: 'Mayorista', variant: 'success' as const });
  if (product.nuevo) displayTags.push({ text: 'Nuevo', variant: 'success' as const });

  if (product.etiquetas) {
    for (const tag of product.etiquetas) {
      if (displayTags.length >= 2) break;
      if (tag !== 'oferta' && tag !== 'nuevo' && tag !== 'mas-buscado' && tag !== 'destacado') {
        displayTags.push({ text: tag.replace('-', ' '), variant: 'default' as const });
      }
    }
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    if (!favorite) {
      toast({ type: 'info', title: 'Guardado en favoritos' });
    } else {
      toast({ 
        type: 'info', 
        title: 'Eliminado de favoritos',
        action: {
          label: 'Deshacer',
          onClick: () => toggleFavorite(product.id)
        }
      });
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/producto/${product.slug}`;
    const priceText = formatPrice(pricing.finalPrice);
    
    const options = {
      title: `MARÉ — ${product.nombre}`,
      text: `Mira este producto que encontré en MARÉ: ${product.nombre} por solo ${priceText}.`,
      url: url
    };

    const result = await shareProduct(options);
    
    if (result.method === 'fallback') {
      const copied = await copyToClipboard(url);
      if (copied) {
        toast({
          type: 'success',
          title: 'Enlace copiado',
          description: 'Copiado al portapapeles'
        });
      } else {
        const whatsappUrl = buildProductWhatsAppShare(product.nombre, priceText, url);
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if product requires variants or wholesale options (Fase 22 integration)
    // If it has variants or 'paquete'/'caja' options, we must go to product detail
    // to let the user select the correct option.
    const hasVariants = product.variantes && product.variantes.length > 0;
    const hasOptions = product.opcionesVariantes && product.opcionesVariantes.length > 0;
    const hasWholesale = product.ventaMayorista?.habilitada;
    
    if (hasVariants || hasOptions || hasWholesale) {
      if (hasWholesale) {
        toast({ type: 'info', title: 'Venta Mayorista disponible', description: 'Revisa los precios por volumen en el detalle.' });
      } else {
        toast({ type: 'info', title: 'Opciones requeridas', description: 'Por favor, selecciona una opción antes de añadir al pedido.' });
      }
      navigate(`/producto/${product.slug}`);
      return;
    }

    if (onAdd) {
      onAdd(product);
    } else {
      addItem(product);
    }
  };
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      navigate(`/producto/${product.slug}`);
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className={`group flex flex-col rounded-2xl border transition-all duration-300 cursor-pointer h-full p-2.5 sm:p-3 overflow-hidden ${
'bg-white border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-gray-200'
      } hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 active:scale-[0.98]`}
      onClick={handleCardClick}
      role="article"
    >
<div className="relative aspect-square overflow-hidden rounded-xl mb-3 flex items-center justify-center bg-gray-50/80">
        <Image 
          src={product.imagenes[0]} 
          alt={product.nombre}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute top-2 left-2 flex flex-row flex-wrap gap-1 z-10 items-center max-w-[85%]">
          {displayTags.map((tag, idx) => (
            <Badge 
              key={idx} 
              variant={tag.variant} 
              className="shadow-sm text-[7px] sm:text-[8px] px-1.5 py-0.5 transition-colors font-black uppercase tracking-wider rounded-md whitespace-nowrap bg-white/95 backdrop-blur-sm group-hover:bg-white"
            >
              {tag.text}
            </Badge>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-300">
          {/* Botón Favorito */}
          <button
            id={`btn-fav-${product.id}`}
            onClick={handleFavoriteClick}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all focus:outline-none"
            aria-label={favorite ? `Eliminar ${product.nombre} de favoritos` : `Agregar ${product.nombre} a favoritos`}
          >
            <motion.div
              animate={{ scale: favorite ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Heart 
                weight={favorite ? "fill" : "bold"}
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${favorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
              />
            </motion.div>
          </button>

          {/* Botón Compartir */}
          <button
            id={`btn-share-${product.id}`}
            onClick={handleShareClick}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all focus:outline-none"
            aria-label="Compartir producto"
          >
            <ShareNetwork weight="bold" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 hover:text-mare-green transition-colors" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 px-1">
        {/* Nombre y Disponibilidad agrupados */}
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-1.5 min-w-0 overflow-hidden">
            <span className={`w-1 h-1 rounded-full shrink-0 ${avail.dot}`}></span>
            <span className={`text-[7px] font-bold uppercase tracking-widest truncate ${avail.color}`}>
              {avail.text}
            </span>
          </div>
          <h3 className="font-black text-mare-navy text-[11px] sm:text-xs leading-snug line-clamp-2 min-h-[1.7rem] group-hover:text-mare-green transition-colors" title={product.nombre}>
            <HighlightedText text={product.nombre} highlight={highlight} />
          </h3>
        </div>
        
        <div className="mt-auto">
          {/* Precios y Ofertas */}
          <div className="pt-2 border-t border-gray-50 flex flex-col sm:flex-row sm:items-end justify-between gap-2 min-h-[44px]">
            <div className="flex flex-col min-w-0 flex-1">
              {product.ventaMayorista?.habilitada ? (
                <>
                  <div className="flex flex-col mb-1">
                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">
                      Unidad
                    </span>
                    {pricing.finalPrice > 0 ? (
                      <span className="font-black text-[10px] sm:text-[12px] leading-none text-mare-navy">
                        {formatPrice(pricing.finalPrice)}
                      </span>
                    ) : (
                      <span className="text-[9px] text-mare-green font-bold uppercase tracking-widest leading-none">
                        Solo mayorista
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[7px] text-mare-green font-bold uppercase tracking-widest leading-none mb-0.5">
                      Mayorista
                    </span>
                    <div className="flex items-baseline gap-0.5 min-w-0 flex-nowrap overflow-hidden">
                      <span className="font-black text-[11px] sm:text-[14px] leading-none text-mare-green">
                        {formatPrice(product.ventaMayorista.precioMN || 0)}
                      </span>
                      <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest shrink-0">
                        /{product.ventaMayorista.presentacion?.toLowerCase() || 'lote'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {pricing.hasOffer && (
                    <span className="text-[8px] text-gray-400 font-bold line-through leading-none mb-1 truncate">
                      {formatPrice(pricing.originalPrice)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-0.5 min-w-0 flex-nowrap overflow-hidden">
<span className="font-black text-[11px] sm:text-[14px] leading-none whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0 text-mare-navy">
                      {formatPrice(pricing.finalPrice)}
                    </span>
                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest shrink-0">
                      /u
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <Button 
              id={`btn-add-${product.id}`}
              variant="primary" 
              size="sm"
              onClick={handleAddClick}
              className={`w-full sm:w-auto h-6 sm:h-[26px] px-2 sm:px-2.5 font-black text-[7px] sm:text-[8px] shadow-sm transition-all uppercase tracking-tighter rounded-lg shrink-0 ${
'group-hover:bg-mare-turquoise'
              }`}
              disabled={availKey === 'agotado' || availKey === 'out_of_stock'}
            >
{'AÑADIR'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
