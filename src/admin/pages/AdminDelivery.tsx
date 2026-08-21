import { useState, useEffect } from 'react';
import { Save, Truck, Info, Settings2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { configService } from '../../services/config';

export function AdminDelivery() {
  const [enabled, setEnabled] = useState(configService.getConfigSync().delivery.enabled);
  const [defaultCost, setDefaultCost] = useState(configService.getConfigSync().delivery.defaultCostMN.toString());
  const [isSaving, setIsSaving] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      const config = await configService.getConfig();
      setEnabled(config.delivery.enabled);
      setDefaultCost(config.delivery.defaultCostMN.toString());
    };
    loadConfig();

    const handleConfigUpdate = () => {
      const config = configService.getConfigSync();
      setEnabled(config.delivery.enabled);
      setDefaultCost(config.delivery.defaultCostMN.toString());
    };

    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const config = configService.getConfigSync();
    await configService.updateConfig({
      ...config,
      delivery: {
        ...config.delivery,
        enabled,
        defaultCostMN: parseInt(defaultCost) || 0
      }
    });
    setIsSaving(false);
    success('Entregas actualizadas', 'Configuración de entrega guardada correctamente.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">Configuración de Entregas</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Administra el sistema de envíos y recogidas.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${enabled ? 'bg-mare-blue/10 text-mare-blue' : 'bg-gray-100 text-gray-400'}`}>
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-black text-mare-navy uppercase tracking-tight text-sm">Sistema de Entregas</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Habilitar envíos a domicilio.</p>
              </div>
            </div>
            
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
                <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-mare-blue' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>

          <div className={`space-y-6 transition-opacity ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Settings2 size={12} />
                  Costo Base de Envío (CUP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-black text-mare-navy focus:ring-2 focus:ring-mare-blue/20 focus:border-mare-blue outline-none transition-all" 
                    value={defaultCost}
                    onChange={(e) => setDefaultCost(e.target.value)}
                  />
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Costo por defecto si un municipio no tiene precio específico.</p>
              </div>
            </div>

            <div className="bg-mare-turquoise/10 border border-mare-turquoise/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="p-2 bg-white rounded-lg shrink-0">
                <Info className="text-mare-turquoise" size={20} />
              </div>
              <div className="text-xs text-mare-navy font-medium">
                Para configurar costos específicos por provincia o municipio, diríjase a la sección <strong className="font-black uppercase tracking-tight">Provincias y Municipios</strong> en el menú lateral.
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center justify-center gap-2 px-6 py-3 bg-mare-blue text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-mare-blue/90 transition-all shadow-sm ${isSaving ? 'opacity-70 cursor-wait' : ''} w-full sm:w-auto`}
            >
              <Save size={16} />
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
