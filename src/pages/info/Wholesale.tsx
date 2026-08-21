import { InfoBreadcrumbs } from '../../components/ui/InfoBreadcrumbs';
import { Package, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/ui/SEO';

export function Wholesale() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Ventas al por Mayor" 
        description="Información sobre compras mayoristas en MARÉ. Descuentos por volumen, paquetes y cajas para emprendedores."
      />
      <InfoBreadcrumbs items={[{ name: 'Mayoristas' }]} />
      
      <header className="mb-10">
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-4">
          Ventas al por Mayor
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          En MARÉ apoyamos a emprendedores y negocios ofreciendo precios competitivos en compras por volumen.
        </p>
      </header>

      <div className="bg-mare-navy rounded-3xl p-8 text-white mb-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
            <Package className="h-6 w-6 text-mare-green" />
            Beneficios Mayoristas
          </h2>
          <ul className="space-y-4">
            {[
              'Precios reducidos por volumen (paquete, caja o lote).',
              'Atención prioritaria para grandes pedidos.',
              'Información anticipada sobre nuevas llegadas.',
              'Posibilidad de pedidos personalizados bajo demanda.'
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <CheckCircle className="h-5 w-5 text-mare-green flex-shrink-0 mt-0.5" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-mare-green/10 rounded-full blur-3xl"></div>
      </div>

      <section className="mb-12">
        <h3 className="text-sm font-black text-mare-navy uppercase tracking-widest mb-6">¿Cómo funciona?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Identifica',
              desc: 'Busca productos con el distintivo de Mayorista o precios por cantidad.'
            },
            {
              title: 'Añade',
              desc: 'Al agregar la cantidad mínima requerida, el precio se ajustará automáticamente.'
            },
            {
              title: 'Confirma',
              desc: 'Finaliza tu pedido y en WhatsApp coordinaremos los detalles de logística.'
            }
          ].map((step, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <span className="block text-mare-green font-black text-lg mb-2">0{i+1}</span>
              <h4 className="text-sm font-black text-mare-navy uppercase mb-2">{step.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="p-8 rounded-3xl bg-gray-50 text-center">
        <h3 className="text-xl font-black text-mare-navy tracking-tight mb-4">¿Buscas algo específico al por mayor?</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Si necesitas grandes volúmenes de un producto que no ves en el catálogo, contáctanos y buscaremos la mejor solución para tu negocio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/coleccion/mayorista" 
            className="flex items-center gap-2 text-sm font-black text-mare-navy uppercase tracking-widest group"
          >
            Ver productos mayoristas
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-gray-300 hidden sm:block">|</span>
          <Link 
            to="/informacion/contacto" 
            className="px-8 py-3 rounded-xl bg-mare-green text-white font-black text-[10px] tracking-widest uppercase shadow-md hover:bg-mare-turquoise transition-colors"
          >
            Hablar con un asesor
          </Link>
        </div>
      </div>
    </div>
  );
}
