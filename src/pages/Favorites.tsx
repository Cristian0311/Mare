import { useState, useMemo, useEffect } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { getProductsByIds } from '../utils/products';
import { ProductGrid } from '../components/ui/ProductGrid';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { Heart, Search, ArrowRight, Trash2, CheckSquare, Square, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterOptions, SortOption, filterProducts, sortProducts } from '../utils/filters';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { FilterBar } from '../components/ui/FilterBar';
import { ActiveFilters } from '../components/ui/ActiveFilters';
import { useToast } from '../contexts/ToastContext';
import { SEO } from '../components/ui/SEO';
import { Product } from '../types';

export function Favorites() {
  const { favorites, favoriteCount, removeFavorite } = useFavorites();
  const { toast } = useToast();
  
  // Base raw products array, ordered by most recently added to favorites 
  // (we maintain the order of the favorites array since prepending puts newest first)
  const baseFavoriteProducts = useMemo(() => {
    if (favorites.length === 0) return [];
    
    // Create a Map for O(1) product lookup by ID
    const productsMap = new Map<string, Product>();
    // We only need to find the products that are in the favorites list
    const favoritedProducts = getProductsByIds(favorites);
    favoritedProducts.forEach(p => productsMap.set(p.id, p));
    
    // Return them in the order of the 'favorites' array
    return favorites.map(id => productsMap.get(id)).filter(Boolean) as Product[];
  }, [favorites]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended'); // We'll map recommended to "Most Recent" visually if needed, but 'date-desc' is fine too.
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Derived available filters
  const { availableBrands, availableTags } = useMemo(() => {
    const brands = new Set<string>();
    const tags = new Set<string>();
    baseFavoriteProducts.forEach(p => {
      if (p.marca) brands.add(p.marca);
      if (p.etiquetas) p.etiquetas.forEach(t => tags.add(t));
    });
    return {
      availableBrands: Array.from(brands),
      availableTags: Array.from(tags)
    };
  }, [baseFavoriteProducts]);

  const finalResults = useMemo(() => {
    const filtered = filterProducts(baseFavoriteProducts, filterOptions);
    // If recommended is selected, keep the favorites array order (newest first).
    if (sortOption === 'recommended') {
      return filtered;
    }
    return sortProducts(filtered, sortOption);
  }, [baseFavoriteProducts, filterOptions, sortOption]);

  // Clean up selectedIds if products are removed from favorites directly
  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      let changed = false;
      for (const id of next) {
        if (!favorites.includes(id)) {
          next.delete(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [favorites]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === finalResults.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(finalResults.map(p => p.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`¿Estás seguro de eliminar ${selectedIds.size} ${selectedIds.size === 1 ? 'producto' : 'productos'} de tus favoritos?`)) {
      selectedIds.forEach(id => removeFavorite(id));
      toast({ type: 'info', title: `${selectedIds.size} ${selectedIds.size === 1 ? 'producto eliminado' : 'productos eliminados'} de favoritos` });
      setSelectedIds(new Set());
      setIsEditing(false);
    }
  };

  if (favoriteCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Heart strokeWidth={1.5} className="w-10 h-10 text-gray-200" />
        </div>
        <h1 className="text-2xl font-black text-mare-navy mb-2 tracking-tight">Todavía no tienes favoritos</h1>
        <p className="text-gray-400 font-medium max-w-xs mx-auto mb-8 text-sm">
          Guarda productos que te interesen para encontrarlos fácilmente después.
        </p>
        <Link to="/">
          <Button variant="primary" size="md" className="rounded-xl px-8 font-black text-[10px] tracking-widest gap-2 h-12 shadow-lg shadow-mare-green/20">
            EXPLORAR PRODUCTOS
            <ArrowRight strokeWidth={1.5} className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <SEO title="Mis favoritos" noindex={true} />
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-1">Mis favoritos</h1>
          <p className="text-sm font-medium text-gray-500 mb-2">
            Guarda aquí los productos que quieres consultar después.
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {favoriteCount} {favoriteCount === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>
        
          <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button 
                id="btn-delete-selected"
                variant="outline" 
                size="sm" 
                className="text-[10px] font-black tracking-widest gap-2 border-mare-red text-mare-red hover:bg-mare-red/10"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
              >
                ELIMINAR SELECCIONADOS ({selectedIds.size})
                <Trash2 strokeWidth={1.5} className="w-3.5 h-3.5" />
              </Button>
              <Button 
                id="btn-cancel-edit"
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-black tracking-widest"
                onClick={() => { setIsEditing(false); setSelectedIds(new Set()); }}
              >
                CANCELAR
              </Button>
            </>
          ) : (
            <Button 
              id="btn-edit-favorites"
              variant="outline" 
              size="sm" 
              className="text-[10px] font-black tracking-widest gap-2"
              onClick={() => setIsEditing(true)}
            >
              EDITAR
            </Button>
          )}
        </div>
      </header>

      <div className="border-b border-dashed border-gray-200/60 mb-6"></div>

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

          {isEditing && finalResults.length > 0 && (
            <div className="mb-4 flex items-center justify-between bg-mare-navy/5 p-3 rounded-xl border border-mare-navy/10">
              <button
                id="btn-select-all"
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm font-bold text-mare-navy focus:outline-none"
              >
                {selectedIds.size === finalResults.length ? (
                  <CheckSquare className="w-5 h-5 text-mare-green" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                Seleccionar todos
              </button>
            </div>
          )}

          {finalResults.length > 0 ? (
            <ProductGrid>
              <AnimatePresence>
                {finalResults.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <ProductCard product={product} />
                    
                    {/* Edit mode overlay */}
                    {isEditing && (
                      <div 
                        className={`absolute inset-0 z-20 rounded-lg cursor-pointer transition-colors border-2 ${selectedIds.has(product.id) ? 'border-mare-green bg-mare-green/10' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => toggleSelection(product.id)}
                      >
                        <div className="absolute top-3 left-3 bg-white rounded-md shadow-sm">
                          {selectedIds.has(product.id) ? (
                            <CheckSquare className="w-6 h-6 text-mare-green" />
                          ) : (
                            <Square className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </ProductGrid>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-mare-navy mb-2">No hay resultados</h3>
              <p className="text-gray-500 mb-6 text-sm">
                No tienes favoritos que coincidan con los filtros seleccionados.
              </p>
              <Button onClick={() => setFilterOptions({})} variant="outline">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {!isEditing && (
        <div className="mt-12 p-8 rounded-3xl bg-mare-navy text-white relative overflow-hidden flex flex-col items-center text-center shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-mare-turquoise opacity-10 blur-3xl rounded-full"></div>
          <div className="relative z-10 max-w-sm">
              <Search strokeWidth={1.5} className="w-8 h-8 text-mare-turquoise mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">¿Buscas algo más?</h3>
              <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">
                Navega por nuestras categorías y descubre las mejores ofertas que tenemos para ti hoy.
              </p>
              <Link to="/categorias">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl font-black text-[10px] tracking-widest px-8">
                    VER CATEGORÍAS
                </Button>
              </Link>
          </div>
        </div>
      )}
    </div>
  );
}
