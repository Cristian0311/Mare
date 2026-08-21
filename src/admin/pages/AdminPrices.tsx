import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { configService } from '../../services/config';

export function AdminPrices() {
  const [exchangeRate, setExchangeRate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    loadRate();
    const handleConfigUpdate = () => {
      setExchangeRate(configService.getConfigSync().currency.exchangeRateUSD.toString());
    };
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  const loadRate = async () => {
    setIsLoading(true);
    try {
      const config = await configService.getConfig();
      setExchangeRate(config.currency.exchangeRateUSD.toString());
    } catch (e) {
      console.error(e);
      // fallback to sync config
      setExchangeRate(configService.getConfigSync().currency.exchangeRateUSD.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      error('Error', 'La tasa de cambio debe ser un número válido mayor a 0');
      return;
    }
    
    if (!window.confirm(`¿Estás seguro que deseas establecer la tasa a 1 USD = ${rate} CUP? Este cambio afectará la conversión visual en toda la tienda pública.`)) {
      return;
    }

    setIsSaving(true);
    try {
      await configService.updateExchangeRate(rate);
      success('Tasa actualizada', 'La nueva tasa de cambio se ha guardado correctamente.');
    } catch (e) {
      console.error(e);
      error('Error', 'No se pudo guardar la tasa de cambio');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">Precios y Moneda</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configuración de tasa de cambio y monedas de la tienda.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="bg-mare-turquoise/10 border border-blue-100 rounded-lg p-4 flex items-start">
            <AlertCircle className="text-mare-turquoise mt-0.5 mr-3 shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <strong className="font-medium block mb-1">Impacto global de este cambio</strong>
              La moneda base de MARÉ es MN (CUP). Modificar la tasa de USD afectará automáticamente todos los precios aproximados en USD mostrados a los clientes en la tienda pública, carrito y checkout.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moneda Base</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-not-allowed" 
                value="MN (Peso Cubano)" 
                disabled 
              />
              <p className="text-xs text-gray-500 mt-1">Los precios de los productos siempre se guardan en moneda base.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de Cambio (1 USD = X MN)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="1"
                  min="1"
                  className="w-full border border-gray-300 rounded-md pl-3 pr-12 py-2 text-sm focus:ring-mare-blue focus:border-mare-blue" 
                  value={exchangeRate} 
                  onChange={(e) => setExchangeRate(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">MN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center px-4 py-2 bg-mare-blue text-white rounded-lg text-sm font-medium hover:bg-mare-blue/90 transition-colors ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Tasa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
