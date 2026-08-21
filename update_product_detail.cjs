const fs = require('fs');
const content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

const relatedProductsReplace = `
      {/* Categorías Relacionadas */}
      {category && (
        <div className="mt-12 mb-8">
          <h2 className="text-[10px] font-black text-mare-navy uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="w-1.5 h-3 bg-mare-gold rounded-full"></div>
            Explorar Categorías
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link to={\`/categoria/\${category.slug}\`} className="px-4 py-2 bg-gray-50 hover:bg-mare-green hover:text-white text-mare-navy rounded-xl text-xs font-bold transition-colors">
              {category.nombre}
            </Link>
            {category.subcategorias?.map(sub => (
               <Link key={sub.id} to={\`/categoria/\${category.slug}/\${sub.slug}\`} className="px-4 py-2 bg-gray-50 hover:bg-mare-green hover:text-white text-mare-navy rounded-xl text-xs font-bold transition-colors">
                 {sub.nombre}
               </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos Relacionados - Espaciado Ajustado */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-black text-mare-navy tracking-tight mb-6">También puede interesarte</h2>
          <ProductGrid>
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </div>
      )}
`;

const updatedContent = content.replace(
  /\{\/\* Productos Relacionados \- Espaciado Ajustado \*\/\}[\s\S]*?\{\/\* Barra Inferior Fija Móvil \- Más Compacta \*\/\}/,
  relatedProductsReplace + '\n      {/* Barra Inferior Fija Móvil - Más Compacta */}'
);

fs.writeFileSync('src/pages/ProductDetail.tsx', updatedContent);
