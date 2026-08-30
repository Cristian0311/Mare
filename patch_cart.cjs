const fs = require('fs');
const file = 'src/pages/Cart.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'disabled={item.quantity <= 1 || !isItemAvailable}',
  'disabled={item.quantity <= (item.precioMN === 0 && item.ventaMayorista?.cantidadMinima ? item.ventaMayorista.cantidadMinima : 1) || !isItemAvailable}'
);

fs.writeFileSync(file, content);
console.log('REPLACED');
