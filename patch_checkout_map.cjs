const fs = require('fs');
const file = 'src/pages/Checkout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `            units_per_presentation: item.isWholesale && item.ventaMayorista 
              ? (item.ventaMayorista.unidadesPorPresentacion || 1) 
              : 1
          }))`,
  `            units_per_presentation: item.isWholesale && item.ventaMayorista 
              ? (item.ventaMayorista.unidadesPorPresentacion || 1) 
              : 1
          };
          })`
);
fs.writeFileSync(file, content);
console.log('FIXED_MAP');
