import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryService } from '../../services/categories';
import { CaretRight, Package } from 'phosphor-react';
import { getCategoryIcon } from '../../utils/categoryIcons';

export function CategoryCarousel() {
  const [categories, setCategories] = useState(categoryService.getCategoriesSync());

  useEffect(() => {
    const handleUpdate = () => setCategories(categoryService.getCategoriesSync());
    window.addEventListener('mare_categories_updated', handleUpdate);
    return () => window.removeEventListener('mare_categories_updated', handleUpdate);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-1 mb-5">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-mare-navy/30 uppercase tracking-[0.3em] leading-none mb-1.5">Catálogo</span>
          <h2 className="text-sm md:text-base font-black text-mare-navy uppercase tracking-tight">Categorías</h2>
        </div>
        <div className="flex items-center gap-1.5 opacity-30">
          <span className="text-[8px] font-black text-mare-navy uppercase tracking-widest">Deslizar</span>
          <CaretRight size={10} className="text-mare-navy" weight="bold" />
        </div>
      </div>

      <div className="relative">
        <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          <div className="flex gap-4 min-w-max">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <Link
                  to={`/categoria/${category.slug}`}
                  className="group flex flex-col items-center gap-2.5 w-[72px] md:w-20 transition-all active:scale-90"
                >
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-mare-navy group-hover:shadow-lg group-hover:shadow-mare-navy/10">
                    <div className="absolute inset-2 rounded-xl bg-white/40 group-hover:bg-white/10 transition-colors"></div>
                    <div className="relative z-10 text-mare-navy group-hover:text-white transition-colors flex items-center justify-center">
                      {getCategoryIcon(category.icono, "w-5 h-5 md:w-6 md:h-6")}
                    </div>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-mare-navy/60 uppercase tracking-tighter text-center leading-tight group-hover:text-mare-navy transition-colors line-clamp-2 px-1">
                    {category.nombre}
                  </span>
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: categories.length * 0.03 }}
            >
              <Link
                to="/categorias"
                className="group flex flex-col items-center gap-2.5 w-[72px] md:w-20 transition-all active:scale-90"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-mare-navy flex items-center justify-center shadow-lg shadow-mare-navy/5 group-hover:bg-mare-navy/90 group-hover:shadow-mare-navy/20 transition-all">
                  <CaretRight className="w-5 h-5 md:w-6 md:h-6 text-white" weight="bold" />
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
  );
}
