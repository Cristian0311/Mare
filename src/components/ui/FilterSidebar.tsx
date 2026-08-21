import React, { useMemo, useState, useEffect } from 'react';
import { X, Faders, CaretDown, Check } from 'phosphor-react';
import { FilterOptions } from '../../utils/filters';
import { categoryService } from '../../services/categories';
import { Category } from '../../types';
import { Button } from './Button';
import { ProductAvailability } from '../../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  options: FilterOptions;
  onChange: (newOptions: FilterOptions) => void;
  availableBrands: string[];
  availableTags: string[];
  hideCategoryFilter?: boolean;
  hideSubcategoryFilter?: boolean;
}

export function FilterSidebar({ 
  isOpen, 
  onClose, 
  options, 
  onChange, 
  availableBrands, 
  availableTags,
  hideCategoryFilter = false,
  hideSubcategoryFilter = false
}: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>(categoryService.getCategoriesSync());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(categoryService.getCategoriesSync());
    };
    window.addEventListener('mare_categories_updated', handleUpdate);
    return () => window.removeEventListener('mare_categories_updated', handleUpdate);
  }, []);
  
  const handleToggle = <K extends keyof FilterOptions>(key: K, value: any) => {
    const current = options[key] as any[] || [];
    const updated = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    
    onChange({ ...options, [key]: updated.length > 0 ? updated : undefined });
  };

  const handlePriceRange = (min?: number, max?: number) => {
    onChange({ ...options, minPrice: min, maxPrice: max });
  };

  const priceRanges = [
    { label: 'Menos de 10,000 MN', min: undefined, max: 10000 },
    { label: '10,000 – 25,000 MN', min: 10000, max: 25000 },
    { label: '25,000 – 50,000 MN', min: 25000, max: 50000 },
    { label: 'Más de 50,000 MN', min: 50000, max: undefined },
  ];

  const activeCategory = useMemo(() => 
    options.categoryId ? categories.find(c => c.id === options.categoryId) : undefined,
  [options.categoryId]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel / Bottom Sheet (Mobile) */}
      <div className={`
        fixed inset-x-0 bottom-0 z-50 w-full max-h-[85vh] rounded-t-[32px] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        lg:sticky lg:top-24 lg:inset-auto lg:w-72 lg:max-h-[calc(100vh-120px)] lg:rounded-3xl lg:max-w-none lg:shadow-xl lg:shadow-gray-200/50 lg:border lg:border-gray-100 lg:transition-none lg:translate-y-0 lg:ml-1 lg:flex
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        {/* Handle for dragging (visual only) */}
        <div className="w-full flex justify-center pt-4 pb-2 lg:hidden">
          <div className="w-14 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Header (Desktop: Always Visible, Mobile: Bottom Sheet Header) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/80 bg-white/50 backdrop-blur-sm rounded-t-3xl sticky top-0 z-10">
          <h2 className="text-sm font-black text-mare-navy uppercase tracking-[0.2em] flex items-center gap-2.5">
            <Faders weight="bold" className="w-4 h-4 text-mare-turquoise" /> Filtros
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-mare-navy rounded-xl hover:bg-gray-50 transition-all lg:hidden"
            aria-label="Cerrar filtros"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-gray-100 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent overscroll-contain">
          
          {/* Categories Filter (if not hidden) */}
          {!hideCategoryFilter && (
            <div className="py-6">
              <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Categoría</h3>
              <div className="flex flex-col gap-1 pr-1">
                <button
                  className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all w-full border ${!options.categoryId ? 'bg-mare-green/10 text-mare-green border-mare-green/20 font-bold shadow-sm' : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-mare-navy'}`}
                  onClick={() => onChange({ ...options, categoryId: undefined, subcategoryId: undefined })}
                >
                  Todas las categorías
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all w-full border break-words ${options.categoryId === cat.id ? 'bg-mare-green/10 text-mare-green border-mare-green/20 font-bold shadow-sm' : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-mare-navy'}`}
                    onClick={() => onChange({ ...options, categoryId: cat.id, subcategoryId: undefined })}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subcategories (Only if a category with subcategories is selected) */}
          {!hideSubcategoryFilter && activeCategory?.subcategorias && activeCategory.subcategorias.length > 0 && (
            <div className="py-6">
              <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Subcategoría</h3>
              <div className="flex flex-col gap-1 pr-1">
                <button
                  className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all w-full border ${!options.subcategoryId ? 'bg-mare-green/10 text-mare-green border-mare-green/20 font-bold shadow-sm' : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-mare-navy'}`}
                  onClick={() => onChange({ ...options, subcategoryId: undefined })}
                >
                  Todas en {activeCategory.nombre}
                </button>
                {activeCategory.subcategorias.map(sub => (
                  <button
                    key={sub.id}
                    className={`text-left text-xs px-3.5 py-2.5 rounded-xl transition-all w-full border break-words ${options.subcategoryId === sub.id ? 'bg-mare-green/10 text-mare-green border-mare-green/20 font-bold shadow-sm' : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-mare-navy'}`}
                    onClick={() => onChange({ ...options, subcategoryId: sub.id })}
                  >
                    {sub.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="py-6">
            <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Precio</h3>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="price" 
                  className="w-4 h-4 text-mare-green border-gray-300 focus:ring-mare-green shrink-0 transition-all cursor-pointer"
                  checked={options.minPrice === undefined && options.maxPrice === undefined}
                  onChange={() => handlePriceRange(undefined, undefined)}
                />
                <span className="text-xs font-medium text-gray-500 group-hover:text-mare-navy transition-colors">Todos los precios</span>
              </label>
              {priceRanges.map((range, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="price" 
                    className="w-4 h-4 text-mare-green border-gray-300 focus:ring-mare-green shrink-0 transition-all cursor-pointer"
                    checked={options.minPrice === range.min && options.maxPrice === range.max}
                    onChange={() => handlePriceRange(range.min, range.max)}
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-mare-navy transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="py-6">
            <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Disponibilidad</h3>
            <div className="flex flex-col gap-2.5">
              {([
                { id: 'disponible', label: 'Disponible' },
                { id: 'agotado', label: 'Agotado' }
              ] as { id: ProductAvailability, label: string }[]).map(avail => (
                <label key={avail.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-mare-green border-gray-300 rounded-md focus:ring-mare-green shrink-0 cursor-pointer transition-all"
                    checked={(options.disponibilidad || []).includes(avail.id)}
                    onChange={() => handleToggle('disponibilidad', avail.id)}
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-mare-navy transition-colors">{avail.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="py-6">
            <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Estado</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { id: 'nuevo', label: 'Nuevo' },
                { id: 'oferta', label: 'Oferta' },
                { id: 'destacado', label: 'Destacado' },
                { id: 'masVendido', label: 'Más vendido' },
                { id: 'exclusivo', label: 'Exclusivo' },
                { id: 'liquidacion', label: 'Liquidación' }
              ].map(state => (
                <label key={state.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-mare-green border-gray-300 rounded-md focus:ring-mare-green shrink-0 cursor-pointer transition-all"
                    checked={(options.estado || []).includes(state.id as any)}
                    onChange={() => handleToggle('estado', state.id)}
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-mare-navy transition-colors">{state.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div className="py-6">
              <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Marca</h3>
              <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-mare-green border-gray-300 rounded-md focus:ring-mare-green shrink-0 cursor-pointer transition-all"
                      checked={(options.brands || []).includes(brand)}
                      onChange={() => handleToggle('brands', brand)}
                    />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-mare-navy transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="py-6 border-b-0">
              <h3 className="font-black text-mare-navy mb-4 text-[10px] uppercase tracking-[0.15em] opacity-50">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => {
                  const isActive = (options.tags || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleToggle('tags', tag)}
                      className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wider transition-all border break-words whitespace-normal text-left leading-tight ${
                        isActive 
                          ? 'bg-mare-green text-white border-mare-green shadow-md shadow-mare-green/20' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-mare-green hover:text-mare-green hover:bg-gray-50'
                      }`}
                      title={tag}
                    >
                      {tag.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
        
        {/* Footer (Mobile only) */}
        <div className="p-4 border-t border-gray-100 lg:hidden bg-gray-50 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => onChange({ searchQuery: options.searchQuery })}
          >
            Limpiar
          </Button>
          <Button variant="primary" className="flex-1" onClick={onClose}>
            Aplicar
          </Button>
        </div>
      </div>
    </>
  );
}
