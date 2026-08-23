import { useState, useEffect } from 'react';
import { Save, Truck, Info, Settings2, MapPin, Plus, Trash2, Edit2, Store } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { configService } from '../../services/config';

interface PickupLocation {
  id: string;
  name: string;
  address: string;
  schedule: string;
  active: boolean;
}

export function AdminDelivery() {
  const [enabled, setEnabled] = useState(configService.getConfigSync().delivery.enabled);
  const [defaultCost, setDefaultCost] = useState(configService.getConfigSync().delivery.defaultCostMN.toString());
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(
    configService.getConfigSync().delivery.pickupLocations || [
      { id: '1', name: 'Sede Central - La Habana', address: 'Calle 23 #456 e/ H e I, Vedado, La Habana', schedule: 'Lunes a Viernes (9:00 AM - 5:00 PM)', active: true },
      { id: '2', name: 'Almacén 1 - Plaza de la Revolución', address: 'Ave. Paseo #102, Plaza de la Revolución, La Habana', schedule: 'Lunes a Sábado (10:00 AM - 6:00 PM)', active: true },
      { id: '3', name: 'Punto de Recogida - Playa', address: 'Calle 5ta Ave #3002, Playa, La Habana', schedule: 'Lunes a Viernes (11:00 AM - 4:00 PM)', active: true }
    ]
  );
  
  // Nuevo punto de recogida
  const [newPointName, setNewPointName] = useState('');
  const [newPointAddress, setNewPointAddress] = useState('');
  const [newPointSchedule, setNewPointSchedule] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editSchedule, setEditSchedule] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const mapLocations = (locs: any[]): PickupLocation[] =>
      locs.map(p => ({
        id: String(p.id || Date.now()),
        name: String(p.name || ''),
        address: String(p.address || ''),
        schedule: String(p.schedule || ''),
        active: p.active !== false
      }));

    const loadConfig = async () => {
      const config = await configService.getConfig();
      setEnabled(config.delivery.enabled);
      setDefaultCost(config.delivery.defaultCostMN.toString());
      if (config.delivery.pickupLocations) {
        setPickupLocations(mapLocations(config.delivery.pickupLocations));
      }
    };
    loadConfig();

    const handleConfigUpdate = () => {
      const config = configService.getConfigSync();
      setEnabled(config.delivery.enabled);
      setDefaultCost(config.delivery.defaultCostMN.toString());
      if (config.delivery.pickupLocations) {
        setPickupLocations(mapLocations(config.delivery.pickupLocations));
      }
    };

    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, []);

  const handleAddPickupPoint = () => {
    if (!newPointName.trim()) {
      toastError('Campo requerido', 'Por favor ingrese el nombre del punto de recogida.');
      return;
    }

    const newPoint: PickupLocation = {
      id: Date.now().toString(),
      name: newPointName.trim(),
      address: newPointAddress.trim(),
      schedule: newPointSchedule.trim(),
      active: true
    };

    setPickupLocations(prev => [...prev, newPoint]);
    setNewPointName('');
    setNewPointAddress('');
    setNewPointSchedule('');
    setShowAddForm(false);
  };

  const handleToggleActive = (id: string) => {
    setPickupLocations(prev =>
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
  };

  const handleDeletePickupPoint = (id: string) => {
    setPickupLocations(prev => prev.filter(p => p.id !== id));
  };

  const startEdit = (point: PickupLocation) => {
    setEditingId(point.id);
    setEditName(point.name);
    setEditAddress(point.address || '');
    setEditSchedule(point.schedule || '');
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    setPickupLocations(prev =>
      prev.map(p => p.id === id ? {
        ...p,
        name: editName.trim(),
        address: editAddress.trim(),
        schedule: editSchedule.trim()
      } : p)
    );
    setEditingId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const config = configService.getConfigSync();
    await configService.updateConfig({
      ...config,
      delivery: {
        ...config.delivery,
        enabled,
        defaultCostMN: parseInt(defaultCost) || 0,
        pickupLocations
      }
    });
    setIsSaving(false);
    success('Entregas y Recogidas actualizadas', 'Configuración de envíos y puntos de recogida guardada correctamente.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight">Configuración de Entregas y Recogidas</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Administra el sistema de envíos y los puntos de recogida de productos.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 space-y-8">
          {/* SECCIÓN 1: SISTEMA DE ENTREGAS A DOMICILIO */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${enabled ? 'bg-mare-blue/10 text-mare-blue' : 'bg-gray-100 text-gray-400'}`}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-black text-mare-navy uppercase tracking-tight text-sm">Envíos a Domicilio</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Habilitar envíos a domicilio en el checkout.</p>
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

            <div className={`mt-6 space-y-6 transition-opacity ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  Para configurar costos específicos por municipio, diríjase a la sección <strong className="font-black uppercase tracking-tight">Provincias y Municipios</strong> en el menú lateral.
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PUNTOS DE RECOGIDA DE PRODUCTOS */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-mare-navy/5 text-mare-navy rounded-2xl">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="font-black text-mare-navy uppercase tracking-tight text-sm">Puntos de Recogida</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Ubicaciones físicas donde los clientes recogen sus pedidos.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-mare-navy rounded-xl font-bold text-xs transition-all"
              >
                <Plus size={16} />
                {showAddForm ? 'Cancelar' : 'Añadir Punto'}
              </button>
            </div>

            {/* FORMULARIO PARA AÑADIR NUEVO PUNTO DE RECOGIDA */}
            {showAddForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-black text-mare-navy uppercase tracking-wider">Nuevo Punto de Recogida</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre / Identificador *</label>
                    <input
                      type="text"
                      placeholder="Ej: Tienda Vedado - Sede Central"
                      value={newPointName}
                      onChange={(e) => setNewPointName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-mare-navy focus:outline-none focus:border-mare-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Dirección / Referencia</label>
                    <input
                      type="text"
                      placeholder="Ej: Calle 23 #456 e/ H e I, Vedado"
                      value={newPointAddress}
                      onChange={(e) => setNewPointAddress(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-mare-navy focus:outline-none focus:border-mare-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Horario de Atención</label>
                    <input
                      type="text"
                      placeholder="Ej: Lunes a Viernes 9:00 AM - 5:00 PM"
                      value={newPointSchedule}
                      onChange={(e) => setNewPointSchedule(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-mare-navy focus:outline-none focus:border-mare-blue"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddPickupPoint}
                    className="px-4 py-2 bg-mare-navy text-white text-xs font-bold rounded-xl hover:bg-mare-navy/90 transition-all"
                  >
                    Guardar Punto
                  </button>
                </div>
              </div>
            )}

            {/* LISTADO DE PUNTOS DE RECOGIDA EXISTENTES */}
            <div className="space-y-3">
              {pickupLocations.length === 0 ? (
                <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl text-xs font-bold">
                  No hay puntos de recogida configurados. Añada uno arriba.
                </div>
              ) : (
                pickupLocations.map((point) => (
                  <div
                    key={point.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      point.active
                        ? 'bg-white border-gray-100 shadow-sm'
                        : 'bg-gray-50/60 border-gray-100 opacity-60'
                    }`}
                  >
                    {editingId === point.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            placeholder="Dirección"
                            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={editSchedule}
                            onChange={(e) => setEditSchedule(e.target.value)}
                            placeholder="Horario"
                            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEdit(point.id)}
                            className="px-3 py-1 bg-mare-navy text-white rounded-lg text-xs font-bold"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-mare-blue shrink-0" />
                            <span className="font-bold text-sm text-mare-navy">{point.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                point.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {point.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          {point.address && (
                            <p className="text-xs text-gray-600 pl-5">{point.address}</p>
                          )}
                          {point.schedule && (
                            <p className="text-[10px] text-gray-400 font-medium pl-5">{point.schedule}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(point.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              point.active
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {point.active ? 'Desactivar' : 'Activar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => startEdit(point)}
                            className="p-1.5 text-gray-400 hover:text-mare-navy hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePickupPoint(point.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
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

