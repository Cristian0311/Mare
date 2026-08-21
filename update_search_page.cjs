const fs = require('fs');
const content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

const updatedContent = content
  .replace(/const baseResults = useMemo\(\(\) => \{[\s\S]*?\}, \[query\]\);/, 
`const baseResults = useMemo(() => {
    return query ? searchProducts(products, query) : [];
  }, [query]);`);

fs.writeFileSync('src/pages/Search.tsx', updatedContent);
