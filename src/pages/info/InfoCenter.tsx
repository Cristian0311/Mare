import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  HelpCircle, 
  FileText, 
  Package, 
  MessageCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { SEO } from '../../components/ui/SEO';

const infoCards = [
  {
    id: 'como-comprar',
    title: 'Cómo comprar',
    description: 'Guía paso a paso para realizar tu pedido.',
    icon: <ShoppingBag className="h-6 w-6" />,
    path: '/informacion/como-comprar',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'entregas',
    title: 'Entregas',
    description: 'Zonas, costos y tiempos de envío.',
    icon: <Truck className="h-6 w-6" />,
    path: '/informacion/entregas',
    color: 'bg-green-50 text-green-600'
  },
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    description: 'Respuestas a tus dudas más comunes.',
    icon: <HelpCircle className="h-6 w-6" />,
    path: '/informacion/faq',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'condiciones',
    title: 'Condiciones',
    description: 'Políticas de compra y devoluciones.',
    icon: <FileText className="h-6 w-6" />,
    path: '/informacion/condiciones',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'mayoristas',
    title: 'Mayoristas',
    description: 'Información para compras al por mayor.',
    icon: <Package className="h-6 w-6" />,
    path: '/informacion/mayoristas',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    id: 'contacto',
    title: 'Contacto',
    description: 'Nuestros canales de atención al cliente.',
    icon: <MessageCircle className="h-6 w-6" />,
    path: '/informacion/contacto',
    color: 'bg-teal-50 text-teal-600'
  }
];

export function InfoCenter() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Centro de Información" 
        description="Encuentra toda la información que necesitas para comprar en MARÉ: cómo comprar, entregas, preguntas frecuentes y más."
      />
      
      <div className="pt-8 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mare-green/10 text-mare-green mb-6">
          <Info className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-3">
          ¿Cómo podemos ayudarte?
        </h1>
        <p className="text-gray-500 font-medium max-w-md mx-auto">
          Encuentra toda la información que necesitas para comprar en MARÉ.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoCards.map((card) => (
          <Link 
            key={card.id}
            to={card.path}
            className="flex items-start p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-mare-green/30 transition-all group"
          >
            <div className={`p-3 rounded-xl mr-4 ${card.color} transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight mb-1 group-hover:text-mare-green transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
            <div className="self-center ml-2 text-gray-300 group-hover:text-mare-green group-hover:translate-x-1 transition-all">
              <ChevronRight className="h-5 w-5" />
            </div>
          </Link>
        ))}
      </div>

      <a 
        href="https://whatsapp.com/channel/0029VbDQEzM6hENkcQneXg35"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 block p-8 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center hover:shadow-lg transition-all hover:-translate-y-1"
      >
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <MessageCircle className="h-8 w-8 text-white fill-current" />
        </div>
        <h3 className="text-xl font-black tracking-tight mb-2">Canal Oficial en WhatsApp</h3>
        <p className="text-sm text-green-50 font-medium mb-6 max-w-md mx-auto">
          Sigue el canal de MARÉ GUINERA en WhatsApp para enterarte primero de las mejores ofertas, nuevos productos y noticias exclusivas.
        </p>
        <div className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-colors shadow-sm">
          Unirme al Canal
        </div>
      </a>
    </div>
  );
}
