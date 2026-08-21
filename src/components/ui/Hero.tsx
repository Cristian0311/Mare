import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { bannerService, Banner } from '../../services/banners';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    bannerService.getActiveBanners().then(data => {
      setBanners(data);
    });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) {
    // Fallback original Hero
    return (
      <div className="relative h-[280px] md:h-[350px] w-full overflow-hidden rounded-[2.5rem] bg-mare-navy shadow-2xl group">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#0B1320] via-[#0A1A1A] to-[#0A1A1A]"></div>
          <div className="absolute top-[-30%] right-[-10%] w-96 h-96 bg-mare-turquoise/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-30%] left-[-10%] w-96 h-96 bg-mare-gold/5 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 opacity-[0.03] overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="flex flex-col items-start text-left w-full max-w-2xl px-6 md:px-16 py-8">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mb-4">
              <Logo className="scale-75 md:scale-90 origin-left" variant="full" isWhite />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl md:text-4xl font-black text-white leading-[1.1] mb-3">
              Descubre lo mejor <span className="text-mare-turquoise">en <br className="hidden md:block" /> un solo lugar.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[9px] md:text-[11px] font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-6 max-w-sm">
              Tu tienda de confianza en Cuba. Productos exclusivos con entregas rápidas y seguras.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => navigate('/categorias')} className="flex-1 sm:flex-none rounded-xl h-10 md:h-12 px-6 font-black text-[9px] tracking-widest bg-mare-turquoise text-mare-navy hover:scale-105 transition-all shadow-xl shadow-mare-turquoise/10 border-none">
                EXPLORAR TODO
              </Button>
              <Button variant="outline" onClick={() => navigate('/coleccion/ofertas')} className="flex-1 sm:flex-none rounded-xl h-10 md:h-12 px-6 font-black text-[9px] tracking-widest border-white/20 text-white hover:bg-white/10 transition-all">
                VER OFERTAS
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const current = banners[currentIndex];

  return (
    <div className="relative h-[280px] md:h-[350px] w-full overflow-hidden rounded-[2.5rem] bg-mare-navy shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-0"
        >
          <img src={current.image} alt={current.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-mare-navy/90 via-mare-navy/60 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="flex flex-col items-start text-left w-full max-w-2xl px-6 md:px-16 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <h1 className="text-2xl md:text-4xl font-black text-white leading-[1.1] mb-3">
                {current.title}
              </h1>
              {current.subtitle && (
                <p className="text-[9px] md:text-[11px] font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-6 max-w-sm">
                  {current.subtitle}
                </p>
              )}
              <Button 
                onClick={() => navigate(current.link)}
                className="w-full sm:w-auto rounded-xl h-10 md:h-12 px-8 font-black text-[9px] tracking-widest bg-mare-gold text-mare-navy hover:scale-105 transition-all shadow-xl shadow-mare-gold/20 border-none uppercase"
              >
                {current.buttonText || 'Ver Detalles'}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button 
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((b, idx) => (
              <button 
                key={b.id} 
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-mare-gold' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
