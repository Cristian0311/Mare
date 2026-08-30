const fs = require('fs');

const cartFile = 'src/pages/Cart.tsx';
let cartContent = fs.readFileSync(cartFile, 'utf8');
cartContent = cartContent.replace(
  'const price = isWholesale ? item.ventaMayorista!.precioMN : pricing.finalPrice;',
  'const price = pricing.finalPrice;'
);
fs.writeFileSync(cartFile, cartContent);

const checkoutFile = 'src/pages/Checkout.tsx';
let checkoutContent = fs.readFileSync(checkoutFile, 'utf8');
checkoutContent = checkoutContent.replace(
  'item.ventaMayorista!.precioMN : pricing.finalPrice',
  'pricing.finalPrice'
);
fs.writeFileSync(checkoutFile, checkoutContent);

console.log('REPLACED_PRICING');
