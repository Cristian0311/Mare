const fs = require('fs');

let content = fs.readFileSync('src/admin/pages/AdminProducts.tsx', 'utf8');

content = content.replace(
  /const loadProducts = async \(\) => \{\n    setIsLoading\(true\);\n    try \{\n      const data = await productService\.getProducts\(\);\n      setProducts\(data\);\n    \} catch \(err\) \{\n      error\('Error', 'No se pudieron cargar los productos'\);\n    \}\n    setIsLoading\(false\);\n  \};/,
  `const loadProducts = async () => {\n    setIsLoading(true);\n    try {\n      const data = await productService.getAllProducts();\n      setProducts(data);\n    } catch (err) {\n      error('Error', 'No se pudieron cargar los productos');\n    }\n    setIsLoading(false);\n  };`
);

content = content.replace(
  /const handleDelete = \(product: Product\) => \{[\s\S]*?\};\n\n  const toggleStatus = \(product: Product\) => \{[\s\S]*?\};\n/,
  `const handleDelete = async (product: Product) => {
    if (window.confirm(\`¿Estás seguro de que deseas eliminar el producto: \${product.nombre}?\`)) {
      await productService.deleteProduct(product.id);
      loadProducts();
      success('Eliminado', 'El producto ha sido eliminado');
    }
  };

  const toggleStatus = async (product: Product) => {
    if (window.confirm(\`¿Deseas cambiar el estado de \${product.nombre}?\`)) {
      const isCurrentlyActive = product.activo !== false;
      await productService.toggleProductStatus(product.id, !isCurrentlyActive);
      loadProducts();
      success('Actualizado', 'El estado del producto ha sido actualizado');
    }
  };\n`
);

content = content.replace(
  /product\.disponibilidad === 'agotado' \? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'/,
  "product.activo !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
);

content = content.replace(
  /product\.disponibilidad === 'agotado' \? \([\s\S]*?\) : \([\s\S]*?\)/,
  `product.activo !== false ? (
    <><CheckCircle size={12} className="mr-1" /> Activo</>
  ) : (
    <><XCircle size={12} className="mr-1" /> Inactivo</>
  )`
);

fs.writeFileSync('src/admin/pages/AdminProducts.tsx', content);
