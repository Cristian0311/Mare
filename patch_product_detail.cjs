const fs = require('fs');
const file = 'src/pages/ProductDetail.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'disabled={quantity <= 1 || !isAvailable}',
  'disabled={quantity <= (forceWholesale && product?.ventaMayorista?.cantidadMinima ? product.ventaMayorista.cantidadMinima : 1) || !isAvailable}'
);

fs.writeFileSync(file, content);
console.log('REPLACED');
