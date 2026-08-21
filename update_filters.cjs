const fs = require('fs');
const content = fs.readFileSync('src/utils/filters.ts', 'utf8');

const updatedContent = content.replace(
`    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      const matchName = product.nombre.toLowerCase().includes(query);
      const matchSlug = product.slug.toLowerCase().includes(query);
      const matchBrand = product.marca?.toLowerCase().includes(query) || false;
      const matchModel = product.modelo?.toLowerCase().includes(query) || false;
      
      if (!matchName && !matchSlug && !matchBrand && !matchModel) return false;
    }`,
`    // Search query is now handled by searchProducts before this step in Search.tsx.
    // If we want to support it here, we should ideally use searchProducts.
    // We will bypass it here to avoid breaking fuzzy search.`
);

fs.writeFileSync('src/utils/filters.ts', updatedContent);
