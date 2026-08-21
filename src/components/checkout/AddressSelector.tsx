import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { CheckoutData } from '../../hooks/useCheckoutForm';
import { locationService } from '../../services/locations';
import { Province, Municipality } from '../../data/cubaLocations';

interface AddressSelectorProps {
  data: CheckoutData;
  updateField: (field: keyof CheckoutData, value: string) => void;
  errors: Partial<Record<keyof CheckoutData, string>>;
}

export function AddressSelector({ data, updateField, errors }: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  
  useEffect(() => {
    setProvinces(locationService.getProvincesSync());
    
    const handleUpdate = () => {
      setProvinces(locationService.getProvincesSync());
    };
    
    window.addEventListener('mare_locations_updated', handleUpdate);
    return () => window.removeEventListener('mare_locations_updated', handleUpdate);
  }, []);

  const activeProvinces = provinces;
  const selectedProvince = provinces.find(p => p.id === data.provincia);
  const activeMunicipalities = selectedProvince?.municipios.filter(m => m.activo) || [];

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
          <div>
            <Select
              label="Seleccionar Tienda / Punto de Recogida *"
              value={data.puntoRecogida}
              onChange={(e) => updateField('puntoRecogida', e.target.value)}
              error={errors.puntoRecogida}
              options={[
                { value: '', label: 'Seleccionar punto de recogida...' },
                { value: 'Sede Central - La Habana', label: 'Sede Central - La Habana (L-V 9am-5pm)' },
                { value: 'Almacén 1 - Plaza de la Rev.', label: 'Almacén 1 - Plaza de la Rev. (L-S 10am-6pm)' },
                { value: 'Punto de Recogida - Playa', label: 'Punto de Recogida - Playa (L-V 11am-4pm)' },
                { value: 'pendiente', label: 'Pendiente de asignar (Se le contactará por WhatsApp)' }
              ]}
              className="rounded-xl text-sm font-bold"
            />
            <p className="mt-2 text-[10px] font-bold text-gray-400 italic">
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
