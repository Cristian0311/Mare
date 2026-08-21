import { useState, useEffect } from 'react';
import { Save, MessageCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { configService } from '../../services/config';

export function AdminWhatsApp() {
  const [config, setConfig] = useState(configService.getConfigSync().whatsapp);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { success } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      const currentConfig = await configService.getConfig();
      setConfig(currentConfig.whatsapp);
    };

    loadConfig();

    const handleConfigUpdate = () => {
      setConfig(configService.getConfigSync().whatsapp);
    };
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '');
    const regex = /^\+53[0-9]{8}$/;
    if (!regex.test(cleanPhone)) {
      setError('Formato inválido. Debe ser el código internacional de Cuba (+53) seguido de 8 dígitos (ej: +5355555555)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validatePhone(config.generalNumber)) {
      return;
    }

    setIsSaving(true);
    const globalConfig = configService.getConfigSync();
    await configService.updateConfig({
      ...globalConfig,
      whatsapp: config
    });
    setIsSaving(false);
    success('WhatsApp actualizado', 'Las plantillas y configuraciones se han guardado.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">WhatsApp</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configuración de número principal y plantillas de mensajes.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="bg-mare-turquoise/10 border border-blue-100 rounded-lg p-4 flex items-start">
            <AlertCircle className="text-mare-turquoise mt-0.5 mr-3 shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <strong className="font-medium block mb-1">Nota importante sobre contactos</strong>
              El número configurado aquí actúa como respaldo general. Si un cliente selecciona un Asesor específico durante el proceso de compra, el mensaje será enviado al número de dicho Asesor en lugar del número general.
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-mare-navy uppercase tracking-tight mb-4 flex items-center">
              <MessageCircle size={20} className="mr-2 text-green-500" />
              Contacto Principal
            </h3>
            
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de WhatsApp (con código de país)</label>
              <input 
                type="text" 
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-mare-blue focus:border-mare-blue'}`} 
                value={config.generalNumber}
                onChange={e => {
                  setConfig({...config, generalNumber: e.target.value});
                  if (error) validatePhone(e.target.value);
                }}
                onBlur={e => validatePhone(e.target.value)}
              />
              {error ? (
                <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Ejemplo: +5355555555</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-black text-mare-navy uppercase tracking-tight mb-4">Plantillas de Mensajes</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Los detalles del pedido, carrito, total e información del cliente se añaden automáticamente al final de este texto introductorio.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Pedido Normal (Retail)</label>
                <textarea 
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-mare-blue focus:border-mare-blue" 
                  value={config.orderMessage}
                  onChange={e => setConfig({...config, orderMessage: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Compra Mayorista</label>
                <textarea 
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-mare-blue focus:border-mare-blue" 
                  value={config.wholesaleMessage}
                  onChange={e => setConfig({...config, wholesaleMessage: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Consulta de Producto</label>
                <textarea 
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-mare-blue focus:border-mare-blue" 
                  value={config.defaultMessage}
                  onChange={e => setConfig({...config, defaultMessage: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Usado cuando el cliente consulta sobre un producto específico desde el catálogo.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
