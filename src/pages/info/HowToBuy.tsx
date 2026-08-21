import { Link } from 'react-router-dom';
import { InfoBreadcrumbs } from '../../components/ui/InfoBreadcrumbs';
import { ShoppingBag, Search, CheckSquare, ListChecks, Send, MessageCircle } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { useState, useEffect } from 'react';

const defaultSteps = [
  {
    number: '01',
    title: 'Explora',
    description: 'Busca los productos que te interesen navegando por nuestras categorías o utilizando el buscador.',
    icon: <Search className="h-6 w-6" />
  },
  {
    number: '02',
    title: 'Selecciona',
    description: 'Agrega los productos que deseas a tu pedido presionando el botón "Añadir al pedido".',
    icon: <ShoppingBag className="h-6 w-6" />
  },
  {
    number: '03',
    title: 'Revisa',
    description: 'Entra en "Mi Pedido" para comprobar cantidades, precios y detalles de los productos seleccionados.',
    icon: <ListChecks className="h-6 w-6" />
  },
  {
    number: '04',
    title: 'Completa',
    description: 'Rellena el formulario con tus datos de contacto y selecciona tu método de entrega preferido.',
    icon: <CheckSquare className="h-6 w-6" />
  },
  {
    number: '05',
    title: 'Envía',
    description: 'MARÉ preparará automáticamente un mensaje con todos los detalles de tu pedido.',
    icon: <Send className="h-6 w-6" />
  },
  {
    number: '06',
    title: 'WhatsApp',
    description: 'Serás redirigido a WhatsApp para enviar el pedido. Allí confirmaremos disponibilidad y detalles finales.',
    icon: <MessageCircle className="h-6 w-6" />
  }
];

export function HowToBuy() {
  const [steps, setSteps] = useState<any[]>(defaultSteps);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('MARE_HOW_TO_BUY');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map original step icons back
        const merged = parsed.map((item: any, idx: number) => ({
          ...item,
          icon: defaultSteps[idx]?.icon || <Search className="h-6 w-6" />
        }));
        setSteps(merged);
      }
    } catch (e) {
      console.warn('Failed loading local How To Buy steps', e);
    }
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Cómo comprar" 
        description="Aprende paso a paso cómo realizar un pedido en MARÉ, tu tienda catálogo con atención personalizada por WhatsApp."
      />
      <InfoBreadcrumbs items={[{ name: 'Cómo comprar' }]} />
      
      <header className="mb-10">
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-4">
          Cómo comprar en MARÉ
        </h1>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <p className="text-sm font-bold text-amber-900 leading-relaxed">
            <span className="block mb-1">📢 Importante:</span>
            MARÉ es una tienda catálogo. El pedido se finaliza a través de WhatsApp. 
            No se realiza ningún pago online directamente en esta página.
          </p>
        </div>
      </header>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative flex gap-6">
            {index !== steps.length - 1 && (
              <div className="absolute left-6 top-12 bottom-[-24px] w-0.5 border-l-2 border-dashed border-gray-100"></div>
            )}
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-mare-green text-white flex items-center justify-center font-black text-xl shadow-lg z-10">
              {step.number}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-mare-green">{step.icon}</span>
                <h3 className="text-lg font-black text-mare-navy tracking-tight uppercase">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 text-center">
        <h3 className="text-sm font-black text-mare-navy uppercase tracking-widest mb-3">¿Listo para empezar?</h3>
        <p className="text-gray-500 text-sm mb-6">
          Explora nuestras categorías y encuentra lo que buscas hoy mismo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to="/categorias"
            className="px-8 py-3 rounded-xl bg-mare-navy text-white font-black text-[10px] tracking-widest uppercase shadow-md hover:bg-black transition-colors"
          >
            Ver Categorías
          </Link>
          <Link 
            to="/coleccion/ofertas"
            className="px-8 py-3 rounded-xl bg-mare-green text-white font-black text-[10px] tracking-widest uppercase shadow-md hover:bg-mare-turquoise transition-colors"
          >
            Ver Ofertas
          </Link>
        </div>
      </div>
    </div>
  );
}
