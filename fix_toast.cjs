const fs = require('fs');
let content = fs.readFileSync('src/pages/Cart.tsx', 'utf8');

content = content.replace(/toast\(\{[\s]+title: 'Producto eliminado',[\s]+description: \\\`\\\$\\{nombre\\} ha sido eliminado\.\\\`,[\s]+\}\);/g, "toast({ title: 'Producto eliminado', description: `\\${nombre} ha sido eliminado.`, type: 'info' });");

fs.writeFileSync('src/pages/Cart.tsx', content);
