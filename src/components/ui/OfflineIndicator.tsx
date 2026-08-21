import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export function OfflineIndicator() {
  const isOnline = useNetworkStatus();
  const [showRestored, setShowRestored] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHasBeenOffline(true);
      setShowRestored(false);
    } else if (hasBeenOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setHasBeenOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasBeenOffline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[9999] flex justify-center pointer-events-none"
        >
          <div className="bg-mare-navy text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md bg-opacity-90">
            <WifiOff className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Sin conexión · Modo limitado
            </span>
          </div>
        </motion.div>
      )}

      {showRestored && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[9999] flex justify-center pointer-events-none"
        >
          <div className="bg-mare-green text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md bg-opacity-90">
            <Wifi className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Conexión restaurada
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
