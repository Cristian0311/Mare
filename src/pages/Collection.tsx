import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Sparkle, TrendUp, Tag, CaretLeft, Package, ShoppingBag } from 'phosphor-react';
import { productService } from '../services/products';
import { filterProducts, sortProducts, FilterOptions, SortOption } from '../utils/filters';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductGrid } from '../components/ui/ProductGrid';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { FilterBar } from '../components/ui/FilterBar';
import { ActiveFilters } from '../components/ui/ActiveFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { SEO } from '../components/ui/SEO';

import { getProductPricing } from '../utils/pricing';

const collectionMap: Record<string, { title: string, icon: React.ReactNode, description: string, filter: (p: any) => boolean }> = {
  ofertas: {
    title: 'Ofertas Especiales',
    icon: <Tag weight="light" className="w-full h-full" />,
    description: 'Los mejores descuentos y promociones en todos nuestros productos.',
    filter: p => getProductPricing(p).hasOffer
  },
  novedades: {
    title: 'Recién Llegados',
    icon: <Sparkle weight="light" className="w-full h-full" />,
    description: 'Descubre los productos más nuevos que han llegado a nuestro catálogo.',
    filter: p => p.nuevo
  },
  recomendados: {
    title: 'Te Puede Interesar',
    icon: <TrendUp weight="light" className="w-full h-full" />,
    description: 'Nuestra selección de productos recomendados basada en popularidad.',
    filter: p => p.masVendido
  },
  destacados: {
    title: 'Destacados',
    icon: <Sparkle weight="light" className="w-full h-full" />,
    description: 'Nuestra selección de productos más populares según las visitas de nuestros clientes.',
    filter: () => true
  },
  'mas-vendidos': {
    title: 'Más Vendidos',
    icon: <TrendUp weight="light" className="w-full h-full" />,
    description: 'Los productos favoritos y más buscados por nuestros clientes.',
    filter: p => p.masVendido
  },
  mayorista: {
    title: 'Venta Mayorista',
    icon: <Package weight="light" className="w-full h-full" />,
    description: 'Productos disponibles para compra al por mayor con precios especiales.',
    filter: p => p.ventaMayorista?.habilitada
  },
  todos: {
    title: 'Todos los Productos',
    icon: <ShoppingBag weight="light" className="w-full h-full" />,
    description: 'Explora nuestro catálogo completo de productos MARÉ.',
    filter: () => true // Show all public products
  }
};

export function Collection() {
  const { type } = useParams<{ type: string }>();
  const collectionInfo = type ? collectionMap[type] : undefined;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  
  const [paginatedResults, setPaginatedResults] = useState<{
    products: any[];
    total: number;
    hasMore: boolean;
    offset: number;
  }>({
    products: [],
    total: 0,
    hasMore: true,
    offset: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchProducts = async (isLoadMore = false) => {
    if (!type || !collectionInfo) return;

    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      // Map sortOption to server-side sort
      const sortMap: Record<string, 'newest' | 'price-asc' | 'price-desc' | 'popular'> = {
        'newest': 'newest',
        'price-asc': 'price-asc',
        'price-desc': 'price-desc',
        'recommended': 'popular',
        'featured': 'popular'
      };

      const options = {
        limit: 12,
        offset: isLoadMore ? paginatedResults.offset : 0,
        sort: sortMap[sortOption] || 'newest',
        collection: type as any,
        category: filterOptions.categoryId,
        subcategoryId: filterOptions.subcategoryId,
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
        brands: filterOptions.brands,
        tags: filterOptions.tags,
        disponibilidad: filterOptions.disponibilidad,
        estado: filterOptions.estado
      };

      const result = await productService.getPaginatedProducts(options);
      
      setPaginatedResults(prev => ({
        products: isLoadMore ? [...prev.products, ...result.products] : result.products,
        total: result.total,
        hasMore: result.hasMore,
        offset: result.nextOffset
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [type, sortOption, filterOptions]);

  const finalResults = paginatedResults.products;

  const availableBrands: string[] = [];
  const availableTags: string[] = [];

  const isDarkTheme = type === 'ofertas' || type === 'mayorista';

  if (!collectionInfo) {
    return (
      <div className="py-12 animate-in fade-in duration-500">
        <EmptyState 
          icon={<Package weight="light" className="h-8 w-8" />}
          title="Colección no encontrada"
          description="La colección que buscas no existe."
          action={
            <Link to="/">
              <Button variant="primary">Volver al inicio</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <SEO 
        title={collectionInfo.title}
        description={collectionInfo.description}
      />
      
      <div className="relative z-10 pt-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-mare-navy transition-colors mb-6">
            <CaretLeft className="h-3 w-3 mr-2" />
            Volver al inicio
          </Link>
          
          <div className="flex items-center gap-4 p-5 rounded-[2rem] shadow-sm relative overflow-hidden border bg-gradient-to-br from-[#0B1320] via-mare-navy to-[#0A1A1A] border-white/10 text-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-mare-turquoise/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="bg-white/10 w-12 h-12 md:w-16 md:h-16 rounded-2xl shrink-0 relative z-10 flex items-center justify-center">
              <div className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center text-mare-turquoise">
                {collectionInfo.icon}
              </div>
            </div>
            <div className="relative z-10 flex-1">
              <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight leading-none mb-1">{collectionInfo.title}</h1>
              <p className="text-white/60 font-bold text-[9px] md:text-xs uppercase tracking-widest max-w-2xl leading-tight">{collectionInfo.description}</p>
            </div>
          </div>
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

            {/* Products Grid */}
            <div className="mt-6">
              {isLoading ? (
                <ProductGrid>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
                  ))}
                </ProductGrid>
              ) : finalResults.length > 0 ? (
                <>
                  <ProductGrid>
                    {finalResults.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </ProductGrid>
                  
                  {paginatedResults.hasMore && (
                    <div className="mt-12 flex justify-center">
                      <Button 
                        onClick={() => fetchProducts(true)} 
                        variant="outline"
                        isLoading={isLoadingMore}
                        className="rounded-full px-12"
                      >
                        {isLoadingMore ? 'CARGANDO...' : 'CARGAR MÁS PRODUCTOS'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 text-center shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Package weight="light" className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-mare-navy">No hay resultados</h3>
                  <p className="mb-8 text-[10px] font-bold uppercase tracking-widest max-w-xs leading-relaxed text-gray-500">
                    Intenta cambiar o limpiar los filtros seleccionados para ver más productos.
                  </p>
                  <Button 
                    onClick={() => setFilterOptions({})} 
                    variant="outline"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
