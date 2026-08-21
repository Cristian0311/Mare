import { useEffect, useState, useMemo } from 'react';
import { Hero } from '../components/ui/Hero';
import { CategoryCarousel } from '../components/product/CategoryCarousel';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ProductCarousel } from '../components/ui/ProductCarousel';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, MessageCircle, ShoppingBag, Users, Package } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { configService } from '../services/config';
import { bundleService } from '../services/bundleService';
import { Bundle } from '../types/bundle';
import { BundleCard } from '../components/ui/BundleCard';
import { ProductRecommendations } from '../components/ProductRecommendations';
import { metricsService } from '../services/metrics';

// Simulamos carga de productos desde un servicio o config real
import { getOffers as getPromotionalProducts, getNewProducts as getRecentProducts, getBestSellers, getFeaturedProducts, getWholesaleProducts, getAllPublicProducts } from '../utils/products';

import { SEO } from '../components/ui/SEO';

export function Home() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(configService.getConfigSync());
  const [productsVersion, setProductsVersion] = useState(0);
  const [activeBundles, setActiveBundles] = useState<Bundle[]>([]);
  const [globalVisits, setGlobalVisits] = useState<number | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBundles = async () => {
      try {
        const bundles = await bundleService.getActiveBundles();
        setActiveBundles(bundles);
      } catch (e) {
        // Handle bundle fetch error silently
      }
    };
    fetchBundles();

    // Fetch and increment global visits
    const handleVisits = async () => {
      try {
        await metricsService.incrementGlobalVisits();
        const visits = await metricsService.getGlobalVisits();
        setGlobalVisits(visits);
      } catch (e) {
        // Silent catch
      }
    };
    handleVisits();
  }, []);

  useEffect(() => {
    const handleConfigUpdate = () => {
      setConfig(configService.getConfigSync());
    };
    const handleProductsUpdate = () => {
      setProductsVersion(v => v + 1);
    };
    
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    window.addEventListener('mare_products_updated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('mare_config_updated', handleConfigUpdate);
      window.removeEventListener('mare_products_updated', handleProductsUpdate);
    };
  }, []);

  const ofertas = useMemo(() => getPromotionalProducts(), [productsVersion]);
  const recienLlegados = useMemo(() => getRecentProducts(), [productsVersion]);
  const recomendados = useMemo(() => getBestSellers(), [productsVersion]);
  const destacados = useMemo(() => getFeaturedProducts(), [productsVersion]);
  const mayorista = useMemo(() => getWholesaleProducts(), [productsVersion]);
  const todosLosProductos = useMemo(() => getAllPublicProducts(), [productsVersion]);

  return (
    <div className="space-y-12 md:space-y-20 pb-12">
      <SEO />
      {/* 1. Hero Principal */}
      <Hero />

      {/* 2. Categorías (Carousel Circular) */}
      <section>
        <CategoryCarousel />
      </section>

      {/* 3. Destacados */}
      {destacados.length > 0 && (
        <section>
          <SectionTitle 
            title="Productos destacados" 
            subtitle="Nuestra mejor selección y favoritos."
            action={
              <Link to="/coleccion/destacados">
                <Button variant="outline" className="text-[7px] font-black text-mare-navy border-mare-navy/20 bg-white hover:bg-mare-navy hover:text-white transition-all tracking-[0.2em] uppercase px-1.5 h-5 rounded-md shadow-sm">
                  VER TODO
                </Button>
              </Link>
            }
          />
          <ProductCarousel products={destacados} />
        </section>
      )}

      {/* 4. Combos y Ofertas (Bundles) */}
      {activeBundles.length > 0 && (
        <section>
          <SectionTitle 
            title="Combos y Ofertas" 
            subtitle="Los mejores productos juntos con descuento."
            action={
              <Link to="/combos">
                <Button variant="outline" className="text-[7px] font-black text-mare-navy border-mare-navy/20 bg-white hover:bg-mare-navy hover:text-white transition-all tracking-[0.2em] uppercase px-1.5 h-5 rounded-md shadow-sm">
                  VER TODO
                </Button>
              </Link>
            }
          />
          <div className="px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {activeBundles.slice(0, 3).map((bundle, idx) => (
                <BundleCard 
                  key={`home-bundle-${bundle.id}-${idx}`} 
                  bundle={bundle} 
                  onViewDetails={(b) => navigate(`/combos/${b.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Ofertas Especiales */}
      {ofertas.length > 0 && (
        <section>
          <SectionTitle 
            title="Ofertas Especiales" 
            subtitle="Precios por tiempo limitado."
            action={
              <Link to="/coleccion/ofertas">
                <Button variant="outline" className="text-[7px] font-black text-mare-navy border-mare-navy/20 bg-white hover:bg-mare-navy hover:text-white transition-all tracking-[0.2em] uppercase px-1.5 h-5 rounded-md shadow-sm">
                  VER TODO
                </Button>
              </Link>
            }
          />
          <ProductCarousel products={ofertas} />
        </section>
      )}

      {/* 6. Venta por Volumen */}
      {mayorista.length > 0 && (
        <section>
          <SectionTitle 
            title="Venta por Volumen" 
            subtitle="Precios especiales al por mayor."
            action={
              <Link to="/coleccion/mayorista" className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest hover:text-mare-green transition-colors">
                Ver todos
              </Link>
            }
          />
          <ProductCarousel products={mayorista} />
        </section>
      )}

      {/* 7. Nuevos / Recién Llegados */}
      {recienLlegados.length > 0 && (
        <section>
          <SectionTitle 
            title="Recién llegados" 
            subtitle="Descubre lo nuevo en la tienda."
            action={
              <Link to="/coleccion/novedades">
                <Button variant="outline" className="text-[7px] font-black text-mare-navy border-mare-navy/20 bg-white hover:bg-mare-navy hover:text-white transition-all tracking-[0.2em] uppercase px-1.5 h-5 rounded-md shadow-sm">
                  VER TODO
                </Button>
              </Link>
            }
          />
          <ProductCarousel products={recienLlegados} />
        </section>
      )}

      {/* 8. Todos los productos */}
      {todosLosProductos.length > 0 && (
        <section>
          <SectionTitle 
            title="Todos los productos" 
            subtitle="Explora nuestro catálogo completo."
            action={
              <Link to="/coleccion/todos">
                <Button variant="outline" className="text-[7px] font-black text-mare-navy border-mare-navy/20 bg-white hover:bg-mare-navy hover:text-white transition-all tracking-[0.2em] uppercase px-1.5 h-5 rounded-md shadow-sm">
                  VER TODO
                </Button>
              </Link>
            }
          />
          <ProductCarousel products={todosLosProductos} />
        </section>
      )}

      {/* Sección Personalizada: Pensado Para Ti */}
      <section className="px-4">
        <ProductRecommendations type="for_you" title="Pensado para ti" />
      </section>

      {/* Visto Recientemente */}
      <section className="px-4">
        <ProductRecommendations type="recently_viewed" title="Visto Recientemente" />
      </section>

      {/* 7. Sección MARÉ (Confianza compacta) */}
      <section className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-10 text-center flex flex-col items-center">
        <Logo className="mb-4 scale-110" />
        <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl leading-relaxed mb-8">
          Encuentra productos de diferentes categorías en un solo lugar, con una experiencia sencilla y pensada para ti.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100">
            <Truck className="h-5 w-5 text-mare-green mb-2" />
            <span className="text-[10px] font-bold text-mare-navy tracking-wider uppercase">Entrega Rápida</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100">
            <MessageCircle className="h-5 w-5 text-mare-green mb-2" />
            <span className="text-[10px] font-bold text-mare-navy tracking-wider uppercase">Pedido WhatsApp</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100">
            <span className="font-bold text-mare-green text-sm mb-1 leading-tight">{config.currency.base}</span>
            <span className="text-[10px] font-bold text-mare-navy tracking-wider uppercase">Precios {config.currency.base}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100">
            <ShieldCheck className="h-5 w-5 text-mare-green mb-2" />
            <span className="text-[10px] font-bold text-mare-navy tracking-wider uppercase">Garantía Total</span>
          </div>
        </div>
      </section>

      {/* 8. Recomendados */}
      {recomendados.length > 0 && (
        <section>
          <SectionTitle 
            title="También te puede interesar" 
            subtitle="Lo más popular."
            action={
              <Link to="/coleccion/recomendados">
                <Button variant="outline" className="text-[7px] font-black text-mare-navy border-mare-navy/20 bg-white hover:bg-mare-navy hover:text-white transition-all tracking-[0.2em] uppercase px-1.5 h-5 rounded-md shadow-sm">
                  VER TODO
                </Button>
              </Link>
            }
          />
          <ProductCarousel products={recomendados} />
        </section>
      )}

      {/* 9. CTA Final */}
      <section className="bg-mare-green text-white rounded-3xl p-5 md:p-8 text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-mare-turquoise opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mare-navy opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 mb-4">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2">
            Compra fácil por WhatsApp
          </h2>
          <p className="text-xs md:text-sm text-white/80 font-medium max-w-sm mx-auto mb-6 leading-relaxed">
            Selecciona tus productos y envía tu pedido directamente. Nosotros nos encargamos del resto.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/informacion/como-comprar')}
            className="font-black text-[9px] md:text-[10px] tracking-[0.2em] px-6 h-10 md:h-11 rounded-xl border-white/20 text-white hover:bg-white hover:text-mare-green transition-all"
          >
            VER GUÍA DE COMPRA
          </Button>
        </div>
      </section>
      
      {/* 10. Contador Global de Visitas */}
      {globalVisits !== null && (
        <section className="px-4 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2">
            <div className="bg-mare-navy/5 p-1.5 rounded-lg">
              <Users size={14} className="text-mare-navy" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Comunidad MARÉ
              </span>
              <span className="text-xs font-black text-mare-navy tracking-tight">
                {globalVisits.toLocaleString()} {globalVisits === 1 ? 'persona ha' : 'personas han'} visitado nuestra tienda
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
