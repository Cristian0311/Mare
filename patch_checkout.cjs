const fs = require('fs');

let file = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

// Añadir orderService
if (!file.includes('import { orderService }')) {
  file = file.replace("import { locationService } from \"../services/locations\";", "import { locationService } from \"../services/locations\";\nimport { orderService } from \"../services/orders\";");
}

const handleAdvisorSelectOld = `const handleAdvisorSelect = (advisor: any) => {
    if (!preparedOrderInfo) return;

    const { message } = preparedOrderInfo;
    const whatsappUrl = \`https://wa.me/\${advisor.whatsapp}?text=\${encodeURIComponent(message)}\`;

    // Abrir WhatsApp y navegar a éxito
    window.open(whatsappUrl, '_blank');
    navigate('/pedido-completado');
    setAdvisorSelectorOpen(false);
  };`;

const handleAdvisorSelectNew = `const handleAdvisorSelect = async (advisor: any) => {
    if (!preparedOrderInfo) return;

    try {
      setIsSubmitting(true);
      const { orderInfo, message } = preparedOrderInfo;
      
      // Intentar guardar en base de datos
      try {
        let orderType = 'retail';
        if (orderInfo.items.some((i: any) => i.isReservable)) {
          orderType = 'reservation';
        } else if (orderInfo.items.some((i: any) => i.esMayorista)) {
          orderType = 'wholesale';
        }
        
        await orderService.createOrder({
          order_number: orderInfo.orderId,
          order_type: orderType as any,
          customer_data: {
            nombre: orderInfo.customer.nombre,
            telefono: orderInfo.customer.telefono,
            whatsapp: orderInfo.customer.whatsapp,
            correo: orderInfo.customer.correo
          },
          advisor_id: advisor.id,
          subtotal_cup: orderInfo.subtotal,
          delivery_fee_cup: orderInfo.deliveryCost,
          total_cup: orderInfo.total,
          province_id: selectedProvince?.id,
          municipality_id: undefined, // Requires lookup or passing id
          address: orderInfo.delivery.direccion,
          customer_notes: orderInfo.observaciones,
          items: orderInfo.items.map((item: any) => ({
            product_id: item.id,
            product_name: item.nombre,
            unit_price_cup: item.precioBaseMN || item.precioMN,
            quantity: item.cantidad,
            subtotal_cup: (item.precioBaseMN || item.precioMN) * item.cantidad
          }))
        });
      } catch (dbError) {
        console.error("Failed to save order to DB:", dbError);
        // Continuar con WhatsApp incluso si falla la DB
      }

      const whatsappUrl = \`https://wa.me/\${advisor.whatsapp}?text=\${encodeURIComponent(message)}\`;

      // Abrir WhatsApp y navegar a éxito
      window.open(whatsappUrl, '_blank');
      navigate('/pedido-completado');
      setAdvisorSelectorOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };`;

file = file.replace(handleAdvisorSelectOld, handleAdvisorSelectNew);

fs.writeFileSync('src/pages/Checkout.tsx', file);
