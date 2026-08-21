import React, { useState, useEffect } from 'react';
import { X } from 'phosphor-react';
import { FilterOptions } from '../../utils/filters';
import { categoryService } from '../../services/categories';
import { Category } from '../../types';

interface ActiveFiltersProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  hideCategoryFilter?: boolean;
  hideSubcategoryFilter?: boolean;
}

export function ActiveFilters({ options, onChange, hideCategoryFilter = false, hideSubcategoryFilter = false }: ActiveFiltersProps) {
  const [categories, setCategories] = useState<Category[]>(categoryService.getCategoriesSync());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(categoryService.getCategoriesSync());
    };
    window.addEventListener('mare_categories_updated', handleUpdate);
    return () => window.removeEventListener('mare_categories_updated', handleUpdate);
  }, []);

  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];

  if (!hideCategoryFilter && options.categoryId) {
    const cat = categories.find(c => c.id === options.categoryId);
    if (cat) {
      activeChips.push({
        id: `cat-${cat.id}`,
        label: cat.nombre,
        onRemove: () => onChange({ ...options, categoryId: undefined, subcategoryId: undefined })
      });
    }
  }

  if (!hideSubcategoryFilter && options.subcategoryId && options.categoryId) {
    const cat = categories.find(c => c.id === options.categoryId);
    const sub = cat?.subcategorias?.find(s => s.id === options.subcategoryId);
    if (sub) {
      activeChips.push({
        id: `sub-${sub.id}`,
        label: sub.nombre,
        onRemove: () => onChange({ ...options, subcategoryId: undefined })
      });
    }
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    let label = '';
    if (options.minPrice !== undefined && options.maxPrice !== undefined) {
      label = `Precio: ${options.minPrice.toLocaleString()} - ${options.maxPrice.toLocaleString()}`;
    } else if (options.minPrice !== undefined) {
      label = `Más de ${options.minPrice.toLocaleString()}`;
    } else if (options.maxPrice !== undefined) {
      label = `Menos de ${options.maxPrice.toLocaleString()}`;
    }
    
    activeChips.push({
      id: 'price',
      label,
      onRemove: () => onChange({ ...options, minPrice: undefined, maxPrice: undefined })
    });
  }

  if (options.disponibilidad) {
    options.disponibilidad.forEach(disp => {
      const labelMap: Record<string, string> = {
        'disponible': 'Disponible',
        'agotado': 'Agotado',
      };
      
      activeChips.push({
        id: `disp-${disp}`,
        label: labelMap[disp] || disp,
        onRemove: () => onChange({
          ...options,
          disponibilidad: options.disponibilidad?.filter(d => d !== disp)
        })
      });
    });
  }

  if (options.estado) {
    options.estado.forEach(est => {
      const labelMap: Record<string, string> = {
        'nuevo': 'Nuevo',
        'oferta': 'Oferta',
        'destacado': 'Destacado',
        'masVendido': 'Más vendido',
        'exclusivo': 'Exclusivo',
        'liquidacion': 'Liquidación'
      };
      
      activeChips.push({
        id: `est-${est}`,
        label: labelMap[est] || est,
        onRemove: () => onChange({
          ...options,
          estado: options.estado?.filter(e => e !== est)
        })
      });
    });
  }

  if (options.brands) {
    options.brands.forEach(brand => {
      activeChips.push({
        id: `brand-${brand}`,
        label: brand,
        onRemove: () => onChange({
          ...options,
          brands: options.brands?.filter(b => b !== brand)
        })
      });
    });
  }

  if (options.tags) {
    options.tags.forEach(tag => {
      activeChips.push({
        id: `tag-${tag}`,
        label: tag,
        onRemove: () => onChange({
          ...options,
          tags: options.tags?.filter(t => t !== tag)
        })
      });
    });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-6 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-1">Filtros:</div>
      {activeChips.map(chip => (
        <span 
          key={chip.id}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-100 text-mare-navy rounded-full text-[10px] font-bold shadow-sm hover:border-mare-green/30 transition-all group/chip"
        >
          <span className="truncate max-w-[120px] sm:max-w-xs">{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="p-0.5 text-gray-400 hover:text-mare-red transition-colors focus:outline-none shrink-0"
            aria-label={`Eliminar filtro ${chip.label}`}
          >
            <X weight="bold" className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange({ searchQuery: options.searchQuery })}
        className="text-[9px] font-black text-mare-red/60 hover:text-mare-red uppercase tracking-tighter px-2 py-1 transition-colors"
      >
        Limpiar
      </button>
    </div>
  );
}
