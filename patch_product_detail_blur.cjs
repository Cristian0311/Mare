const fs = require('fs');
const file = 'src/pages/ProductDetail.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<input 
                  type="number"
                  value={quantity}
                  onChange={(e) => {`;

const replacement = `<input 
                  type="number"
                  value={quantity}
                  onBlur={() => {
                    if (forceWholesale && product?.ventaMayorista?.cantidadMinima && quantity < product.ventaMayorista.cantidadMinima) {
                      setQuantity(product.ventaMayorista.cantidadMinima);
                      toast({
                        type: 'info',
                        title: 'Mínimo Mayorista',
                        description: \`El mínimo de compra es \${product.ventaMayorista.cantidadMinima}.\`
                      });
                    }
                  }}
                  onChange={(e) => {`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('REPLACED_BLUR');
