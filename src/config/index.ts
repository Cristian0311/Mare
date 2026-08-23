import { storeConfig } from './store';
import { currencyConfig } from './currency';

// Estructura conceptual de configuración general (Preparada para el futuro panel de administración)
export const appConfig = {
  // --- Mantenemos compatibilidad con usos anteriores ---
  tiendaNombre: 'MARÉ',
  eslogan: 'TODO LO QUE BUSCAS',
  whatsappNumber: storeConfig.whatsappNumber,
  monedaBase: currencyConfig.baseCurrency,
  // -----------------------------------------------------

  store: {
    name: 'MARÉ',
    slogan: 'Todo lo que buscas',
    logo: '/icon.svg',
    contact: {
      phone: storeConfig.whatsappNumber,
      email: 'contacto@mare.cu',
      socials: {
        instagram: 'https://instagram.com/mare',
        facebook: 'https://facebook.com/mare'
      }
    }
  },
  currency: {
    base: currencyConfig.baseCurrency,
    exchangeRateUSD: currencyConfig.exchangeRateUSD,
    default: currencyConfig.defaultCurrency
  },
  maintenance: {
    enabled: false,
    title: 'Estamos en Mantenimiento',
    message: 'MARÉ se está actualizando para ofrecerte una mejor experiencia. Volveremos muy pronto.',
    image: '/icon.svg',
    estimatedTime: '2 horas'
  },
  whatsapp: {
    mainNumber: storeConfig.whatsappNumber,
    generalNumber: storeConfig.whatsappNumber,
    defaultMessage: 'Hola MARÉ, me interesa este producto:',
    orderMessage: 'Hola MARÉ, quiero confirmar mi pedido:',
    reservationMessage: 'Hola MARÉ, quiero hacer una reserva:',
    wholesaleMessage: 'Hola MARÉ, quiero hacer un pedido mayorista:',
    templates: {
      retail: 'Hola, mi pedido en MARÉ es:\n\n{productos}\n\n*Total:* {total}\n*Entrega:* {provincia}, {municipio}\n*Asesor:* {asesor}',
      wholesale: 'Hola MARÉ, quiero hacer un pedido mayorista:\n\n{productos}\n\n*Total:* {total}',
      reservation: 'Hola MARÉ, quiero reservar:\n\n{productos}\n\n*Adelanto (30%):* {adelanto}\n*Restante (70%):* {restante}'
    }
  },
  advisors: [
    {
      id: 'emily',
      name: 'Emily Suárez',
      gender: 'F',
      role: 'Asesora de Ventas',
      whatsapp: storeConfig.advisors[0].whatsapp,
      avatar: storeConfig.advisors[0].avatar,
      active: true
    },
    {
      id: 'cristian',
      name: 'Cristian Marco',
      gender: 'M',
      role: 'Asesor de Ventas',
      whatsapp: storeConfig.advisors[1].whatsapp,
      avatar: storeConfig.advisors[1].avatar,
      active: true
    }
  ],
  delivery: {
    enabled: true,
    defaultCostMN: 500, // Costo base si no se especifica
    freeDeliveryThresholdMN: null, // null significa que no hay envío gratis por defecto
    pickupLocations: [
      { id: '1', name: 'Sede Central - La Habana', address: 'Calle 23 #456 e/ H e I, Vedado, La Habana', schedule: 'Lunes a Viernes (9:00 AM - 5:00 PM)', active: true },
      { id: '2', name: 'Almacén 1 - Plaza de la Revolución', address: 'Ave. Paseo #102, Plaza de la Revolución, La Habana', schedule: 'Lunes a Sábado (10:00 AM - 6:00 PM)', active: true },
      { id: '3', name: 'Punto de Recogida - Playa', address: 'Calle 5ta Ave #3002, Playa, La Habana', schedule: 'Lunes a Viernes (11:00 AM - 4:00 PM)', active: true }
    ]
  },
  wholesale: {
    enabled: true,
    minOrderAmountMN: 0
  },
  reservation: {
    enabled: true,
    defaultAdvancePercentage: 30
  },
  seo: {
    defaultTitle: 'MARÉ - Todo lo que buscas',
    defaultDescription: 'Tu tienda oficial MARÉ. Encuentra ofertas, categorías y los mejores productos.',
    defaultImage: '/icon.svg',
    keywords: 'tienda, cuba, compras, mare'
  },
  features: {
    favorites: true,
    share: true,
    pwa: true,
    usdConversion: true
  }
};
