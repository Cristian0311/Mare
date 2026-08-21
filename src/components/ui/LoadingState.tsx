import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Cargando...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[220px] ${className}`}>
      {/* Brand logo container */}
      <div className="relative mb-3 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 -m-2 rounded-full border border-mare-turquoise/40"
        />
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F1B2E] to-[#060A12] border border-white/10 shadow-md flex items-center justify-center overflow-hidden p-0 relative z-10">
          <img 
            src="/icon.svg" 
            alt="MARÉ" 
            className="w-full h-full object-cover rounded-full filter drop-shadow-[0_0_8px_rgba(13,122,115,0.4)]"
          />
        </div>
      </div>

      <p className="text-mare-navy font-bold text-sm tracking-wide mb-2">{message}</p>

      {/* Shimmer bar */}
      <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden relative">
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-mare-turquoise to-mare-gold"
        />
      </div>
    </div>
  );
}
