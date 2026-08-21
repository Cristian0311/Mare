import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function FloatingHelpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8"
        >
          <Link
            to="/informacion"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-mare-navy text-white shadow-lg hover:bg-mare-green transition-colors group"
            title="Centro de Ayuda"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="absolute right-12 bg-mare-navy text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Ayuda
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
