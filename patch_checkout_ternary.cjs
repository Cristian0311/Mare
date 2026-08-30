const fs = require('fs');
const file = 'src/pages/Checkout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{`${formatPrice(isWholesale ? pricing.finalPrice)} u`}',
  '{`${formatPrice(pricing.finalPrice)} u`}'
);
fs.writeFileSync(file, content);
console.log('FIXED_TERNARY');
