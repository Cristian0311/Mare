import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Button } from './Button';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show if not dismissed recently
    const isDismissed = localStorage.getItem('mare-install-dismissed');
    if (isDismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a bit before showing to not interrupt immediately
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('mare-install-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-gray-100"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-mare-navy rounded-xl flex items-center justify-center shrink-0">
              <span className="text-mare-turquoise font-black text-xs">MARÉ</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-mare-navy leading-tight mb-1">Instala MARÉ</h4>
              <p className="text-xs text-gray-500 mb-3 leading-snug">Ten la tienda siempre a mano y accede más rápido a nuestras ofertas.</p>
              
              <Button onClick={handleInstall} className="w-full text-xs h-8 flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Instalar ahora
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
