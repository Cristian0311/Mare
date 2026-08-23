import { useState, useEffect } from 'react';
import { MapPin, Store, Clock } from 'lucide-react';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { CheckoutData } from '../../hooks/useCheckoutForm';
import { locationService } from '../../services/locations';
import { Province } from '../../data/cubaLocations';
import { configService } from '../../services/config';

interface PickupLocation {
  id: string;
  name: string;
  address?: string;
  schedule?: string;
  active: boolean;
}

interface AddressSelectorProps {
  data: CheckoutData;
  updateField: (field: keyof CheckoutData, value: string) => void;
  errors: Partial<Record<keyof CheckoutData, string>>;
}

export function AddressSelector({ data, updateField, errors }: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  
  useEffect(() => {
    setProvinces(locationService.getProvincesSync());
    
    const loadConfig = async () => {
      const config = await configService.getConfig();
      if (config.delivery?.pickupLocations) {
        setPickupLocations(config.delivery.pickupLocations.filter((p: PickupLocation) => p.active !== false));
      }
    };
    loadConfig();
    
    const handleLocationUpdate = () => {
      setProvinces(locationService.getProvincesSync());
    };

    const handleConfigUpdate = () => {
      const config = configService.getConfigSync();
      if (config.delivery?.pickupLocations) {
        setPickupLocations(config.delivery.pickupLocations.filter((p: PickupLocation) => p.active !== false));
      }
    };
    
    window.addEventListener('mare_locations_updated', handleLocationUpdate);
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('mare_locations_updated', handleLocationUpdate);
      window.removeEventListener('mare_config_updated', handleConfigUpdate);
    };
  }, []);

  const activeProvinces = provinces;
  const selectedProvince = provinces.find(p => p.id === data.provincia);
  const activeMunicipalities = selectedProvince?.municipios.filter(m => m.activo) || [];

  const selectedPickupPoint = pickupLocations.find(p => p.name === data.puntoRecogida);

  const pickupOptions = [
    { value: '', label: 'Seleccionar punto de recogida...' },
    ...pickupLocations.map(p => ({
      value: p.name,
      label: `${p.name}${p.schedule ? ` (${p.schedule})` : ''}`
    })),
    { value: 'pendiente', label: 'Pendiente de asignar (Se le contactará por WhatsApp)' }
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-mare-navy/5 rounded-lg">
          <MapPin className="w-4 h-4 text-mare-navy" />
        </div>
        <h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">03 — UBICACIÓN</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.metodoEntrega === 'domicilio' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                label="Provincia *"
                value={data.provincia}
                onChange={(e) => updateField('provincia', e.target.value)}
                error={errors.provincia}
                options={[
                  { value: '', label: 'Seleccionar...' },
                  ...activeProvinces.map(p => ({ value: p.id, label: p.nombre }))
                ]}
                className="rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <Select
                label="Municipio (Entrega a domicilio) *"
                value={data.municipio}
                onChange={(e) => updateField('municipio', e.target.value)}
                error={errors.municipio}
                disabled={!data.provincia}
                options={[
                  { value: '', label: 'Seleccionar...' },
                  ...activeMunicipalities.map(m => ({ 
                    value: m.nombre, 
                    label: `${m.nombre} (+${m.precioEntregaMN} MN)` 
                  }))
                ]}
                className="rounded-xl text-sm font-bold"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Select
              label="Seleccionar Tienda / Punto de Recogida *"
              value={data.puntoRecogida}
              onChange={(e) => updateField('puntoRecogida', e.target.value)}
              error={errors.puntoRecogida}
              options={pickupOptions}
              className="rounded-xl text-sm font-bold"
            />

            {selectedPickupPoint && (selectedPickupPoint.address || selectedPickupPoint.schedule) && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-1.5 text-xs">
                {selectedPickupPoint.address && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <Store className="w-3.5 h-3.5 text-mare-navy shrink-0 mt-0.5" />
                    <span className="font-bold">{selectedPickupPoint.address}</span>
                  </div>
                )}
                {selectedPickupPoint.schedule && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-mare-blue shrink-0" />
                    <span className="font-medium">{selectedPickupPoint.schedule}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-[10px] font-bold text-gray-400 italic">
              * Eliges dónde recoger tu pedido sin costo adicional por envío.
            </p>
          </div>
        )}

        {data.metodoEntrega === 'domicilio' && (
          <>
            <div>
              <Input
                label="Dirección detallada *"
                placeholder="Calle, número, entre calles, apartamento..."
                value={data.direccion}
                onChange={(e) => updateField('direccion', e.target.value)}
                error={errors.direccion}
                className="rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <Input
                label="Referencia (Opcional)"
                placeholder="Ej: Casa azul frente al parque"
                value={data.referencia}
                onChange={(e) => updateField('referencia', e.target.value)}
                className="rounded-xl text-sm font-bold"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
