import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/ui/Hero';
import { CategoryCarousel } from '../components/product/CategoryCarousel';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ProductCarousel } from '../components/ui/ProductCarousel';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/ui/SEO';
import { getOffers, getNewProducts, getBestSellers, getFeaturedProducts, getAllPublicProducts } from '../utils/products';
import { productService } from '../services/products';

export function Home() {
  const [productsVersion, setProductsVersion] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    void productService.hydrate();
    const handleProductsUpdate = () => setProductsVersion(v => v + 1);
    window.addEventListener('mare_products_updated', handleProductsUpdate);
    return () => window.removeEventListener('mare_products_updated', handleProductsUpdate);
  }, []);

  const destacados = useMemo(() => getFeaturedProducts(6), [productsVersion]);
  const ofertas = useMemo(() => getOffers(6), [productsVersion]);
  const novedades = useMemo(() => getNewProducts(6), [productsVersion]);
  const masVendidos = useMemo(() => getBestSellers(6), [productsVersion]);
  const todos = useMemo(() => getAllPublicProducts(), [productsVersion]);

  return (
    <div className="space-y-12 md:space-y-20 pb-12">
      <SEO />
      <Hero />
      <section><CategoryCarousel /></section>

      {destacados.length > 0 && (
        <section>
          <SectionTitle
            title="Productos destacados"
            subtitle="Nuestra selección del catálogo."
            action={<Link to="/coleccion/destacados"><Button variant="outline">VER TODO</Button></Link>}
          />
          <ProductCarousel products={destacados} />
        </section>
      )}

      {ofertas.length > 0 && (
        <section>
          <SectionTitle
            title="Ofertas especiales"
            subtitle="Productos con precio promocional."
            action={<Link to="/coleccion/ofertas"><Button variant="outline">VER TODO</Button></Link>}
          />
          <ProductCarousel products={ofertas} />
        </section>
      )}

      {novedades.length > 0 && (
        <section>
          <SectionTitle
            title="Recién llegados"
            subtitle="Lo más reciente del catálogo."
            action={<Link to="/coleccion/novedades"><Button variant="outline">VER TODO</Button></Link>}
          />
          <ProductCarousel products={novedades} />
        </section>
      )}

      {masVendidos.length > 0 && (
        <section>
          <SectionTitle title="Más vendidos" subtitle="Productos destacados por el catálogo." />
          <ProductCarousel products={masVendidos} />
        </section>
      )}

      {todos.length > 0 && (
        <section>
          <SectionTitle title="Todo el catálogo" subtitle="Consulta todos los productos disponibles." />
          <ProductCarousel products={todos.slice(0, 12)} />
        </section>
      )}
    </div>
  );
}
