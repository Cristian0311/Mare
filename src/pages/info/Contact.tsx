import { InfoBreadcrumbs } from '../../components/ui/InfoBreadcrumbs';
import { MessageCircle, Clock, MapPin, Share2 } from 'lucide-react';
import { appConfig } from '../../config';
import { SEO } from '../../components/ui/SEO';
import { useWhatsApp } from '../../contexts/WhatsAppContext';

export function Contact() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Contacto" 
        description="Ponte en contacto con MARÉ. Estamos disponibles para ayudarte con tus dudas y pedidos a través de WhatsApp."
      />
      <InfoBreadcrumbs items={[{ name: 'Contacto' }]} />
      
      <header className="mb-10">
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-4">
          Contacto
        </h1>
        <p className="text-gray-500 font-medium">
          ¿Tienes alguna duda o necesitas ayuda con tu pedido? Estamos a un mensaje de distancia.
        </p>
      </header>

      <div className="space-y-4 mb-12">
        <button 
          onClick={() => openWhatsApp()}
          className="flex items-center w-full text-left p-6 rounded-3xl bg-green-50 border border-green-100 hover:border-green-300 transition-all group shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-mare-green text-white flex items-center justify-center mr-5 shadow-lg group-hover:scale-110 transition-transform">
            <MessageCircle className="h-6 w-6 fill-current" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight mb-1">WhatsApp Oficial</h3>
            <p className="text-xs text-gray-500 font-bold">{appConfig.whatsappNumber}</p>
          </div>
          <span className="text-[10px] font-black text-mare-green uppercase tracking-widest hidden sm:block">Escribir ahora</span>
        </button>

        <div className="flex items-start p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mr-5">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight mb-1">Horario de Atención</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">Sábados: 10:00 AM - 2:00 PM</p>
          </div>
        </div>

        <div className="flex items-start p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mr-5">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-mare-navy uppercase tracking-tight mb-1">Ubicación</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">La Habana, Cuba</p>
            <p className="text-[10px] text-gray-400 mt-1 italic font-bold">* Tienda exclusivamente online con puntos de recogida autorizados.</p>
          </div>
        </div>
      </div>

      <a 
        href="https://whatsapp.com/channel/0029VbDQEzM6hENkcQneXg35" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-8 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center hover:shadow-lg transition-all hover:-translate-y-1"
      >
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Share2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-black tracking-tight mb-2">Canal Oficial de MARÉ</h3>
        <p className="text-sm text-green-50 font-medium mb-6 max-w-md mx-auto">
          Únete a nuestro canal de WhatsApp para enterarte primero de las mejores ofertas, nuevos productos y noticias exclusivas.
        </p>
        <div className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-colors shadow-sm">
          Seguir Canal
        </div>
      </a>
    </div>
  );
}
