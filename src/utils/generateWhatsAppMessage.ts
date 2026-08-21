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

  const hasWholesale = order.items.some(item => item.isWholesale);
  const hasRetail = order.items.some(item => !item.isWholesale);

  let title = "🛍️ NUEVO PEDIDO — MARÉ";
  let templateMessage = config.whatsapp.orderMessage;

  if (hasWholesale && !hasRetail) {
    title = "📦 PEDIDO MAYORISTA — MARÉ";
    templateMessage = config.whatsapp.wholesaleMessage;
  }

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
  
  const modalities = [
    { key: 'retail', title: '🛍️ COMPRA NORMAL', filter: (item: any) => !item.isWholesale },
    { key: 'wholesale', title: '📦 MAYORISTA', filter: (item: any) => !!item.isWholesale }
  ];

  modalities.forEach((modality, modIndex) => {
    const items = order.items.filter(modality.filter);
    if (items.length === 0) return;

    message += `${modality.title}\n`;
    message += `----------\n`;

    items.forEach((item, index) => {
      let isWholesale = !!(item.isWholesale && item.ventaMayorista);
      let isBundle = item.isBundle;

      const pricing = isBundle && item.bundle 
        ? getBundlePricing(item.bundle, isWholesale)
        : getProductPricing(item as any, item.quantity, isWholesale, activePromos);

      const unitPrice = pricing.finalPrice;
      const unitsPerPresentacion = isWholesale ? item.ventaMayorista?.unidadesPorPresentacion || 1 : 1;
      
      const totalUnits = item.quantity * unitsPerPresentacion;
      const itemSubtotal = unitPrice * totalUnits;
      
      if (!isWholesale && pricing.hasOffer && pricing.savings > 0) {
        totalSavings += pricing.savings * item.quantity;
      }
      
      message += `${index + 1}. ${item.nombre}${isBundle ? ' (COMBO)' : ''}\n`;
      message += `   Cantidad: ${item.quantity}${isWholesale && !isBundle ? ` ${item.ventaMayorista!.presentacion === 'Unidad' ? 'unidades' : item.ventaMayorista!.presentacion.toLowerCase() + 's'}` : ''}\n`;
      
      if (isBundle && item.bundle?.items) {
        message += `   Incluye:\n`;
        item.bundle.items.forEach(bundleItem => {
          message += `   • ${bundleItem.product?.nombre} (x${bundleItem.quantity * item.quantity})\n`;
        });
      }

      if (isWholesale && unitsPerPresentacion > 1 && !isBundle) {
        message += `   Contenido: ${unitsPerPresentacion} unidades por ${item.ventaMayorista!.presentacion.toLowerCase()} (${totalUnits} unidades totales)\n`;
      }
      
      if (item.selectedVariantName) {
        message += `   Variante: ${item.selectedVariantName}\n`;
      }

      if (isWholesale) {
        const retailPrice = pricing.originalPrice; // pricing.originalPrice is the price before wholesale or promos
        const savingsPerUnit = Math.max(0, retailPrice - unitPrice);

        message += `   Precio mayorista: ${formatPrice(unitPrice)} (por unidad)\n`;
        
        if (savingsPerUnit > 0) {
          message += `   Ahorro por unidad: ${formatPrice(savingsPerUnit)}\n`;
          if (unitsPerPresentacion > 1) {
            message += `   Ahorro por ${item.ventaMayorista!.presentacion.toLowerCase()}: ${formatPrice(savingsPerUnit * unitsPerPresentacion)}\n`;
          }
        }
      } else if (pricing.hasOffer) {
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
    });
    message += `\n`;
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
