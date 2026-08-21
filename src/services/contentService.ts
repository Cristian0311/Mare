import { supabase } from '../lib/supabase/client';
import { configService } from './config';

export interface FAQ {
  id: string;
  title: string;
  content: string;
}

export interface FAQCategory {
  category: string;
  questions: FAQ[];
}

export interface HowToBuyStep {
  number: string;
  title: string;
  description: string;
}

export interface Term {
  id: string;
  title: string;
  text: string;
}

class ContentService {
  private readonly HOW_TO_BUY_KEY = 'MARE_HOW_TO_BUY';
  private readonly FAQS_KEY = 'MARE_FAQS';
  private readonly TERMS_KEY = 'MARE_TERMS';

  /**
   * Loads How to Buy steps from store_settings or fallback
   */
  async getHowToBuy(): Promise<HowToBuyStep[]> {
    const settings = await configService.getStoreSettings();
    if (settings && settings[this.HOW_TO_BUY_KEY]) {
      try {
        return typeof settings[this.HOW_TO_BUY_KEY] === 'string' 
          ? JSON.parse(settings[this.HOW_TO_BUY_KEY]) 
          : settings[this.HOW_TO_BUY_KEY];
      } catch (e) {
        console.error('Error parsing HowToBuy from DB:', e);
      }
    }

    // Fallback to localStorage for migration period
    const local = localStorage.getItem(this.HOW_TO_BUY_KEY);
    if (local) return JSON.parse(local);

    // Hardcoded defaults
    return [
      { number: '01', title: 'Explora', description: 'Busca los productos que te interesen navegando por nuestras categorías o utilizando el buscador.' },
      { number: '02', title: 'Selecciona', description: 'Agrega los productos que deseas a tu pedido presionando el botón "Añadir al pedido".' },
      { number: '03', title: 'Revisa', description: 'Entra en "Mi Pedido" para comprobar cantidades, precios y detalles de los productos seleccionados.' },
      { number: '04', title: 'Completa', description: 'Rellena el formulario con tus datos de contacto y selecciona tu método de entrega preferido.' },
      { number: '05', title: 'Envía', description: 'MARÉ preparará automáticamente un mensaje con todos los detalles de tu pedido.' },
      { number: '06', title: 'WhatsApp', description: 'Serás redirigido a WhatsApp para enviar el pedido. Allí confirmaremos disponibilidad y detalles finales.' }
    ];
  }

  /**
   * Saves How to Buy steps to store_settings
   */
  async saveHowToBuy(steps: HowToBuyStep[]): Promise<void> {
    await configService.updateStoreSettings({
      [this.HOW_TO_BUY_KEY]: steps
    });
    localStorage.setItem(this.HOW_TO_BUY_KEY, JSON.stringify(steps));
  }

  /**
   * Loads FAQs from store_settings or fallback
   */
  async getFAQs(): Promise<FAQCategory[]> {
    const settings = await configService.getStoreSettings();
    if (settings && settings[this.FAQS_KEY]) {
      try {
        return typeof settings[this.FAQS_KEY] === 'string' 
          ? JSON.parse(settings[this.FAQS_KEY]) 
          : settings[this.FAQS_KEY];
      } catch (e) {
        console.error('Error parsing FAQs from DB:', e);
      }
    }

    const local = localStorage.getItem(this.FAQS_KEY);
    if (local) return JSON.parse(local);

    return [
      {
        category: 'Pedidos',
        questions: [
          { id: 'q1', title: '¿Cómo hago un pedido?', content: 'Es muy sencillo: explora nuestros productos, añádelos a tu pedido, completa el formulario con tus datos y envíalo. Serás redirigido a WhatsApp para finalizar la compra con nuestro equipo.' },
          { id: 'q2', title: '¿Tengo que registrarme para comprar?', content: 'No es necesario registrarse ni crear una cuenta. Queremos que tu experiencia sea lo más rápida y sencilla posible.' },
          { id: 'q3', title: '¿Puedo cambiar o cancelar mi pedido?', content: 'Sí, siempre que el pedido no haya sido enviado. Como la confirmación final se hace por WhatsApp, puedes comunicarte con nosotros allí mismo para cualquier modificación.' }
        ]
      },
      {
        category: 'Pagos y Precios',
        questions: [
          { id: 'q4', title: '¿Cómo puedo pagar?', content: 'MARÉ es una tienda catálogo y el pago no se realiza directamente en la web. Al contactarnos por WhatsApp tras enviar tu pedido, te informaremos sobre los métodos de pago disponibles (Transferencia, Efectivo, etc.).' },
          { id: 'q5', title: '¿Puedo ver los precios en USD?', content: 'Sí. Por defecto los precios se muestran en MN (CUP), pero puedes utilizar el selector de moneda en el menú para ver una conversión informativa en USD según la tasa actual.' }
        ]
      }
    ];
  }

  /**
   * Saves FAQs to store_settings
   */
  async saveFAQs(faqs: FAQCategory[]): Promise<void> {
    await configService.updateStoreSettings({
      [this.FAQS_KEY]: faqs
    });
    localStorage.setItem(this.FAQS_KEY, JSON.stringify(faqs));
  }

  /**
   * Loads Terms from store_settings or fallback
   */
  async getTerms(): Promise<Term[]> {
    const settings = await configService.getStoreSettings();
    if (settings && settings[this.TERMS_KEY]) {
      try {
        return typeof settings[this.TERMS_KEY] === 'string' 
          ? JSON.parse(settings[this.TERMS_KEY]) 
          : settings[this.TERMS_KEY];
      } catch (e) {
        console.error('Error parsing Terms from DB:', e);
      }
    }

    const local = localStorage.getItem(this.TERMS_KEY);
    if (local) return JSON.parse(local);

    return [
      { id: 't1', title: '01. Condiciones de Compra', text: 'MARÉ opera como una tienda catálogo online. Al realizar un pedido en nuestra plataforma, el usuario está manifestando su interés en adquirir los productos seleccionados. La transacción final, incluyendo la confirmación de stock, detalles de pago y envío, se realiza de forma personalizada a través de WhatsApp.' },
      { id: 't2', title: '02. Disponibilidad y Precios', text: 'Hacemos nuestro mejor esfuerzo por mantener el catálogo actualizado. Sin embargo, la disponibilidad real se confirmará en el momento del contacto por WhatsApp. Los precios mostrados en MN (CUP) son los precios finales del producto, excluyendo el costo de envío. Los precios en USD son informativos y calculados según la tasa de cambio vigente en el sitio.' },
      { id: 't3', title: '03. Pedidos y Envíos', text: 'Una vez enviado el pedido desde la web, nuestro equipo se pondrá en contacto en el menor tiempo posible. El envío se realizará a la dirección proporcionada o estará disponible para recogida según lo acordado. MARÉ no se hace responsable de retrasos causados por información de contacto incorrecta proporcionada por el cliente.' },
      { id: 't4', title: '04. Cambios y Devoluciones', text: 'Se aceptan cambios o devoluciones únicamente por defectos de fabricación comprobados en un plazo máximo de 48 horas tras recibir el producto. El producto debe conservar su embalaje original y etiquetas.' }
    ];
  }

  /**
   * Saves Terms to store_settings
   */
  async saveTerms(terms: Term[]): Promise<void> {
    await configService.updateStoreSettings({
      [this.TERMS_KEY]: terms
    });
    localStorage.setItem(this.TERMS_KEY, JSON.stringify(terms));
  }
}

export const contentService = new ContentService();
