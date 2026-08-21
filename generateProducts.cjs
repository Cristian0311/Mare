const fs = require('fs');

const categories = [
  { id: '1', sub: ['1-1', '1-2', '1-3', '1-5'] },
  { id: '2', sub: ['2-1', '2-2', '2-4'] },
  { id: '3', sub: ['3-1', '3-2', '3-3'] },
  { id: '4', sub: ['4-1', '4-2', '4-6'] },
  { id: '5', sub: ['5-1', '5-2', '5-3'] },
  { id: '6', sub: ['6-1', '6-2', '6-4'] },
  { id: '7', sub: ['7-1', '7-2', '7-3'] },
  { id: '8', sub: ['8-1', '8-2', '8-3'] },
  { id: '9', sub: ['9-1', '9-2'] },
  { id: '10', sub: ['10-1', '10-2', '10-4'] },
  { id: '11', sub: ['11-1', '11-2'] },
  { id: '12', sub: ['12-1', '12-2'] },
  { id: '13', sub: ['13-1', '13-2'] },
  { id: '14', sub: ['14-1', '14-2'] },
  { id: '15', sub: ['15-1', '15-2'] },
];

const tagsPool = ['nuevo', 'oferta', 'destacado', 'mas-vendido', 'exclusivo', 'recomendado', 'importado'];
const dispPool = ['disponible', 'disponible', 'disponible', 'pocas-unidades', 'agotado'];

const products = [];

for (let i = 1; i <= 100; i++) {
  const cat = categories[i % categories.length];
  const subcat = cat.sub[i % cat.sub.length];
  
  const isOffer = i % 5 === 0;
  const precioMN = 1000 + (i * 150);
  const precioAnteriorMN = isOffer ? precioMN + 500 : undefined;
  
  const tags = [];
  if (isOffer) tags.push('oferta');
  if (i % 7 === 0) tags.push('nuevo');
  if (i % 11 === 0) tags.push('destacado');
  if (i % 13 === 0) tags.push('mas-vendido');
  
  const disp = dispPool[i % dispPool.length];
  
  products.push({
    id: `PROD-${i.toString().padStart(3, '0')}`,
    slug: `producto-demo-${i}`,
    nombre: `Producto de Demostración ${i}`,
    precioMN,
    precioAnteriorMN,
    imagenes: [`https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+${i}`],
    descripcionCorta: `Breve descripción del producto ${i} para catálogos y listados.`,
    descripcionCompleta: `Esta es la descripción completa del producto ${i}. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.`,
    caracteristicas: ['Característica A', 'Característica B', 'Garantía 3 meses'],
    categoria: cat.id,
    subcategoria: subcat,
    etiquetas: tags,
    estado: 'nuevo',
    disponibilidad: disp,
    nuevo: tags.includes('nuevo'),
    oferta: isOffer,
    destacado: tags.includes('destacado'),
    masVendido: tags.includes('mas-vendido'),
    fechaCreacion: new Date(Date.now() - i * 10000000).toISOString(),
    orden: i
  });
}

// Write the file
const fileContent = `import { Product } from '../types';

export const products: Product[] = ${JSON.stringify(products, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('src/data/products.ts', fileContent);
