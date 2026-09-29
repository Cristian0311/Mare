import { CartItem } from '../contexts/CartContext';
import { getProductPricing, getBundlePricing } from './pricing';
import { configService } from '../services/config';

interface OrderData {
  orderId: string;
  customer: { nombre: string; telefono: string; whatsapp?: string; correo?: string };
  delivery: { metodo: string; provincia?: string; municipio?: string; direccion?: string; referencia?: string; puntoRecogida?: string };
  items: (CartItem & { selectedVariantInfo?: string })[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  currency: string;
  coupon?: { code: string; discount: number };
  observaciones?: string;
}

export function generateWhatsAppMessage(order: OrderData, formatPrice: (price: number) => string, activePromos: any[] = []): string {
  const config = configService.getConfigSync();
  const separator = '━━━━━━━━━━━━━━';
  let message = `${config.whatsapp.orderMessage}\n\n🛍️ NUEVO PEDIDO — MARÉ\n${separator}\n\n`;

  message += '👤 CLIENTE\n';
  message += `Nombre: ${order.customer.nombre}\n`;
  message += `Teléfono: ${order.customer.telefono}\n`;
  if (order.customer.whatsapp && order.customer.whatsapp !== order.customer.telefono) message += `WhatsApp: ${order.customer.whatsapp}\n`;
  if (order.customer.correo) message += `Correo: ${order.customer.correo}\n`;

  message += `\n${separator}\n\n📦 PRODUCTOS\n\n`;
  let totalSavings = 0;

  order.items.forEach((item, index) => {
    const isBundle = !!item.isBundle;
    const pricing = isBundle && item.bundle
      ? getBundlePricing(item.bundle, false)
      : getProductPricing(item as any, item.quantity, false, activePromos);
    const itemSubtotal = pricing.finalPrice * item.quantity;
    if (pricing.hasOffer && pricing.savings > 0) totalSavings += pricing.savings * item.quantity;

    message += `${index + 1}. ${item.nombre}${isBundle ? ' (COMBO)' : ''}\n`;
    message += `   Cantidad: ${item.quantity}\n`;
    if (item.selectedVariantName) message += `   Variante: ${item.selectedVariantName}\n`;
    if (isBundle && item.bundle?.items) {
      message += '   Incluye:\n';
      item.bundle.items.forEach(bundleItem => {
        message += `   • ${bundleItem.product?.nombre} (x${bundleItem.quantity * item.quantity})\n`;
      });
    }

    if (pricing.hasOffer) {
      message += `   Precio normal: ${formatPrice(pricing.originalPrice)}\n`;
      message += `   Precio oferta: ${formatPrice(pricing.finalPrice)}\n`;
      message += `   Descuento: ${formatPrice(pricing.savings)}\n`;
    } else {
      message += `   Precio: ${formatPrice(pricing.finalPrice)}\n`;
    }
    message += `   Subtotal: ${formatPrice(itemSubtotal)}\n`;
    if (index < order.items.length - 1) message += '\n';
  });

  message += `\n${separator}\n\n🚚 ENTREGA\n`;
  message += `Tipo: ${order.delivery.metodo === 'domicilio' ? 'Entrega a domicilio' : 'Recogida'}\n`;
  if (order.delivery.provincia) message += `Provincia: ${order.delivery.provincia}\n`;
  if (order.delivery.municipio) message += `Municipio: ${order.delivery.municipio}\n`;
  if (order.delivery.metodo === 'domicilio') {
    if (order.delivery.direccion) message += `Dirección: ${order.delivery.direccion}\n`;
    if (order.delivery.referencia) message += `Referencia: ${order.delivery.referencia}\n`;
  } else if (order.delivery.puntoRecogida) {
    message += `Punto: ${order.delivery.puntoRecogida}\n`;
  }
  message += `Entrega: ${order.deliveryCost > 0 ? formatPrice(order.deliveryCost) : 'Pendiente'}\n`;

  message += `\n${separator}\n\n💰 RESUMEN\n`;
  if (totalSavings > 0) {
    message += `Subtotal original: ${formatPrice(order.subtotal + totalSavings)}\n`;
    message += `Ahorro en productos: -${formatPrice(totalSavings)}\n`;
  }
  message += `Subtotal: ${formatPrice(order.subtotal)}\n`;
  if (order.coupon) message += `Cupón (${order.coupon.code}): -${formatPrice(order.coupon.discount)}\n`;
  message += `Entrega: ${order.deliveryCost > 0 ? formatPrice(order.deliveryCost) : 'Pendiente'}\n`;
  message += `TOTAL: ${formatPrice(order.total)}\n\n`;

  if (order.observaciones?.trim()) message += `${separator}\n\n📝 NOTA\n${order.observaciones}\n\n`;
  return message + `${separator}\n\nMARÉ`;
}
