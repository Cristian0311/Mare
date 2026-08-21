import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, 'id'>) => void;
  success: (title: string, description?: string, action?: ToastAction) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-mare-green" />,
  error: <XCircle className="w-5 h-5 text-mare-red" />,
  warning: <AlertCircle className="w-5 h-5 text-mare-gold" />,
  info: <Info className="w-5 h-5 text-mare-turquoise" />
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((options: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...options }]);
    
    // Solo auto-ocultar si no tiene acción para dar tiempo al usuario, o extender el tiempo.
    // Para simplificar, extender el tiempo si hay acción
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, options.action ? 6000 : 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string, action?: ToastAction) => {
    addToast({ type: 'success', title, description, action });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-[calc(100%-2.5rem)] max-w-sm pointer-events-none md:left-auto md:right-10 md:translate-x-0 md:bottom-10">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="bg-white/95 backdrop-blur-md text-mare-navy rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 flex items-center gap-4 pointer-events-auto overflow-hidden relative border border-white"
            >
              <div className={`shrink-0 p-2.5 rounded-xl ${
                t.type === 'success' ? 'bg-mare-green/10 text-mare-green' : 
                t.type === 'error' ? 'bg-red-50 text-red-500' : 
                t.type === 'warning' ? 'bg-mare-gold/10 text-mare-gold' : 'bg-mare-turquoise/10 text-mare-turquoise'
              }`}>
                {t.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                 t.type === 'error' ? <XCircle className="w-5 h-5" /> :
                 t.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em] leading-tight text-mare-navy/40 mb-1">{t.title}</h4>
                {t.description && (
                  <p className="text-[12px] text-mare-navy font-bold leading-snug line-clamp-2">{t.description}</p>
                )}
                {t.action && (
                  <button
                    onClick={() => {
                      t.action?.onClick();
                      removeToast(t.id);
                    }}
                    className="mt-2 text-[10px] font-black tracking-widest uppercase text-mare-green hover:text-mare-navy transition-colors flex items-center gap-1.5"
                  >
                    {t.action.icon || (t.action.label.toLowerCase() === 'deshacer' && <Undo2 className="w-3 h-3" />)}
                    <span>{t.action.label}</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 text-gray-300 hover:text-mare-navy transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
