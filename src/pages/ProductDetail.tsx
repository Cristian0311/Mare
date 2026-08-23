import { configService } from '../services/config';
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, ChevronRight, ArrowLeft, Heart, Check, Minus, Plus, ShoppingBag, X, Eye, Package, Truck, MessageCircle, ShieldCheck } from 'lucide-react';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProductGrid } from '../components/ui/ProductGrid';
import { ProductCard } from '../components/ui/ProductCard';

import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePromotions } from '../contexts/PromotionContext';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { shareProduct, buildProductWhatsAppShare, copyToClipboard } from '../utils/share';
import { getProductPricing } from '../utils/pricing';
import { SEO } from '../components/ui/SEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/seo';
import { ProductRecommendations } from '../components/ProductRecommendations';

import { addRecentlyViewed } from '../utils/recentlyViewed';
import { recommendationEngine } from '../services/recommendationEngine';
import { metricsService } from '../services/metrics';
import { supabase } from '../lib/supabase/client';

const Divider = () => <div className="w-full border-b border-dashed border-mare-navy/15 my-6"></div>;

export function ProductDetail() {
  const [config, setConfig] = useState(configService.getConfigSync());
  useEffect(() => {
    const handleConfigUpdate = () => setConfig(configService.getConfigSync());
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);
  const [productViews, setProductViews] = useState<number | null>(null);

  const [isWholesaleState, setIsWholesaleState] = useState(false);
  const [products, setProducts] = useState(productService.getProductsSync());
  const [categories, setCategories] = useState(categoryService.getCategoriesSync());

  useEffect(() => {
    const handleProductsUpdate = () => setProducts(productService.getProductsSync());
    const handleCategoriesUpdate = () => setCategories(categoryService.getCategoriesSync());
    
    window.addEventListener('mare_products_updated', handleProductsUpdate);
    window.addEventListener('mare_categories_updated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('mare_products_updated', handleProductsUpdate);
      window.removeEventListener('mare_categories_updated', handleCategoriesUpdate);
    };
  }, []);

  // Scroll to top on mount and slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Reset wholesale if product changes or doesn't have it
  useEffect(() => {
    setIsWholesaleState(false);
  }, [slug]);

  const { addItem, items } = useCart();
  const { currency: currentCurrency, formatPrice } = useCurrency();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getBestPrice } = usePromotions();
  const { toast } = useToast();

  const product = useMemo(() => 
    slug ? productService.getProductBySlugSync(slug) : undefined
  , [slug, products]);
  
  const forceWholesale = product?.ventaMayorista?.habilitada && product?.precioMN === 0;
  const isWholesale = forceWholesale ? true : isWholesaleState;

  // Sync quantity with wholesale minimum
  useEffect(() => {
    if (isWholesale && product?.ventaMayorista?.cantidadMinima && quantity < product.ventaMayorista.cantidadMinima) {
      setQuantity(product.ventaMayorista.cantidadMinima);
    }
  }, [isWholesale, product, quantity]);
  
  const pricing = useMemo(() => 
    product ? getBestPrice(product, quantity, isWholesale) : null
  , [product, quantity, isWholesale, getBestPrice]);
  
  
  const displayPrice = pricing?.finalPrice || 0;

  const totalUnits = (isWholesale && product?.ventaMayorista?.unidadesPorPresentacion)
    ? quantity * product.ventaMayorista.unidadesPorPresentacion
    : quantity;

  const totalPrice = displayPrice * totalUnits;

  const category = product ? categories.find(c => c.id === product.categoria) : null;
  const subcategory = category?.subcategorias?.find(s => s.id === product.subcategoria);

  const seoData = useMemo(() => {
    if (!product || !pricing) return null;
    
    const url = window.location.href;
    const breadcrumbs = [
      { name: 'Inicio', item: '/' },
      { name: category?.nombre || 'Categorías', item: `/categoria/${category?.slug || ''}` }
    ];
    
    if (subcategory) {
      breadcrumbs.push({ name: subcategory.nombre, item: `/categoria/${category?.slug}/${subcategory.slug}` });
    }
    
    breadcrumbs.push({ name: product.nombre, item: url });

    return {
      productSchema: generateProductSchema(product, pricing.finalPrice, url),
      breadcrumbSchema: generateBreadcrumbSchema(breadcrumbs)
    };
  }, [product, pricing, category, subcategory]);

  // Initialize selected variants if any
  useEffect(() => {
    if (product) {
      if (product.id) {
        addRecentlyViewed(product.id);
        recommendationEngine.trackEvent('view', product.id, product.categoria_id, 'product_detail');
        
        // Track product view and fetch current views
        const handleViews = async () => {
          const views = await metricsService.incrementProductViews(product.id);
          setProductViews(views);
        };
        handleViews();
      }
      if (product.opcionesVariantes) {
        const initial: Record<string, string> = {};
        product.opcionesVariantes.forEach(opt => {
          initial[opt.nombre] = opt.valores[0];
        });
        setSelectedVariants(initial);
      }
      setQuantity(1);
      setActiveImage(0);
    }
  }, [product]);
  
  const favorite = product ? isFavorite(product.id) : false;

  const handleToggleFavorite = () => {
    if (!product) return;
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

  const handleShare = async () => {
    if (!product || !pricing) return;
    
    const url = window.location.href;
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
          description: 'El enlace al producto se ha copiado al portapapeles.'
        });
      } else {
        // WhatsApp as last resort
        const whatsappUrl = buildProductWhatsAppShare(product.nombre, priceText, url);
        window.open(whatsappUrl, '_blank');
      }
    }
  };
  
  // relatedProducts useMemo...
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    
    // Prioritize same subcategory, then same category
    const related = products.filter(p => p.id !== product.id && p.activo !== false);
    
    const sameSub = subcategory 
      ? related.filter(p => p.subcategoria === product.subcategoria)
      : [];
      
    const sameCat = related.filter(p => p.categoria === product.categoria && !sameSub.some(s => s.id === p.id));
    
    const sameTags = related.filter(p => 
      p.etiquetas.some(t => product.etiquetas.includes(t)) && 
      !sameSub.some(s => s.id === p.id) && 
      !sameCat.some(c => c.id === p.id)
    );

    return [...sameSub, ...sameCat, ...sameTags].slice(0, 4);
  }, [product, subcategory]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <h2 className="text-2xl font-black text-mare-navy mb-4 tracking-tight">Producto no encontrado</h2>
        <p className="text-gray-500 mb-8 font-medium">El producto que buscas no está disponible.</p>
        <Button onClick={() => navigate('/')} variant="primary" className="rounded-xl px-8 font-black text-[10px] tracking-widest h-12">
          VOLVER A LA TIENDA
        </Button>
      </div>
    );
  }

  const isAvailable = product.disponibilidad !== 'agotado' && 
                      product.availability_status !== 'out_of_stock' && 
                      (product.stock === undefined || product.stock > 0);

  const handleDecrease = () => {
    if (quantity > 1) {
      const nextQuantity = quantity - 1;
      
      // Prevent going below minimum if wholesale is forced
      if (forceWholesale && product?.ventaMayorista && nextQuantity < product.ventaMayorista.cantidadMinima) {
        toast({
          type: 'info',
          title: 'Mínimo Mayorista',
          description: `Este producto solo se vende al por mayor (mín. ${product.ventaMayorista.cantidadMinima}).`
        });
        return;
      }

      setQuantity(nextQuantity);
      
      // Auto-switch to retail if below wholesale minimum (only if not forced)
      if (!forceWholesale && isWholesale && product?.ventaMayorista && nextQuantity < product.ventaMayorista.cantidadMinima) {
        setIsWholesaleState(false);
        toast({
          type: 'info',
          title: 'Venta al Detalle',
          description: 'Se ha cambiado a precio por unidad por estar debajo del mínimo mayorista.'
        });
      }
    }
  };

  const handleIncrease = () => {
    if (quantity < 999) {
      const nextQuantity = quantity + 1;
      setQuantity(nextQuantity);

      // Auto-activate wholesale if eligible and reached minimum
      if (!isWholesale && product?.ventaMayorista?.habilitada && product.ventaMayorista.cantidadMinima && nextQuantity >= product.ventaMayorista.cantidadMinima) {
        setIsWholesaleState(true);
        toast({
          type: 'success',
          title: '¡Modo Mayorista Activado!',
          description: `Alcanzaste el mínimo de ${product.ventaMayorista.cantidadMinima} unidades.`
        });
      }
    }
  };

  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    // Check if all variants are selected (only if not wholesale, as wholesale is mixed box)
    if (!isWholesale && product.opcionesVariantes && product.opcionesVariantes.length > 0) {
      const missingVariants = product.opcionesVariantes.filter(opt => !selectedVariants[opt.nombre]);
      if (missingVariants.length > 0) {
        toast({ 
          type: 'error', 
          title: 'Selección requerida', 
          description: `Por favor selecciona: ${missingVariants.map(m => m.nombre).join(', ')}` 
        });
        return;
      }
    }

    const retailPricing = getBestPrice(product, 1, false);
    const variantId = isWholesale ? 'surtido-mixto' : Object.values(selectedVariants).join('-');
    const variantName = isWholesale ? 'Surtido Mixto' : Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ');
    
    // Si ya fue agregado recientemente con la MISMA variante y el MISMO estado (mayorista/reserva), 
    // entonces navegamos al carrito. De lo contrario, permitimos agregar la nueva variante/opción.
    const alreadyInCartRecently = addedRecently && items.some(item => 
      item.id === product.id && 
      item.selectedVariantId === (variantId || undefined) && 
      item.isWholesale === isWholesale
    );

    if (alreadyInCartRecently) {
      navigate('/mi-pedido');
      return;
    }
    
    setIsAdding(true);
    
    addItem(
      product, 
      quantity, 
      variantId || undefined, 
      variantName || undefined,
      isWholesale
    );
    
    setTimeout(() => {
      setIsAdding(false);
      setAddedRecently(true);
      setTimeout(() => setAddedRecently(false), 5000);
    }, 600);
  };

  const handleVariantSelect = (optionName: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [optionName]: value }));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 lg:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {product && (
        <>
          <SEO 
            title={product.nombre}
            description={product.descripcionCorta}
            ogImage={product.imagenes[0]}
            ogType="product"
            structuredData={seoData?.productSchema}
            productData={{
              price: pricing.finalPrice,
              currency: currentCurrency,
              availability: isAvailable ? 'in stock' : 'out of stock'
            }}
          />
          {seoData?.breadcrumbSchema && (
             <script type="application/ld+json">
               {JSON.stringify(seoData.breadcrumbSchema)}
             </script>
          )}
        </>
      )}
      {/* Breadcrumbs Móvil */}
      <div className="lg:hidden flex items-center py-3 mb-1">
        <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-mare-navy transition-colors">
          <ArrowLeft strokeWidth={2} className="w-3 h-3 mr-1" />
          {category ? category.nombre : 'Volver'}
        </button>
      </div>

      {/* Breadcrumbs Desktop */}
      <div className="hidden lg:flex items-center py-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-2">
        <Link to="/" className="hover:text-mare-green transition-colors">Inicio</Link>
        <ChevronRight strokeWidth={1.5} className="w-3 h-3" />
        {category && (
          <>
            <Link to={`/categoria/${category.slug}`} className="hover:text-mare-green transition-colors">{category.nombre}</Link>
            <ChevronRight strokeWidth={1.5} className="w-3 h-3" />
          </>
        )}
        <span className="text-mare-navy truncate max-w-xs">{product.nombre}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-8">
        {/* IZQUIERDA: Galería */}
        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          <div 
            className="aspect-square bg-white rounded-2xl overflow-hidden relative border border-gray-100 cursor-zoom-in group"
            onClick={() => setZoomOpen(true)}
          >
            <img 
              src={product.imagenes[activeImage]} 
              alt={product.nombre} 
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors focus:outline-none"
                aria-label={favorite ? `Eliminar ${product.nombre} de favoritos` : `Agregar ${product.nombre} a favoritos`}
              >
                <motion.div animate={{ scale: favorite ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.2 }}>
                  <Heart strokeWidth={1.5} className={`h-4 w-4 transition-colors ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </motion.div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors focus:outline-none"
                aria-label="Compartir producto"
              >
                <Share2 strokeWidth={1.5} className="h-4 w-4 text-gray-400 hover:text-mare-green transition-colors" />
              </button>
            </div>
            
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start pointer-events-none max-w-[80%]">
              {!isAvailable && <Badge variant="error" className="shadow-sm text-[8px] sm:text-[9px] py-0.5">Agotado</Badge>}
              {pricing?.hasOffer && isAvailable && <Badge variant="gold" className="shadow-sm text-[8px] sm:text-[9px] py-0.5">-{pricing.discountPercentage}%</Badge>}
              {!pricing?.hasOffer && product.oferta && isAvailable && <Badge variant="gold" className="shadow-sm text-[8px] sm:text-[9px] py-0.5">Oferta</Badge>}
              {product.nuevo && isAvailable && <Badge variant="success" className="shadow-sm text-[8px] sm:text-[9px] py-0.5">Nuevo</Badge>}
            </div>

          </div>
          
          {/* Miniaturas de imágenes */}
          {product.imagenes && product.imagenes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x hide-scrollbar mt-2">
              {product.imagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all bg-white snap-start ${
                    activeImage === idx ? 'border-mare-green ring-2 ring-mare-green/10' : 'border-transparent hover:border-gray-200'
                  }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DERECHA: Información Principal */}
        <div className="w-full lg:w-1/2 flex flex-col min-w-0">
          {/* Título */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-mare-navy tracking-tight leading-tight mb-1 uppercase">
              {product.nombre}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 line-clamp-2">
              {product.descripcionCorta}
            </p>
          </div>

          <Divider />

          {/* Precio más compacto */}
          <div className="flex flex-col gap-4 py-1">
            {/* VENTA AL DETALLE */}
            {product.precioMN === 0 && product.ventaMayorista?.habilitada ? (
              <div className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[12px] font-black text-red-500 uppercase tracking-widest mb-1">
                  Solo Venta Mayorista
                </span>
                <p className="text-[11px] text-gray-600 font-medium">
                  Este producto no admite compra por unidad.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {'Venta al Detalle'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl lg:text-3xl font-black leading-none tracking-tighter text-mare-navy">
                    {formatPrice(displayPrice)}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">/ unidad</span>
                </div>
                
                {pricing?.hasOffer && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-bold line-through">
                      {formatPrice(pricing.originalPrice)}
                    </span>
                    <span className="text-[9px] font-black text-mare-gold bg-mare-gold/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      OFERTA -{pricing.discountPercentage}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* VENTA MAYORISTA */}
            {product.ventaMayorista?.habilitada && (
              <div className={`p-4 rounded-2xl border transition-all ${isWholesale ? 'bg-mare-green/[0.03] border-mare-green/20' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className={`w-4 h-4 ${isWholesale ? 'text-mare-green' : 'text-gray-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isWholesale ? 'text-mare-green' : 'text-gray-400'}`}>Venta Mayorista</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Activar</span>
                    <button 
                      onClick={() => {
                        if (!forceWholesale) {
                          const nextState = !isWholesale;
                          setIsWholesaleState(nextState);
                          if (nextState) {
                            if (product?.ventaMayorista?.cantidadMinima && quantity < product.ventaMayorista.cantidadMinima) {
                              setQuantity(product.ventaMayorista.cantidadMinima);
                            }
                          } else {
                            setQuantity(1);
                          }
                        }
                      }}
                      disabled={forceWholesale}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isWholesale ? 'bg-mare-green' : 'bg-gray-200'} ${forceWholesale ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isWholesale ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl lg:text-2xl font-black leading-none tracking-tighter ${isWholesale ? 'text-mare-green' : 'text-gray-400'}`}>
                    {formatPrice(product.ventaMayorista.precioMN)}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">/ unidad</span>
                </div>

                <p className="text-[10px] font-medium text-gray-500 mt-2">
                  Mínimo {product.ventaMayorista.cantidadMinima} {product.ventaMayorista.presentacion.toLowerCase()}s de {product.ventaMayorista.unidadesPorPresentacion} u.
                </p>
              </div>
            )}
          </div>

          <Divider />

          {/* Variantes */}
          {product.opcionesVariantes && product.opcionesVariantes.length > 0 && (
            isWholesale ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 my-2">
                <Package className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                    Surtido Mixto (Caja / Lote Variado)
                  </span>
                  <span className="text-[9px] font-medium text-amber-700/90 leading-snug">
                    En compras al por mayor la presentación se entrega en caja con variedad mixta de colores y tallas según disponibilidad de almacén.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5 py-2">
                {product.opcionesVariantes.map((option) => (
                  <div key={option.nombre} className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{option.nombre}</h3>
                      {selectedVariants[option.nombre] && (
                        <span className="text-[9px] font-black text-mare-green uppercase tracking-widest">Seleccionado</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {option.valores.map((val) => (
                        <button
                          key={val}
                          onClick={() => handleVariantSelect(option.nombre, val)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                            selectedVariants[option.nombre] === val
                              ? 'bg-mare-navy text-white border-mare-navy shadow-md ring-2 ring-mare-navy/10'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          
          <Divider />

          {/* Cantidad - Más pequeña */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                {isWholesale ? `Cantidad de ${product.ventaMayorista?.presentacion.toLowerCase()}s` : 'Cantidad'}
              </h3>
              <div className="flex items-center w-fit bg-gray-50 border border-gray-200 rounded-xl p-0.5 shadow-inner">
                <button 
                  onClick={handleDecrease}
                  className="p-2 text-gray-400 hover:text-mare-navy hover:bg-white rounded-lg transition-all disabled:opacity-30"
                  disabled={quantity <= 1 || !isAvailable}
                  aria-label="Reducir cantidad"
                >
                  <Minus strokeWidth={2} className="w-3.5 h-3.5" />
                </button>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) {
                      setQuantity(val);
                      // Auto-activate wholesale if eligible and reached minimum
                      if (!isWholesale && product?.ventaMayorista?.habilitada && product.ventaMayorista.cantidadMinima && val >= product.ventaMayorista.cantidadMinima) {
                        setIsWholesaleState(true);
                        toast({
                          type: 'success',
                          title: '¡Modo Mayorista Activado!',
                          description: `Alcanzaste el mínimo de ${product.ventaMayorista.cantidadMinima} unidades.`
                        });
                      } else if (isWholesale && !forceWholesale && product?.ventaMayorista?.cantidadMinima && val < product.ventaMayorista.cantidadMinima) {
                        setIsWholesaleState(false);
                        toast({
                          type: 'info',
                          title: 'Venta al Detalle',
                          description: 'Se ha cambiado a precio por unidad por estar debajo del mínimo mayorista.'
                        });
                      }
                    } else if (e.target.value === '') {
                      setQuantity(1);
                      if (isWholesale && !forceWholesale) {
                        setIsWholesaleState(false);
                      }
                    }
                  }}
                  className="w-12 text-center font-black text-sm text-mare-navy bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={!isAvailable}
                />
                <button 
                  onClick={handleIncrease}
                  className="p-2 text-gray-400 hover:text-mare-navy hover:bg-white rounded-lg transition-all disabled:opacity-30"
                  disabled={!isAvailable}
                  aria-label="Aumentar cantidad"
                >
                  <Plus strokeWidth={2} className="w-3.5 h-3.5" />
                </button>
              </div>
              {isWholesale && (product.ventaMayorista?.unidadesPorPresentacion || 0) > 0 && (
                <div className="mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1">
                  <div className="w-1 h-1 rounded-full bg-mare-green"></div>
                  <span className="text-[10px] font-black text-mare-green uppercase tracking-tight">
                    Total: {quantity * product.ventaMayorista.unidadesPorPresentacion} unidades
                  </span>
                </div>
              )}
            </div>

            {/* Total Simple al lado de cantidad */}
            <div className="text-right">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Total</span>
              <div className="flex flex-col items-end">
                <div className="whitespace-nowrap">
                  <span className="text-xl font-black leading-none tracking-tighter inline-block text-mare-navy">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                {pricing && pricing.savings > 0 && (
                  <div className="mt-1.5 flex flex-col items-end animate-in fade-in slide-in-from-right-1">
                    <span className="text-[9px] font-black text-mare-green bg-mare-green/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      ESTÁS AHORRANDO {formatPrice(pricing.savings * totalUnits)}
                    </span>
                    {isWholesale && (
                      <span className="text-[7px] font-bold text-gray-400 uppercase mt-0.5">
                        PRECIO MAYORISTA APLICADO
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="my-6"></div>
          
          {/* Acciones - Botón principal */}
          <div className="flex flex-col gap-3">
            <Button 
              variant={addedRecently ? "outline" : "primary"}
              className={`w-full h-12 font-black tracking-widest text-[10px] rounded-xl shadow-md gap-2 relative overflow-hidden transition-all duration-300 ${isAdding ? 'scale-[0.98] opacity-90' : ''}`}
              onClick={handleAddToCart}
              disabled={!isAvailable || isAdding}
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AÑADIENDO...
                </div>
              ) : addedRecently ? (
                <>
                  <Check strokeWidth={3} className="w-4 h-4 text-mare-green" />
                  ✓ AGREGADO A MI PEDIDO
                </>
              ) : !isAvailable ? (
                'AGOTADO'
              ) : (
                <>
                  <ShoppingBag strokeWidth={2} className="w-3.5 h-3.5" />
                  {'AÑADIR AL PEDIDO'}
                </>
              )}
            </Button>

            {addedRecently && (
              <div className="grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-300">
                <Button 
                  variant="outline"
                  className="h-10 text-[9px] font-black tracking-widest rounded-xl border-mare-navy/10"
                  onClick={() => navigate('/mi-pedido')}
                >
                  VER PEDIDO
                </Button>
              </div>
            )}
          </div>
          
          {!isAvailable && (
             <p className="mt-4 text-xs font-bold text-red-500 text-center bg-red-50 py-2 rounded-lg">
               Este producto está temporalmente agotado.
             </p>
          )}

        </div>
      </div>

      {/* ABAJO: Detalles y Entrega - Más compacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t border-gray-100">
        
        {/* Descripción */}
        <div className="lg:col-span-1">
          <h2 className="text-[10px] font-black text-mare-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1.5 h-3 bg-mare-gold rounded-full"></div>
            Descripción
          </h2>
          <div className="space-y-3">
            {product.descripcionCompleta.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
              <p key={i} className="text-xs text-gray-500 font-medium leading-relaxed break-words">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        {/* Entrega */}
        <div className="lg:col-span-1">
          <h2 className="text-[10px] font-black text-mare-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1.5 h-3 bg-mare-gold rounded-full"></div>
            Información de Entrega y Pago
          </h2>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mare-green/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-mare-green" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-mare-navy uppercase tracking-widest mb-1">Envío a Domicilio</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Gestionamos su entrega entre 24h y 72h. Un asesor coordinará con usted el horario exacto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mare-gold/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-mare-gold" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-mare-navy uppercase tracking-widest mb-1">Pedido por WhatsApp</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Al finalizar su pedido, se enviará automáticamente un mensaje a nuestro equipo para confirmar disponibilidad y pago.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-mare-turquoise/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-mare-turquoise" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-mare-navy uppercase tracking-widest mb-1">Garantía MARÉ</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Revisamos cada producto antes de salir. Su satisfacción y seguridad en el pago son nuestra prioridad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-gray-100">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Método de Pago</span>
                <span className="text-[10px] font-black text-mare-navy uppercase tracking-widest">Transferencia / Efectivo</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      
      {/* Recomendaciones Inteligentes */}
      {product?.id && (
        <div className="space-y-6">
          <ProductRecommendations 
            productId={product.id} 
            categoryId={product.categoria_id} 
            type="related" 
            title="También te puede interesar" 
            isWholesale={isWholesale}
          />
          <ProductRecommendations 
            productId={product.id} 
            categoryId={product.categoria_id} 
            type="complementary" 
            title="Completa tu compra" 
            isWholesale={isWholesale}
          />
        </div>
      )}

      {/* Categorías Relacionadas */}
      {category && (
        <div className="mt-12 mb-8">
          <h2 className="text-[10px] font-black text-mare-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1.5 h-3 bg-mare-gold rounded-full"></div>
            Explorar Categorías
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link to={`/categoria/${category.slug}`} className="px-4 py-2 bg-gray-50 hover:bg-mare-green hover:text-white text-mare-navy rounded-xl text-xs font-bold transition-colors">
              {category.nombre}
            </Link>
            {category.subcategorias?.map(sub => (
               <Link key={sub.id} to={`/categoria/${category.slug}/${sub.slug}`} className="px-4 py-2 bg-gray-50 hover:bg-mare-green hover:text-white text-mare-navy rounded-xl text-xs font-bold transition-colors">
                 {sub.nombre}
               </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos Relacionados - Espaciado Ajustado */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-black text-mare-navy tracking-tight mb-6">También puede interesarte</h2>
          <ProductGrid>
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </div>
      )}

      {/* Barra Inferior Fija Móvil - Más Compacta */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex flex-col flex-1 shrink-0 min-w-0">
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total</span>
             <span className="text-[15px] font-black text-mare-navy leading-none tracking-tighter whitespace-nowrap">
               {formatPrice(totalPrice)}
             </span>
          </div>
          <Button 
            variant={addedRecently ? "outline" : "primary"} 
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`flex-1 h-11 rounded-xl font-black text-[9px] tracking-widest shadow-md min-w-[130px] transition-all duration-300 ${isAdding ? 'opacity-90' : ''}`}
          >
            {isAdding ? 'AÑADIENDO...' : addedRecently ? '✓ AGREGADO' : !isAvailable ? 'AGOTADO' : 'AÑADIR AL PEDIDO'}
          </Button>
        </div>
      </div>

      {/* Visor de Imágenes (Zoom) */}
      <AnimatePresence>
        {zoomOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex flex-col"
            >
              <div className="absolute top-4 left-4 z-10 bg-mare-navy/85 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-mare-gold animate-pulse"></span>
                <span>Imagen {activeImage + 1} de {product.imagenes.length}</span>
              </div>
              
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setZoomOpen(false)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-mare-navy transition-colors"
                  aria-label="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-4">
                <img 
                  src={product.imagenes[activeImage]} 
                  alt={product.nombre} 
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>

              {product.imagenes.length > 1 && (
                <div className="pb-8 px-4 flex justify-center gap-3 overflow-x-auto">
                  {product.imagenes.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                        activeImage === idx ? 'border-mare-green' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
