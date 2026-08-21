import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, ArrowLeft } from 'lucide-react';
import { productService } from '../services/products';
import { searchProducts } from '../utils/search';
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
  const [products, setProducts] = useState(productService.getProductsSync());

  useEffect(() => {
    const handleUpdate = () => setProducts(productService.getProductsSync());
    window.addEventListener('mare_products_updated', handleUpdate);
    return () => window.removeEventListener('mare_products_updated', handleUpdate);
  }, []);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: query
  });

  const seoTitle = query ? `Buscando: ${query}` : 'Explorar Productos';
  const seoDescription = query 
    ? `Resultados de búsqueda para ${query} en MARÉ. Encuentra los mejores productos y ofertas en Cuba.`
    : 'Explora el catálogo completo de MARÉ. Categorías, ofertas y productos exclusivos en Cuba.';

  // Base results from raw search (before filters applied)
  const baseResults = useMemo(() => {
    return query ? searchProducts(products, query) : [];
  }, [query]);

  // Sync query when it changes in URL
  useEffect(() => {
    setFilterOptions(prev => ({ ...prev, searchQuery: query }));
  }, [query]);

  // Derived available filters based on base search results
  const { availableBrands, availableTags } = useMemo(() => {
    const brands = new Set<string>();
    const tags = new Set<string>();
    baseResults.forEach(p => {
      if (p.marca) brands.add(p.marca);
      if (p.etiquetas) p.etiquetas.forEach(t => tags.add(t));
    });
    return {
      availableBrands: Array.from(brands),
      availableTags: Array.from(tags)
    };
  }, [baseResults]);

  // Final filtered and sorted results
  const finalResults = useMemo(() => {
    // searchProducts handles sorting by relevance, but we want to apply standard filters
    // So we run filterProducts on the base search results
    const filtered = filterProducts(baseResults, filterOptions);
    return sortProducts(filtered, sortOption);
  }, [baseResults, filterOptions, sortOption]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  // Featured products for empty state
  const featured = products.filter(p => p.destacado).slice(0, 4);

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
        {baseResults.length > 0 && (
          <FilterSidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            options={filterOptions}
            onChange={setFilterOptions}
            availableBrands={availableBrands}
            availableTags={availableTags}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          {baseResults.length > 0 ? (
            <>
              <FilterBar 
                totalItems={finalResults.length}
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

              {finalResults.length > 0 ? (
                <ProductGrid>
                  {finalResults.map(p => (
                    <ProductCard key={p.id} product={p} highlight={query} />
                  ))}
                </ProductGrid>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Box className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-mare-navy mb-2">No hay resultados con estos filtros</h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Intenta cambiar o limpiar los filtros seleccionados para ver más productos.
                  </p>
                  <Button onClick={() => setFilterOptions({ searchQuery: query })} variant="outline">
                    Limpiar filtros
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

              <div className="w-full">
                <h3 className="text-xl font-bold text-mare-navy mb-6">Productos destacados</h3>
                <ProductGrid>
                  {featured.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </ProductGrid>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
