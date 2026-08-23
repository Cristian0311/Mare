import { InfoBreadcrumbs } from '../../components/ui/InfoBreadcrumbs';
import { SEO } from '../../components/ui/SEO';
import { useState, useEffect } from 'react';

const defaultTerms = [
  { id: 't1', title: '01. Condiciones de Compra', text: 'MARÉ opera como una tienda catálogo online. Al realizar un pedido en nuestra plataforma, el usuario está manifestando su interés en adquirir los productos seleccionados. La transacción final, incluyendo la confirmación de stock, detalles de pago y envío, se realiza de forma personalizada a través de WhatsApp.' },
  { id: 't2', title: '02. Disponibilidad y Precios', text: 'Hacemos nuestro mejor esfuerzo por mantener el catálogo actualizado. Sin embargo, la disponibilidad real se confirmará en el momento del contacto por WhatsApp. Los precios mostrados en MN (CUP) son los precios finales del producto, excluyendo el costo de envío. Los precios en USD son informativos y calculados según la tasa de cambio vigente en el sitio.' },
  { id: 't3', title: '03. Pedidos y Envíos', text: 'Una vez enviado el pedido desde la web, nuestro equipo se pondrá en contacto en el menor tiempo posible. MARÉ actualmente solo realiza entregas a domicilio dentro de La Habana. El envío se realizará a la dirección proporcionada o estará disponible para recogida según lo acordado. MARÉ no se hace responsable de retrasos causados por información de contacto incorrecta proporcionada por el cliente.' },
  { id: 't4', title: '04. Cambios y Devoluciones', text: 'Se aceptan cambios o devoluciones únicamente por defectos de fabricación comprobados en un plazo máximo de 48 horas tras recibir el producto. El producto debe conservar su embalaje original y etiquetas. No se aceptan devoluciones por cambio de opinión una vez que el producto ha sido entregado y aceptado por el cliente.' }
];

export function Conditions() {
  const [terms, setTerms] = useState<any[]>(defaultTerms);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('MARE_TERMS');
      if (saved) {
        setTerms(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed loading terms from localStorage', e);
    }
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Condiciones de Compra" 
        description="Conoce los términos y condiciones, políticas de privacidad y devoluciones de MARÉ."
      />
      <InfoBreadcrumbs items={[{ name: 'Condiciones' }]} />
      
      <header className="mb-10">
        <h1 className="text-3xl font-black text-mare-navy tracking-tighter mb-4">
          Términos y Condiciones
        </h1>
        <p className="text-gray-500 font-medium italic">
          Última actualización: 7 de agosto, 2026
        </p>
      </header>

      <div className="prose prose-sm prose-mare max-w-none space-y-8">
        {terms.map((term) => (
          <section key={term.id}>
            <h2 className="text-lg font-black text-mare-navy uppercase tracking-tight mb-3 border-l-4 border-mare-green pl-3">
              {term.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {term.text}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-gray-50 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          MARÉ se reserva el derecho de modificar estas condiciones en cualquier momento.
        </p>
      </div>
    </div>
  );
}
