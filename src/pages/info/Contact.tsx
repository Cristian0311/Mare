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

      <div className="p-8 rounded-3xl bg-mare-navy text-white text-center">
        <h3 className="text-sm font-black uppercase tracking-widest mb-6">Síguenos en Redes Sociales</h3>
        <div className="flex justify-center gap-6">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-mare-green transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
          {/* Aquí se pueden añadir más iconos de redes sociales cuando se tengan */}
        </div>
      </div>
    </div>
  );
}
