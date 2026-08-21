import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
}

export function LoadingScreen({ fullScreen = true, message }: LoadingScreenProps) {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, 8000); // Mostrar botón de reintento tras 8 segundos
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Animated Brand Emblem */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Pulsing Aura Rings */}
        <motion.div 
          animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 -m-3 rounded-full border-2 border-mare-turquoise/40"
        />
        <motion.div 
          animate={{ scale: [1, 1.38, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2.2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 -m-6 rounded-full border border-mare-green/20"
        />

        {/* Circular Logo Box */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#0F1B2E] to-[#060A12] border border-white/15 shadow-2xl flex items-center justify-center overflow-hidden p-0 relative z-10"
        >
          <img 
            src="/icon.svg" 
            alt="MARÉ" 
            className="w-full h-full object-cover rounded-full filter drop-shadow-[0_0_12px_rgba(13,122,115,0.4)]"
          />
        </motion.div>
      </div>

      {/* Brand Name & Slogan */}
      <motion.div 
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-1"
      >
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest flex items-center justify-center gap-0.5">
          <span className="bg-gradient-to-r from-[#22D3EE] via-[#14998E] to-[#0D7A73] bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(20,153,142,0.45)]">
            MARÉ
          </span>
          <span className="text-mare-gold">.</span>
        </h2>
        <p className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] uppercase text-mare-turquoise">
          {message || "Todo lo que buscas"}
        </p>
      </motion.div>

      {/* Wave Progress Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-36 h-1 bg-white/10 rounded-full overflow-hidden relative mt-5"
      >
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-mare-turquoise to-mare-gold"
        />
      </motion.div>

      {showRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleRetry}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95 group"
        >
          <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          ¿Tarda demasiado? Reintentar
        </motion.button>
      )}
    </div>
  );

  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-12 w-full">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-radial from-[#101F33] to-[#0B1320]">
      {content}
    </div>
  );
}
