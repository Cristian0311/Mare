import { Link } from 'react-router-dom';
import { InfoBreadcrumbs } from '../../components/ui/InfoBreadcrumbs';
import { Accordion } from '../../components/ui/Accordion';
import { Search, CircleHelp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SEO } from '../../components/ui/SEO';
import { configService } from '../../services/config';

const defaultFaqs = [
  {
    category: 'Pedidos',
    questions: [
      {
        id: 'q1',
        title: '¿Cómo hago un pedido?',
        content: 'Es muy sencillo: explora nuestros productos, añádelos a tu pedido, completa el formulario con tus datos y envíalo. Serás redirigido a WhatsApp para finalizar la compra con nuestro equipo.'
      },
      {
        id: 'q2',
        title: '¿Tengo que registrarme para comprar?',
        content: 'No es necesario registrarse ni crear una cuenta. Queremos que tu experiencia sea lo más rápida y sencilla posible.'
      },
      {
        id: 'q3',
        title: '¿Puedo cambiar o cancelar mi pedido?',
        content: 'Sí, siempre que el pedido no haya sido enviado. Como la confirmación final se hace por WhatsApp, puedes comunicarte con nosotros allí mismo para cualquier modificación.'
      }
    ]
  },
  {
    category: 'Pagos y Precios',
    questions: [
      {
        id: 'q4',
        title: '¿Cómo puedo pagar?',
        content: 'MARÉ es una tienda catálogo y el pago no se realiza directamente en la web. Al contactarnos por WhatsApp tras enviar tu pedido, te informaremos sobre los métodos de pago disponibles (Efectivo, etc.).'
      },
      {
        id: 'q5',
        title: '¿Puedo ver los precios en USD?',
        content: 'Sí. Por defecto los precios se muestran en MN (CUP), pero puedes utilizar el selector de moneda en el menú para ver una conversión informativa en USD según la tasa actual.'
      },
      {
        id: 'q6',
        title: '¿Los precios incluyen el envío?',
        content: 'No, el costo de envío se calcula por separado según tu municipio de residencia en La Habana y se añade al total de tu pedido al finalizarlo.'
      }
    ]
  },
  {
    category: 'Productos',
    questions: [
      {
        id: 'q7',
        title: '¿Tienen garantía los productos?',
        content: 'Sí, todos nuestros productos cuentan con garantía contra defectos de fábrica. El tiempo de garantía varía según el tipo de producto. Consúltanos por WhatsApp para detalles específicos.'
      },
      {
        id: 'q8',
        title: '¿Venden al por mayor?',
        content: 'Sí. Muchos de nuestros productos tienen precios especiales para compras por volumen (paquetes, cajas o lotes). Puedes identificar estos productos por la etiqueta "Mayorista" o visitar la sección correspondiente.'
      }
    ]
  }
];

const catalogFaqs = [
  {
    category: 'Catálogo y Compras',
    questions: [
      {
        id: 'q1',
        title: '¿Cómo adquiero un producto del catálogo?',
        content: 'Actualmente funcionamos como catálogo digital para que explores nuestra colección. Visítanos en nuestra tienda física para ver, probar y comprar los productos directamente con atención personalizada.'
      },
      {
        id: 'q2',
        title: '¿Puedo reservar un producto online?',
        content: 'Las compras online directas están desactivadas en este modo. Para cualquier duda, reserva o consulta sobre disponibilidad, puedes tocar el botón "Preguntar por este producto" en la ficha del artículo y contactar a nuestros asesores vía WhatsApp.'
      },
      {
        id: 'q3',
        title: '¿Tienen la misma disponibilidad en la tienda física?',
        content: 'Nuestro catálogo se actualiza constantemente para reflejar el inventario de nuestra tienda. Te sugerimos confirmar la disponibilidad por WhatsApp antes de visitarnos para asegurar tu artículo.'
      }
    ]
  },
  {
    category: 'Ubicación y Horarios',
    questions: [
      {
        id: 'q4',
        title: '¿Dónde están ubicados?',
        content: 'Nuestra tienda física se encuentra en la dirección especificada en el pie de página de nuestra web. Allí mismo encontrarás el enlace directo a Google Maps y nuestros horarios de atención actualizados.'
      },
      {
        id: 'q5',
        title: '¿Qué métodos de pago aceptan en la tienda?',
        content: 'En nuestra tienda física aceptamos pagos en efectivo (MN y USD), transferencias bancarias y otros métodos según disponibilidad. Consulta con un asesor por WhatsApp si tienes dudas específicas.'
      }
    ]
  }
];

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [config, setConfig] = useState(configService.getConfigSync());
  const isCatalog = config?.features?.catalogMode;
  const [faqs, setFaqs] = useState<any[]>(isCatalog ? catalogFaqs : defaultFaqs);

  useEffect(() => {
    const handleConfigUpdate = () => {
      const newConfig = configService.getConfigSync();
      setConfig(newConfig);
      if (newConfig?.features?.catalogMode) {
        setFaqs(catalogFaqs);
      } else {
        try {
          const saved = localStorage.getItem('MARE_FAQS');
          setFaqs(saved ? JSON.parse(saved) : defaultFaqs);
        } catch (e) {
          setFaqs(defaultFaqs);
        }
      }
    };
    window.addEventListener('mare_config_updated', handleConfigUpdate);
    
    if (!isCatalog) {
      try {
        const saved = localStorage.getItem('MARE_FAQS');
        if (saved) setFaqs(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load FAQs from storage', e);
      }
    }
    
    return () => window.removeEventListener('mare_config_updated', handleConfigUpdate);
  }, [isCatalog]);

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter((q: any) => 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Preguntas Frecuentes" 
        description="Encuentra respuestas rápidas a las dudas más comunes sobre pedidos, pagos, envíos y productos en MARÉ."
      />
      <InfoBreadcrumbs items={[{ name: 'Preguntas Frecuentes' }]} />
      
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-mare-green/10 text-mare-green mb-4">
          <CircleHelp className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-4">
          Preguntas Frecuentes
        </h1>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="¿Qué necesitas saber?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-mare-green transition-all text-sm font-bold shadow-inner"
          />
        </div>
      </header>

      <div className="space-y-10">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">
                {category.category}
              </h2>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
                {category.questions.map((q) => (
                  <Accordion key={q.id} id={q.id} title={q.title}>
                    {q.content}
                  </Accordion>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 font-bold">No encontramos respuestas para tu búsqueda.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-mare-green font-bold text-sm mt-2 hover:underline"
            >
              Ver todas las preguntas
            </button>
          </div>
        )}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 mb-4">¿No encontraste lo que buscabas?</p>
        <Link 
          to="/informacion/contacto"
          className="text-sm font-black text-mare-navy uppercase tracking-widest border-b-2 border-mare-green pb-1 hover:text-mare-green transition-colors"
        >
          Contactar con Soporte
        </Link>
      </div>
    </div>
  );
}
