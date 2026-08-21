const fs = require('fs');
const content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

const updatedContent = content.replace(
  /<h2 className="text-xl font-bold text-mare-navy mb-3">[\s\S]*?No encontramos productos relacionados con tu búsqueda.[\s\S]*?<\/h2>[\s\S]*?<p className="text-gray-500 mb-8 max-w-md mx-auto">[\s\S]*?Revisa si hay algún error de escritura o intenta usar palabras más generales para encontrar lo que buscas.[\s\S]*?<\/p>/,
  `{query ? (
    <>
      <h2 className="text-xl font-bold text-mare-navy mb-3">No encontramos productos relacionados con tu búsqueda.</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">Revisa si hay algún error de escritura o intenta usar palabras más generales para encontrar lo que buscas.</p>
    </>
  ) : (
    <>
      <h2 className="text-xl font-bold text-mare-navy mb-3">¿Qué estás buscando?</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">Explora nuestro catálogo utilizando el buscador, o navega por nuestras categorías.</p>
    </>
  )}`
);

fs.writeFileSync('src/pages/Search.tsx', updatedContent);
