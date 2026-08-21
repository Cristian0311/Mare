import { useState, useEffect } from 'react';
import { 
  Save, AlertCircle, RefreshCw, ShoppingBag, DollarSign, 
  Shield, CheckCircle, ChevronRight
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { configService } from '../../services/config';
import { InfoTrigger } from '../components/InfoTrigger';
import { motion, AnimatePresence } from 'motion/react';

type SettingSection = 'store' | 'currency' | 'maintenance';

export function AdminSettings() {
  const [activeSection, setActiveSection] = useState<SettingSection>('store');
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const [tiendaNombre, setTiendaNombre] = useState('MARÉ');
  const [eslogan, setEslogan] = useState('Todo lo que buscas');
  const [generalNumber, setGeneralNumber] = useState('+5355555555');
  const [generalNumberError, setGeneralNumberError] = useState('');
  const [exchangeRateUSD, setExchangeRateUSD] = useState(320);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const cfg = await configService.getConfig();
      setTiendaNombre(cfg.tiendaNombre || 'MARÉ');
      setEslogan(cfg.eslogan || 'Todo lo que buscas');
      setGeneralNumber(cfg.whatsapp?.generalNumber || '+5355555555');
      setExchangeRateUSD(cfg.currency?.exchangeRateUSD || 320);
    } catch (e) {
      console.error('Error loading config:', e);
    }
  };

  const handleSaveStoreInfo = async () => {
    const cleanPhone = generalNumber.replace(/\s/g, '');
    if (!/^\+53[0-9]{8}$/.test(cleanPhone)) {
      setGeneralNumberError('Formato inválido. Debe ser el código internacional de Cuba (+53) seguido de 8 dígitos (ej: +5355555555)');
      error('Error de Validación', 'Verifica el formato del número de WhatsApp.');
      return;
    }
    
    setIsSaving(true);
    try {
      await configService.updateConfig({
        tiendaNombre,
        eslogan,
        whatsapp: {
          ...configService.getConfigSync().whatsapp,
          generalNumber
        }
      });
      success('Configuración Guardada', 'La información general de la tienda ha sido actualizada.');
    } catch (e) {
      error('Error', 'No se pudieron guardar los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCurrency = async () => {
    setIsSaving(true);
    try {
      await configService.updateExchangeRate(Number(exchangeRateUSD));
      success('Tasa Actualizada', `Tasa de cambio guardada: 1 USD = ${exchangeRateUSD} CUP`);
    } catch (e) {
      error('Error', 'No se pudo actualizar la tasa de cambio.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('¿Deseas purgar la caché local de la aplicación?')) {
      localStorage.removeItem('mare_admin_config');
      localStorage.removeItem('mare_banners_cache');
      window.location.reload();
    }
  };

  const sections = [
    { id: 'store', label: 'Tienda & Marca', icon: ShoppingBag },
    { id: 'currency', label: 'Monedas & Tasa', icon: DollarSign },
    { id: 'maintenance', label: 'Mantenimiento', icon: Shield },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-mare-navy uppercase tracking-tight flex items-center gap-2">
            Configuración Global
            <InfoTrigger 
              title="Ajustes Globales" 
              text="Centraliza la configuración de marca, moneda, número de contacto y mantenimiento de la plataforma MARÉ." 
            />
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-mare-turquoise uppercase tracking-[0.2em]">Panel de Control</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ajustes del Sistema</span>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-100/50 p-1.5 rounded-[1.5rem] overflow-x-auto hide-scrollbar gap-1 w-fit">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as SettingSection)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-white text-mare-navy shadow-sm' 
                  : 'text-gray-400 hover:text-mare-navy'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-mare-turquoise' : 'text-gray-400'} />
              {sec.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50/50 rounded-full -mr-32 -mt-32 -z-0"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {activeSection === 'store' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-black text-mare-navy uppercase tracking-widest flex items-center gap-2">
                    Identidad Visual
                    <InfoTrigger title="Marca" text="Aparece en la cabecera, pie de página y metadatos de la tienda." />
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Información corporativa de la plataforma</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                    <input 
                      type="text" 
                      value={tiendaNombre}
                      onChange={(e) => setTiendaNombre(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 font-black text-sm text-mare-navy focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Eslogan de Marca</label>
                    <input 
                      type="text" 
                      value={eslogan}
                      onChange={(e) => setEslogan(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 font-black text-sm text-mare-navy focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Canal WhatsApp Central</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={generalNumber}
                        onChange={(e) => {
                          setGeneralNumber(e.target.value);
                          if (generalNumberError) {
                            const cleanPhone = e.target.value.replace(/\s/g, '');
                            if (/^\+53[0-9]{8}$/.test(cleanPhone)) {
                              setGeneralNumberError('');
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const cleanPhone = e.target.value.replace(/\s/g, '');
                          if (!/^\+53[0-9]{8}$/.test(cleanPhone)) {
                            setGeneralNumberError('Formato inválido. Debe ser (+53) seguido de 8 dígitos.');
                          } else {
                            setGeneralNumberError('');
                          }
                        }}
                        placeholder="+5355555555"
                        className={`w-full px-5 py-4 rounded-2xl border bg-gray-50/30 font-black text-sm text-mare-navy focus:outline-none focus:ring-4 transition-all ${generalNumberError ? 'border-rose-500 focus:ring-rose-500/5' : 'border-gray-100 focus:ring-mare-turquoise/5 focus:border-mare-turquoise'}`}
                      />
                      <div className={`absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${generalNumberError ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        {generalNumberError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                      </div>
                    </div>
                    {generalNumberError ? (
                      <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest mt-2 ml-1">{generalNumberError}</p>
                    ) : (
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2 ml-1 leading-relaxed">
                        Número maestro para recepción de pedidos y soporte general.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-gray-50">
                  <button
                    onClick={handleSaveStoreInfo}
                    disabled={isSaving}
                    className="flex items-center rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-black text-white shadow-xl shadow-mare-navy/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save size={16} className="mr-2.5" />
                    {isSaving ? 'Guardando...' : 'Actualizar Información'}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'currency' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-black text-mare-navy uppercase tracking-widest flex items-center gap-2">
                    Finanzas & Conversión
                    <InfoTrigger title="Moneda" text="Se utiliza para convertir automáticamente todos los precios de CUP a USD en la tienda pública." />
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Ajustes de tasa de cambio global</p>
                </div>

                <div className="bg-mare-gold/5 border border-mare-gold/20 rounded-[1.5rem] p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-mare-gold/10 text-mare-gold flex items-center justify-center shrink-0">
                    <DollarSign size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-mare-gold font-black leading-relaxed uppercase tracking-tight">
                    MARÉ opera comercialmente en <span className="underline">CUP (Peso Cubano)</span>. La visualización en USD es un servicio de referencia para el usuario final.
                  </p>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor Referencial (1 USD)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={exchangeRateUSD}
                        onChange={(e) => setExchangeRateUSD(Number(e.target.value))}
                        className="w-full px-6 py-5 pr-20 rounded-2xl border border-gray-100 bg-gray-50/30 font-black text-2xl text-mare-navy focus:ring-4 focus:ring-mare-turquoise/5 focus:border-mare-turquoise outline-none transition-all"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-xs text-gray-300 uppercase tracking-widest">CUP</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-gray-50">
                  <button
                    onClick={handleSaveCurrency}
                    disabled={isSaving}
                    className="flex items-center rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] bg-mare-navy hover:bg-black text-white shadow-xl shadow-mare-navy/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save size={16} className="mr-2.5" />
                    {isSaving ? 'Guardando...' : 'Fijar Nueva Tasa'}
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'maintenance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-black text-mare-navy uppercase tracking-widest flex items-center gap-2">
                    Herramientas de Sistema
                    <InfoTrigger title="Mantenimiento" text="Herramientas avanzadas para refrescar la memoria local del navegador." />
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Mantenimiento preventivo de datos</p>
                </div>

                <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300">
                      <RefreshCw size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-mare-navy uppercase tracking-tight">Purgar Caché Operativa</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">Limpia configuraciones y banners almacenados localmente.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center shadow-sm"
                  >
                    <RefreshCw size={14} className="mr-2" /> Ejecutar Limpieza
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
