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
      // Scroll by 80% of width for a smoother experience that doesn't "skip" products
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ 
        left: scrollTo, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="group relative w-full overflow-visible">
      {/* Navigation Buttons (Desktop Only) */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 text-mare-navy" strokeWidth={3} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5 text-mare-navy" strokeWidth={3} />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 sm:gap-4 pb-6 px-1 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
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
