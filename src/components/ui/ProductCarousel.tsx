import React, { useRef } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative">
      {/* Navigation Buttons (Desktop Only) */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-gray-50"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 text-mare-navy" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-gray-50"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5 text-mare-navy" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 px-1 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, idx) => (
          <motion.div
            key={`pcar-${product.id || idx}-${idx}`}
            className="w-[175px] sm:w-[210px] md:w-[260px] shrink-0 snap-start"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
        
        {/* Placeholder to add space at the end */}
        <div className="min-w-[1px] shrink-0" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
