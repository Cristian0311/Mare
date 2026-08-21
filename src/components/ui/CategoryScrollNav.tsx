import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categories';
import { Category } from '../../types';
import { FilterOptions } from '../../utils/filters';
import { cn } from '../../utils/cn';

interface CategoryScrollNavProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
}

export function CategoryScrollNav({ options, onChange }: CategoryScrollNavProps) {
  const [categories, setCategories] = useState<Category[]>(categoryService.getCategoriesSync());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(categoryService.getCategoriesSync());
    };
    window.addEventListener('mare_categories_updated', handleUpdate);
    return () => window.removeEventListener('mare_categories_updated', handleUpdate);
  }, []);

  return (
    <div className="w-full overflow-x-auto hide-scrollbar mb-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max">
        <button
          onClick={() => onChange({ ...options, categoryId: undefined, subcategoryId: undefined })}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
            !options.categoryId
              ? "bg-mare-navy text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange({ ...options, categoryId: cat.id, subcategoryId: undefined })}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              options.categoryId === cat.id
                ? "bg-mare-navy text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            {cat.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
