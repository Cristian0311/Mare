import { useMemo } from 'react';
import { InfoBreadcrumbs } from '../../components/ui/InfoBreadcrumbs';
import { Truck, MapPin, Clock, CreditCard } from 'lucide-react';
import { cubaLocations } from '../../data/cubaLocations';
import { SEO } from '../../components/ui/SEO';

export function Deliveries() {
  const selectedProvince = useMemo(() => 
    cubaLocations.find(p => p.id === 'la-habana'), 
    []
  );

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Entregas y Envíos" 
        description="Consulta las zonas de entrega, tarifas y tiempos de envío de MARÉ en La Habana."
      />
      <InfoBreadcrumbs items={[{ name: 'Entregas' }]} />
      
      <header className="mb-10">
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-4">
          Entregas y Envíos
        </h1>
        <p className="text-gray-500 font-medium">
          En MARÉ realizamos entregas rápidas y seguras en toda La Habana.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight mb-2">Tiempos de entrega</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Las entregas en La Habana se realizan usualmente en un plazo de 24 a 48 horas hábiles tras confirmar la disponibilidad por WhatsApp.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight mb-2">Costos de envío</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Las tarifas varían según el municipio de La Habana. Puedes consultarlas en la tabla de abajo o durante el proceso de checkout.
          </p>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-mare-green" />
          <h2 className="text-xl font-black text-mare-navy tracking-tight uppercase">Tarifas por Municipio</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="space-y-3">
            <div className="grid grid-cols-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Municipio</span>
              <span className="text-right">Costo de Envío</span>
            </div>
            {selectedProvince?.municipios.map((m) => (
              <div 
                key={m.id} 
                className={`grid grid-cols-2 items-center p-4 rounded-xl border ${m.activo ? 'bg-white border-gray-100' : 'bg-gray-50/50 border-transparent opacity-60'}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-mare-navy">{m.nombre}</span>
                  {!m.activo && <span className="text-[9px] font-bold text-gray-400">No disponible</span>}
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black ${m.precioEntregaMN > 0 ? 'text-mare-navy' : 'text-mare-green'}`}>
                    {m.activo ? (m.precioEntregaMN > 0 ? `${m.precioEntregaMN} MN` : 'GRATIS') : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Recogida en tienda</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            También ofrecemos la opción de recoger tu pedido en nuestros puntos de recogida autorizados en La Habana sin costo adicional. Podrás seleccionar esta opción al finalizar tu pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
