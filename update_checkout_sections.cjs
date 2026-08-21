const fs = require('fs');

function updateFile(path, oldTitleRegex, newTitle) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(oldTitleRegex, newTitle);
  fs.writeFileSync(path, content);
}

updateFile(
  'src/components/checkout/DeliveryOptions.tsx',
  /<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">.*?<\/h2>/,
  '<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">04 — ENTREGA</h2>'
);

updateFile(
  'src/components/checkout/AddressSelector.tsx',
  /<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">[\s\S]*?<\/h2>/,
  '<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">03 — UBICACIÓN</h2>'
);

let checkoutContent = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');
checkoutContent = checkoutContent.replace(
  /<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">Tus productos<\/h2>/,
  '<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">01 — PRODUCTOS</h2>'
);
checkoutContent = checkoutContent.replace(
  /<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">Observaciones \(Opcional\)<\/h2>/,
  '<h2 className="text-sm font-black text-mare-navy uppercase tracking-tight">05 — OBSERVACIONES</h2>'
);
checkoutContent = checkoutContent.replace(
  /<h2 className="text-lg font-black text-mare-navy mb-1 tracking-tight">¿Todo está correcto\?<\/h2>/,
  '<h2 className="text-lg font-black text-mare-navy mb-1 tracking-tight">06 — CONFIRMACIÓN</h2>'
);
fs.writeFileSync('src/pages/Checkout.tsx', checkoutContent);

