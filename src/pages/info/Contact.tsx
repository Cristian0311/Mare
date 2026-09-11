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
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-mare-turquoise/20 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-mare-turquoise/50 transition-all group relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-mare-turquoise/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-mare-turquoise/10 transition-colors"></div>
        
        <div className="relative z-10 flex items-center gap-4 w-full sm:w-auto text-left">
          <div className="w-12 h-12 bg-mare-navy text-mare-turquoise rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-mare-navy font-black text-sm tracking-tight mb-0.5 group-hover:text-mare-turquoise transition-colors">
              Canal Oficial de MARÉ
            </h3>
            <p className="text-gray-500 text-xs font-medium">
              Entérate primero de ofertas y novedades
            </p>
          </div>
        </div>
        
        <div className="relative z-10 shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
          <div className="flex items-center justify-center w-full sm:w-auto bg-mare-navy text-white px-5 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest group-hover:bg-mare-turquoise transition-colors shadow-sm">
            Unirme al Canal
          </div>
        </div>
      </a>
    </div>
  );
}
