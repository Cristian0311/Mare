import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CaretRight
} from 'phosphor-react';
import { categoryService } from '../services/categories';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ProductCarousel } from '../components/ui/ProductCarousel';
import { getProductsByCategory } from '../utils/products';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/ui/SEO';
import { Category } from '../types';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (e) {
        console.error(e);
        setCategories(categoryService.getCategoriesSync());
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('mare_categories_updated', handleUpdate);
    return () => window.removeEventListener('mare_categories_updated', handleUpdate);
  }, []);

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-mare-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <SEO 
        title="Categorías de Productos" 
        description="Explora todas las categorías de productos disponibles en MARÉ Cuba. Desde tecnología hasta hogar."
      />

      <div className="mb-10">
        <div className="bg-gradient-to-r from-mare-navy to-[#0B1320] rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-mare-green opacity-20 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-mare-gold opacity-10 blur-[60px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">Explorar por Categoría</h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium max-w-md mx-auto">
              Descubre nuestra amplia selección de productos organizados en cada sección.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map(category => {
          const categoryProducts = getProductsByCategory(category.id).slice(0, 8);
          const totalCount = getProductsByCategory(category.id).length;
          
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} className="relative">
              <SectionTitle
                title={category.nombre}
                subtitle={`${totalCount} productos`}
                
                action={
                  <Link to={`/categoria/${category.slug}`}>
                    <Button variant="outline" className="flex items-center text-[9px] md:text-[10px] font-black text-mare-green border-mare-green/30 bg-mare-green/5 hover:bg-mare-green hover:text-white transition-all tracking-widest uppercase px-3 py-1.5 h-auto rounded-full">
                      <span className="hidden sm:inline">Ver catálogo</span>
                      <span className="sm:hidden">Ver</span>
                      <CaretRight className="ml-1 sm:ml-1.5 h-3 w-3" />
                    </Button>
                  </Link>
                }
              />
              
              <ProductCarousel products={categoryProducts} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
