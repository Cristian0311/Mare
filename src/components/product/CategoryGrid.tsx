import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryService } from '../../services/categories';
import { ChevronRight } from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';

export function CategoryGrid() {
  const [categories, setCategories] = useState(categoryService.getCategoriesSync());

  useEffect(() => {
    const handleUpdate = () => setCategories(categoryService.getCategoriesSync());
    window.addEventListener('mare_categories_updated', handleUpdate);
    return () => window.removeEventListener('mare_categories_updated', handleUpdate);
  }, []);

  const displayCategories = categories.slice(0, 7);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {displayCategories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link
            to={`/categoria/${category.slug}`}
            className="group block relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-4 md:p-6 transition-all hover:border-mare-green/30 hover:shadow-lg hover:shadow-mare-green/5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-50 text-mare-navy flex items-center justify-center mb-3 md:mb-4 transition-colors group-hover:bg-mare-green/10 group-hover:text-mare-green">
                {getCategoryIcon(category.icono, "w-6 h-6 md:w-8 md:h-8")}
              </div>
              <h3 className="text-[11px] md:text-xs font-black text-mare-navy uppercase tracking-widest transition-colors group-hover:text-mare-green">
                {category.nombre}
              </h3>
              <p className="hidden md:block text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                {category.subcategorias?.length || 0} subcategorías
              </p>
            </div>
            <div className="absolute bottom-2 right-2 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
              <ChevronRight className="w-4 h-4 text-mare-green" />
            </div>
          </Link>
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Link
          to="/categorias"
          className="group block relative h-full bg-mare-navy rounded-2xl p-4 md:p-6 transition-all hover:bg-mare-navy/90 hover:shadow-xl"
        >
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-[11px] md:text-xs font-black text-white uppercase tracking-widest mb-1">
              Ver todas
            </h3>
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
              Explorar catálogo
            </p>
            <div className="mt-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
