import { useState, useEffect } from 'react';
import { Save, Truck, Info, ChevronRight, CircleDollarSign } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { configService } from '../../services/config';
import { motion, AnimatePresence } from 'motion/react';

export function AdminWholesale() {
  const [enabled, setEnabled] = useState(configService.getConfigSync()?.wholesale?.enabled || false);
  const [isSaving, setIsSaving] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      const currentConfig = await configService.getConfig();
      if (currentConfig?.wholesale) {
        setEnabled(currentConfig.wholesale.enabled);
      }
    };

    loadConfig();

    const handleConfigUpdate = () => {
      const config = configService.getConfigSync();
      if (config?.wholesale) {
        setEnabled(config.wholesale.enabled);
      }
    };
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const config = configService.getConfigSync();
    await configService.updateConfig({
      ...config,
      wholesale: {
        enabled,
        minOrderAmountMN: config.wholesale?.minOrderAmountMN || 0
      }
    });
    setIsSaving(false);
    success('Configuración guardada', 'Los ajustes de Mayoristas se han actualizado.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight">Venta Mayorista</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Configuración de Canal</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precios por Volumen</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50/50 rounded-full -mr-32 -mt-32 -z-0"></div>
        
        <div className="p-8 md:p-10 space-y-10 relative z-10">
          
          <div className="flex items-center justify-between border-b border-gray-50 pb-8">
            <div className="flex items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-6 transition-all shadow-sm ${enabled ? 'bg-mare-navy text-white' : 'bg-gray-50 text-gray-300'}`}>
                <Truck size={28} />
              </div>
              <div>
                <h3 className="font-black text-mare-navy uppercase tracking-tight leading-none">Módulo de Mayoristas</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Habilita compras en grandes cantidades</p>
              </div>
            </div>
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
                <div className={`block w-14 h-8 rounded-full transition-all duration-300 ${enabled ? 'bg-mare-turquoise shadow-lg shadow-mare-turquoise/20' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-sm ${enabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>

          <AnimatePresence>
            {enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8 overflow-hidden"
              >
                <div className="bg-mare-turquoise/5 border border-mare-turquoise/20 rounded-[1.5rem] p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mare-turquoise/10 text-mare-turquoise flex items-center justify-center shrink-0">
                    <Info size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-xs text-mare-turquoise font-black leading-relaxed uppercase tracking-tight">
                    La configuración específica de precios, cantidades mínimas y presentaciones (Caja, Lote, Unidad) se debe realizar individualmente para cada producto en su sección de <strong className="underline">Gestión de Inventario</strong>.
                  </div>
                </div>

                <div className="border border-gray-50 rounded-[2rem] p-8 bg-gray-50/30">
                  <h4 className="font-black text-sm text-mare-navy uppercase tracking-tight mb-4 flex items-center gap-2">
                    <CircleDollarSign size={18} className="text-mare-gold" />
                    Modelos de Agrupación Soportados
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Formatos actualmente disponibles en la plataforma:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Unidad', desc: 'Descuento por volumen en producto suelto.', icon: 'U' },
                      { title: 'Caja', desc: 'Venta por cajas cerradas de N unidades.', icon: 'C' },
                      { title: 'Lote / Pack', desc: 'Venta por conjunto cerrado e indivisible.', icon: 'L' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-mare-gold/20 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 text-mare-navy flex items-center justify-center font-black text-[10px] mb-3 group-hover:bg-mare-gold transition-colors">
                          {item.icon}
                        </div>
                        <h5 className="font-black text-[10px] text-mare-navy uppercase tracking-widest mb-1">{item.title}</h5>
                        <p className="text-[9px] text-gray-400 font-bold leading-normal uppercase tracking-tight">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-t border-gray-50 pt-8 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-black text-white shadow-xl shadow-mare-navy/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={16} className="mr-2.5" />
              {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
