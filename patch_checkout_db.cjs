const fs = require('fs');

const checkoutFile = 'src/pages/Checkout.tsx';
let content = fs.readFileSync(checkoutFile, 'utf8');

// The DB payload is:
// items: orderInfo.items.map((item: any) => ({
//   product_id: item.id,
//   product_name: item.nombre,
//   unit_price_cup: item.precioBaseMN || item.precioMN,
//   quantity: item.quantity,
//   subtotal_cup: (item.precioBaseMN || item.precioMN) * item.quantity,

const targetPayload = `items: orderInfo.items.map((item: any) => ({
            product_id: item.id,
            product_name: item.nombre,
            unit_price_cup: item.precioBaseMN || item.precioMN,
            quantity: item.quantity,
            subtotal_cup: (item.precioBaseMN || item.precioMN) * item.quantity,`;

const replacementPayload = `items: orderInfo.items.map((item: any) => {
            const pricing = getProductPricing(item, item.quantity, !!(item.isWholesale && item.ventaMayorista));
            const unitsPerPresentacion = item.isWholesale && item.ventaMayorista ? (item.ventaMayorista.presentacion === 'Unidad' ? 1 : (item.ventaMayorista.unidadesPorPresentacion || 1)) : 1;
            return {
            product_id: item.id,
            product_name: item.nombre,
            unit_price_cup: pricing.finalPrice,
            quantity: item.quantity,
            subtotal_cup: pricing.finalPrice * item.quantity * unitsPerPresentacion,`;

content = content.replace(targetPayload, replacementPayload);

fs.writeFileSync(checkoutFile, content);
console.log('REPLACED_CHECKOUT_DB');
