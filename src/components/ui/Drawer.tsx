import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right' | 'bottom';
}

export function Drawer({ isOpen, onClose, title, children, position = 'right' }: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const getPositionStyles = () => {
    switch (position) {
      case 'left': return 'inset-y-0 left-0 w-full sm:w-96 rounded-r-3xl';
      case 'bottom': return 'bottom-0 inset-x-0 w-full rounded-t-3xl h-[85vh] sm:h-[60vh]';
      case 'right':
      default: return 'inset-y-0 right-0 w-full sm:w-96 rounded-l-3xl';
    }
  };

  const getInitialAnimation = () => {
    switch (position) {
      case 'left': return { x: '-100%' };
      case 'bottom': return { y: '100%' };
      case 'right':
      default: return { x: '100%' };
    }
  };

  const getAnimate = () => {
    switch (position) {
      case 'left': return { x: 0 };
      case 'bottom': return { y: 0 };
      case 'right':
      default: return { x: 0 };
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-mare-navy/40 backdrop-blur-sm" 
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div 
            initial={getInitialAnimation()}
            animate={getAnimate()}
            exit={getInitialAnimation()}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className={`fixed bg-white shadow-2xl flex flex-col ${getPositionStyles()}`}
            role="dialog"
            aria-modal="true"
          >
            {position === 'bottom' && (
              <div className="w-full flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing" onClick={onClose}>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
            )}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              {title ? (
                <h3 className="text-xl font-bold text-mare-navy">{title}</h3>
              ) : <div></div>}
              <IconButton onClick={onClose} size="sm" className="-mr-2 hover:bg-gray-100" aria-label="Cerrar panel">
                <X className="h-6 w-6" />
              </IconButton>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
