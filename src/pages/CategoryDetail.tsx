import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CaretRight, Package, CaretLeft } from 'phosphor-react';
import { categoryService } from '../services/categories';
import { productService } from '../services/products';
import { getProductsByCategory } from '../utils/products';
import { filterProducts, sortProducts, FilterOptions, SortOption } from '../utils/filters';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductGrid } from '../components/ui/ProductGrid';
import { ProductCarousel } from '../components/ui/ProductCarousel';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { FilterBar } from '../components/ui/FilterBar';
import { ActiveFilters } from '../components/ui/ActiveFilters';
import { SEO } from '../components/ui/SEO';
import { generateBreadcrumbSchema } from '../utils/seo';
import { getCategoryIcon } from '../utils/categoryIcons';

export function CategoryDetail() {
  const [categories, setCategories] = useState(categoryService.getCategoriesSync());
  const [productsVersion, setProductsVersion] = useState(0);

  useEffect(() => {
    const handleCatUpdate = () => setCategories(categoryService.getCategoriesSync());
    const handleProdUpdate = () => setProductsVersion(v => v + 1);
    
    window.addEventListener('mare_categories_updated', handleCatUpdate);
    window.addEventListener('mare_products_updated', handleProdUpdate);
    
    return () => {
      window.removeEventListener('mare_categories_updated', handleCatUpdate);
      window.removeEventListener('mare_products_updated', handleProdUpdate);
    };
  }, []);
  const { slug, subslug } = useParams<{ slug: string; subslug?: string }>();
  
  const category = categories.find(c => c.slug === slug);
  const subcategory = category?.subcategorias?.find(s => s.slug === subslug);

  const breadcrumbSchema = useMemo(() => {
    if (!category) return null;
    const items = [{ name: 'Inicio', item: '/' }];
    items.push({ name: category.nombre, item: `/categoria/${category.slug}` });
    if (subcategory) {
      items.push({ name: subcategory.nombre, item: `/categoria/${category.slug}/${subcategory.slug}` });
    }
    return generateBreadcrumbSchema(items);
  }, [category, subcategory]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categoryId: category?.id,
    subcategoryId: subcategory?.id
  });

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
    if (!category) return;

    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const sortMap: Record<string, 'newest' | 'price-asc' | 'price-desc' | 'popular'> = {
        'newest': 'newest',
        'price-asc': 'price-asc',
        'price-desc': 'price-desc',
        'recommended': 'popular',
        'featured': 'popular'
      };

      const result = await productService.getPaginatedProducts({
        category: category.id,
        subcategoryId: subcategory?.id,
        limit: 12,
        offset: isLoadMore ? paginatedResults.offset : 0,
        sort: sortMap[sortOption] || 'newest'
      });

      setPaginatedResults(prev => ({
        products: isLoadMore ? [...prev.products, ...result.products] : result.products,
        total: result.total,
        hasMore: result.hasMore,
        offset: result.nextOffset
      }));
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // When category/subcategory or sort changes, reset and fetch
  useEffect(() => {
    window.scrollTo(0, 0);
    setFilterOptions({ 
      categoryId: category?.id,
      subcategoryId: subcategory?.id
    });
    setSortOption('recommended');
    fetchProducts();
  }, [category?.id, subcategory?.id, sortOption]);

  const finalResults = paginatedResults.products;

  const featuredProducts = useMemo(() => {
    return finalResults.filter(p => p.destacado);
  }, [finalResults]);

  const offerProducts = useMemo(() => {
    return finalResults.filter(p => p.oferta);
  }, [finalResults]);

  const availableBrands: string[] = [];
  const availableTags: string[] = [];

  const otherCategories = useMemo(() => {
    return categories.filter(c => c.id !== category?.id).slice(0, 4);
  }, [category]);

  if (!category) {
    return (
      <div className="py-12 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmptyState 
          icon={<Package weight="light" className="h-8 w-8" />}
          title="Categoría no encontrada"
          description="La categoría que buscas no existe o ha sido eliminada."
          action={
            <Link to="/categorias">
              <Button variant="primary">Volver a la tienda</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {category && (
        <SEO 
          title={subcategory ? `${subcategory.nombre} — ${category.nombre}` : category.nombre}
          description={category.descripcion || `Explora nuestra colección de ${category.nombre} en MARÉ.`}
          structuredData={breadcrumbSchema}
        />
      )}
      {/* Breadcrumbs */}
      <div className="mb-4 pt-4">
        {/* Mobile Breadcrumb */}
        <div className="lg:hidden flex items-center">
          <Link to={subcategory ? `/categoria/${category.slug}` : '/categorias'} className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-mare-navy transition-colors">
            <CaretLeft strokeWidth={2} className="w-3 h-3 mr-1" />
            {subcategory ? category.nombre : 'Categorías'}
          </Link>
        </div>
        
        {/* Desktop Breadcrumb */}
        <div className="hidden lg:flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-2">
          <Link to="/" className="hover:text-mare-green transition-colors">Inicio</Link>
          <CaretRight strokeWidth={1.5} className="w-3 h-3" />
          <Link to="/categorias" className="hover:text-mare-green transition-colors">Categorías</Link>
          <CaretRight strokeWidth={1.5} className="w-3 h-3" />
          <Link to={`/categoria/${category.slug}`} className={`hover:text-mare-green transition-colors ${!subcategory ? 'text-mare-navy' : ''}`}>
            {category.nombre}
          </Link>
          {subcategory && (
            <>
              <CaretRight strokeWidth={1.5} className="w-3 h-3" />
              <span className="text-mare-navy">{subcategory.nombre}</span>
            </>
          )}
        </div>
      </div>

      {/* Header Compacto */}
      <div className="mb-6 bg-gray-50 border border-gray-100 p-4 lg:p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
        <div className="bg-white p-3 rounded-xl shrink-0 self-start md:self-auto border border-gray-100 shadow-sm text-mare-navy">
           {getCategoryIcon(category.icono, "h-6 w-6")}
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-mare-navy tracking-tight mb-1">
            {subcategory ? subcategory.nombre : category.nombre}
          </h1>
          {category.descripcion && !subcategory && (
            <p className="text-gray-500 text-xs lg:text-sm font-medium">{category.descripcion}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <FilterSidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          options={filterOptions}
          onChange={setFilterOptions}
          availableBrands={availableBrands}
          availableTags={availableTags}
          hideCategoryFilter={true}
          hideSubcategoryFilter={true}
        />

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Subcategories Horizontal Carousel */}
          {category.subcategorias && category.subcategorias.length > 0 && (
            <div className="mb-4">
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x hide-scrollbar items-center">
                <Link 
                  to={`/categoria/${category.slug}`}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all snap-start shrink-0 border ${
                    !subcategory 
                      ? 'bg-mare-navy text-white border-mare-navy' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Todos
                </Link>
                {category.subcategorias.map(sub => (
                  <Link 
                    key={sub.id}
                    to={`/categoria/${category.slug}/${sub.slug}`}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all snap-start shrink-0 border ${
                      subcategory?.id === sub.id
                        ? 'bg-mare-navy text-white border-mare-navy' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {sub.nombre}
                  </Link>
                ))}
              </div>
              <div className="w-full border-b border-dashed border-gray-200 mt-2"></div>
            </div>
          )}
          
          {/* Featured & Offers Carousels */}
          {!filterOptions.searchQuery && !filterOptions.minPrice && !filterOptions.maxPrice && (!filterOptions.disponibilidad || filterOptions.disponibilidad.length === 0) && (!filterOptions.estado || filterOptions.estado.length === 0) && (!filterOptions.brands || filterOptions.brands.length === 0) && (!filterOptions.tags || filterOptions.tags.length === 0) && (
            <div className="mb-6 space-y-6">
              {featuredProducts.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-mare-navy uppercase tracking-widest mb-3">Destacados en {subcategory ? subcategory.nombre : category.nombre}</h3>
                  <ProductCarousel products={featuredProducts} />
                </div>
              )}
              {offerProducts.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-mare-gold uppercase tracking-widest mb-3">Ofertas en {subcategory ? subcategory.nombre : category.nombre}</h3>
                  <ProductCarousel products={offerProducts} />
                </div>
              )}
            </div>
          )}

          <FilterBar 
            totalItems={finalResults.length}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onOpenFilters={() => setIsSidebarOpen(true)}
            options={filterOptions}
            onChangeOptions={setFilterOptions}
            hideCategoryFilter={true}
            hideSubcategoryFilter={true}
          />
          
          <ActiveFilters 
            options={filterOptions}
            onChange={setFilterOptions}
            hideCategoryFilter={true}
            hideSubcategoryFilter={true}
          />

          {/* Products Grid */}
          <div className="mt-4">
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
              <EmptyState 
                icon={<Package weight="light" className="h-8 w-8" />}
                title="No hay resultados con estos filtros"
                description="Intenta cambiar o limpiar los filtros seleccionados."
                action={
                  <Button onClick={() => setFilterOptions({ categoryId: category.id, subcategoryId: subcategory?.id })} variant="outline" size="sm">
                    Limpiar filtros
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Navigation - Redesigned as Carousel */}
      {otherCategories.length > 0 && (
        <div className="mt-16 pt-8 border-t border-dashed border-gray-200">
          <div className="flex flex-col mb-5">
            <span className="text-[9px] font-black text-mare-navy/30 uppercase tracking-[0.3em] leading-none mb-1.5">Descubrir</span>
            <h2 className="text-sm md:text-base font-black text-mare-navy uppercase tracking-tight">También puedes explorar</h2>
          </div>
          
          <div className="relative">
            <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
              <div className="flex gap-4 min-w-max">
                {otherCategories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <Link 
                      to={`/categoria/${cat.slug}`}
                      className="group flex flex-col items-center gap-2.5 w-[72px] md:w-20 transition-all active:scale-90"
                    >
                      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-mare-navy group-hover:shadow-lg group-hover:shadow-mare-navy/10">
                        <div className="absolute inset-2 rounded-xl bg-white/40 group-hover:bg-white/10 transition-colors"></div>
                        <div className="relative z-10 text-mare-navy group-hover:text-white transition-colors flex items-center justify-center">
                          {getCategoryIcon(cat.icono, "w-5 h-5 md:w-6 md:h-6")}
                        </div>
                      </div>
                      <span className="text-[9px] md:text-[10px] font-bold text-mare-navy/60 uppercase tracking-tighter text-center leading-tight group-hover:text-mare-navy transition-colors line-clamp-2 px-1">
                        {cat.nombre}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* View All Option */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: otherCategories.length * 0.03 }}
                >
                  <Link 
                    to="/categorias"
                    className="group flex flex-col items-center gap-2.5 w-[72px] md:w-20 transition-all active:scale-90"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-mare-navy flex items-center justify-center shadow-lg shadow-mare-navy/5 group-hover:bg-mare-navy/90 group-hover:shadow-mare-navy/20 transition-all">
                      <CaretRight className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[3]" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-mare-navy uppercase tracking-widest text-center leading-tight">
                      Ver Todo
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
