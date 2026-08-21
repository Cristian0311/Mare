import { useState, useEffect } from 'react';
import { RefreshCw, X, Zap } from 'lucide-react';
import { registerSW } from 'virtual:pwa-register';

export function SWUpdateBanner() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        console.log('MARÉ: Listo para uso offline');
      },
    });

    return () => {
      // cleanup if needed
    };
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-32px)] max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-mare-navy border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-mare-turquoise/20 rounded-xl flex items-center justify-center text-mare-turquoise shrink-0">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-0.5">Actualización Disponible</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-tight">
              Hay una versión más reciente de MARÉ con mejoras de rendimiento.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                const updateSW = registerSW({
                  onNeedRefresh() {
                    updateSW(true);
                  }
                });
                updateSW(true);
              }}
              className="bg-mare-turquoise text-mare-navy px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={10} /> Actualizar
            </button>
            <button 
              onClick={() => setNeedRefresh(false)}
              className="text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest py-1"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
