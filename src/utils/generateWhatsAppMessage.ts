import { CartItem } from '../contexts/CartContext';
import { getProductPricing, getBundlePricing } from './pricing';
import { configService } from '../services/config';

interface OrderData {
  orderId: string;
  customer: {
    nombre: string;
    telefono: string;
    whatsapp?: string;
    correo?: string;
  };
  delivery: {
    metodo: string;
    provincia?: string;
    municipio?: string;
    direccion?: string;
    referencia?: string;
    puntoRecogida?: string;
  };
  items: (CartItem & { selectedVariantInfo?: string })[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  currency: string;
  coupon?: {
    code: string;
    discount: number;
  };
  observaciones?: string;
}

export function generateWhatsAppMessage(
  order: OrderData, 
  formatPrice: (price: number) => string,
  activePromos: any[] = []
): string {
  const config = configService.getConfigSync();
  const separator = "━━━━━━━━━━━━━━";

  const templateMessage = config.whatsapp.orderMessage;
  let message = `${templateMessage}\n\n`;
  message += `${title}\n`;
  message += `${separator}\n\n`;

  // Cliente
  message += `👤 CLIENTE\n`;
  message += `Nombre: ${order.customer.nombre}\n`;
  message += `Teléfono: ${order.customer.telefono}\n`;
  if (order.customer.whatsapp && order.customer.whatsapp !== order.customer.telefono) {
    message += `WhatsApp: ${order.customer.whatsapp}\n`;
  }
  if (order.customer.correo) {
    message += `Correo: ${order.customer.correo}\n`;
  }

  message += `\n${separator}\n\n`;

  // Productos
  message += `📦 PRODUCTOS\n\n`;

  let totalSavings = 0;
  
  const items = order.items;
  items.forEach((item, index) => {
    items.forEach((item, index) => {
      const itemSubtotal = unitPrice * item.quantity;
      
      if (pricing.hasOffer) {
        message += `   Precio normal: ${formatPrice(pricing.originalPrice)}\n`;
        message += `   Precio oferta: ${formatPrice(unitPrice)}\n`;
        message += `   Descuento: ${formatPrice(pricing.savings)}\n`;
      } else {
        message += `   Precio: ${formatPrice(unitPrice)}\n`;
      }

      message += `   Subtotal: ${formatPrice(itemSubtotal)}\n`;
      
      if (index < items.length - 1) {
        message += `\n`;
      }
    }
  });

  message += `${separator}\n\n`;

  // Entrega
  message += `🚚 ENTREGA\n`;
  message += `Tipo: ${order.delivery.metodo === 'domicilio' ? 'Entrega a domicilio' : 'Recogida'}\n`;
  if (order.delivery.provincia) message += `Provincia: ${order.delivery.provincia}\n`;
  if (order.delivery.municipio) message += `Municipio: ${order.delivery.municipio}\n`;
  
  if (order.delivery.metodo === 'domicilio') {
    if (order.delivery.direccion) message += `Dirección: ${order.delivery.direccion}\n`;
    if (order.delivery.referencia) message += `Referencia: ${order.delivery.referencia}\n`;
  } else {
    if (order.delivery.puntoRecogida) {
      const punto = order.delivery.puntoRecogida === 'pendiente' ? 'Pendiente' : order.delivery.puntoRecogida;
      message += `Punto: ${punto}\n`;
    }
  }

  message += `Entrega: ${order.deliveryCost > 0 ? formatPrice(order.deliveryCost) : 'Pendiente'}\n`;
  message += `\n${separator}\n\n`;

  // Resumen
  message += `💰 RESUMEN\n`;
  
  if (totalSavings > 0) {
    message += `Subtotal original: ${formatPrice(order.subtotal + totalSavings)}\n`;
    message += `Ahorro en productos: -${formatPrice(totalSavings)}\n`;
  }
  
  message += `Subtotal: ${formatPrice(order.subtotal)}\n`;

  if (order.coupon) {
    message += `Cupón (${order.coupon.code}): -${formatPrice(order.coupon.discount)}\n`;
  }

  message += `Entrega: ${order.deliveryCost > 0 ? formatPrice(order.deliveryCost) : 'Pendiente'}\n`;



  message += `TOTAL: ${formatPrice(order.total)}\n\n`;



  if (order.observaciones && order.observaciones.trim()) {
    message += `${separator}\n\n`;
    message += `📝 NOTA\n${order.observaciones}\n\n`;
  }

  message += `${separator}\n\n`;
  message += `MARÉ`;

  return message;
}
