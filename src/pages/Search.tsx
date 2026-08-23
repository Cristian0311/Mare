import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, ArrowLeft } from 'lucide-react';
import { productService } from '../services/products';
import { Product } from '../types';
import { filterProducts, sortProducts, FilterOptions, SortOption } from '../utils/filters';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductGrid } from '../components/ui/ProductGrid';
import { Button } from '../components/ui/Button';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { FilterBar } from '../components/ui/FilterBar';
import { ActiveFilters } from '../components/ui/ActiveFilters';
import { SEO } from '../components/ui/SEO';

import { CategoryScrollNav } from '../components/ui/CategoryScrollNav';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: query
  });

  const seoTitle = query ? `Buscando: ${query}` : 'Explorar Productos';
  const seoDescription = query 
    ? `Resultados de búsqueda para ${query} en MARÉ. Encuentra los mejores productos y ofertas en Cuba.`
    : 'Explora el catálogo completo de MARÉ. Categorías, ofertas y productos exclusivos en Cuba.';

  const fetchProducts = async (isLoadMore = false) => {
    if (isLoadMore) setIsLoadingMore(true);
    else {
      setIsLoading(true);
    }

    try {
      const sortMap: Record<string, 'newest' | 'price-asc' | 'price-desc' | 'popular'> = {
        'newest': 'newest',
        'price-asc': 'price-asc',
        'price-desc': 'price-desc',
        'recommended': 'popular',
        'featured': 'popular'
      };

      const result = await productService.getPaginatedProducts({
        search: query,
        limit: 12,
        offset: isLoadMore ? offset : 0,
        sort: sortMap[sortOption] || 'newest',
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
        brand: filterOptions.brands?.[0], // Simplificamos a la primera marca por ahora
        category: filterOptions.categoryId
      });

      if (isLoadMore) {
        setProducts(prev => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }
      
      setTotalResults(result.total);
      setHasMore(result.hasMore);
      setOffset(result.nextOffset);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch products when search query, sort or filters change
  useEffect(() => {
    fetchProducts();
  }, [query, sortOption, filterOptions.minPrice, filterOptions.maxPrice, filterOptions.brands, filterOptions.categoryId]);

  // Sync query when it changes in URL
  useEffect(() => {
    setFilterOptions(prev => ({ ...prev, searchQuery: query }));
  }, [query]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  // Derived available filters (these could also be fetched from server in a real app)
  // For now we keep them static or derived from a separate quick fetch if needed
  const availableBrands = ['Nihao', 'Lg', 'Samsung', 'Mabe', 'Gree'];
  const availableTags = ['Oferta', 'Nuevo', 'Garantía'];

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <SEO title={seoTitle} description={seoDescription} />
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-mare-turquoise"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          {query ? (
            <h1 className="text-2xl font-bold text-mare-navy leading-tight">
              Resultados para: <span className="text-mare-green">"{query}"</span>
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-mare-navy leading-tight">
              Explorar Productos
            </h1>
          )}
        </div>
      </div>

      <div className="border-b border-dashed border-gray-200/60 mb-4 pb-2">
        <CategoryScrollNav options={filterOptions} onChange={setFilterOptions} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <FilterSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          options={filterOptions}
          onChange={setFilterOptions}
          availableBrands={availableBrands}
          availableTags={availableTags}
        />

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <FilterBar 
                totalItems={totalResults}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onOpenFilters={() => setIsSidebarOpen(true)}
                options={filterOptions}
                onChangeOptions={setFilterOptions}
              />
              
              <ActiveFilters 
                options={filterOptions}
                onChange={setFilterOptions}
              />

              <ProductGrid>
                {products.map(p => (
                  <ProductCard key={p.id} product={p} highlight={query} />
                ))}
              </ProductGrid>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button 
                    onClick={() => fetchProducts(true)} 
                    isLoading={isLoadingMore}
                    variant="outline"
                    className="px-8 rounded-full"
                  >
                    Cargar más resultados
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center w-full mt-4">
              <div className="bg-white rounded-3xl p-8 sm:p-12 w-full text-center border border-gray-100 shadow-sm flex flex-col items-center mb-12">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Box className="w-10 h-10 text-gray-300" />
                </div>
                {query ? (
                  <>
                    <h2 className="text-xl font-bold text-mare-navy mb-3">No encontramos productos relacionados con tu búsqueda.</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Revisa si hay algún error de escritura o intenta usar palabras más generales para encontrar lo que buscas.</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-mare-navy mb-3">¿Qué estás buscando?</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Explora nuestro catálogo utilizando el buscador, o navega por nuestras categorías.</p>
                  </>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => navigate('/categorias')} variant="outline">
                    Explorar categorías
                  </Button>
                  <Button onClick={() => navigate('/')} variant="primary">
                    Ver inicio
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
