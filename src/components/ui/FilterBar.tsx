import React, { useState, useRef, useEffect } from 'react';
import { Faders, CaretDown, X } from 'phosphor-react';
import { SortOption } from '../../utils/filters';
import { FilterOptions } from '../../utils/filters';

interface FilterBarProps {
  totalItems: number;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onOpenFilters: () => void;
  options: FilterOptions;
  onChangeOptions: (options: FilterOptions) => void;
  hideCategoryFilter?: boolean;
  hideSubcategoryFilter?: boolean;
}

const sortLabels: Record<SortOption, string> = {
  'recommended': 'Relevancia',
  'date-desc': 'Más recientes',
  'price-asc': 'Precio: menor a mayor',
  'price-desc': 'Precio: mayor a menor',
  'name-asc': 'Nombre A-Z',
  'name-desc': 'Nombre Z-A',
  'best-sellers': 'Más vendidos',
  'featured': 'Destacados',
  'offers': 'Ofertas',
};

export function FilterBar({ 
  totalItems, 
  sortOption, 
  onSortChange, 
  onOpenFilters,
  options,
  onChangeOptions,
  hideCategoryFilter = false,
  hideSubcategoryFilter = false
}: FilterBarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortChange = (option: SortOption) => {
    onSortChange(option);
    setIsSortOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (!hideCategoryFilter && options.categoryId) count++;
    if (!hideSubcategoryFilter && options.subcategoryId) count++;
    if (options.minPrice !== undefined || options.maxPrice !== undefined) count++;
    if (options.disponibilidad && options.disponibilidad.length > 0) count += options.disponibilidad.length;
    if (options.estado && options.estado.length > 0) count += options.estado.length;
    if (options.brands && options.brands.length > 0) count += options.brands.length;
    if (options.tags && options.tags.length > 0) count += options.tags.length;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const handleClearFilters = () => {
    onChangeOptions({
      searchQuery: options.searchQuery // preserve search query if any
    });
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between gap-2 bg-white p-1.5 sm:p-2 rounded-full border border-gray-100 shadow-sm">
        
        <div className="pl-4 text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center">
          <span className="text-mare-navy mr-1.5">{totalItems}</span> 
          <span>PRODUCTOS</span>
        </div>
        
        <div className="flex items-center gap-1.5 pr-0.5">
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 hover:bg-gray-100 text-mare-navy rounded-full text-[10px] font-black transition-all active:scale-95 border border-transparent"
          >
            <Faders weight="bold" className="w-3.5 h-3.5 text-mare-turquoise" />
            <span>FILTROS</span>
            {activeCount > 0 && (
              <span className="flex items-center justify-center min-w-[16px] h-[16px] bg-mare-green text-white text-[9px] rounded-full px-0.5 font-bold">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 hover:bg-gray-100 text-mare-navy rounded-full text-[10px] font-black transition-all active:scale-95 border border-transparent max-w-[130px] sm:max-w-[200px]"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <span className="truncate tracking-widest">{sortLabels[sortOption].toUpperCase()}</span>
              <CaretDown weight="bold" className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                      ${sortOption === option ? 'text-mare-green font-bold bg-mare-green/5' : 'text-gray-600'}
                    `}
                    role="option"
                    aria-selected={sortOption === option}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
