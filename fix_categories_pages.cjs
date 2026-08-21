const fs = require('fs');

let content = fs.readFileSync('src/pages/Categories.tsx', 'utf8');

// Replace import
content = content.replace(
  "import { categories } from '../data/categories';",
  "import { categoryService } from '../services/categories';\nimport { useState, useEffect } from 'react';"
);

// Add state hook
content = content.replace(
  "export function Categories() {",
  "export function Categories() {\n  const [categories, setCategories] = useState(categoryService.getCategoriesSync());\n  useEffect(() => {\n    const handleUpdate = () => setCategories(categoryService.getCategoriesSync());\n    window.addEventListener('mare_categories_updated', handleUpdate);\n    return () => window.removeEventListener('mare_categories_updated', handleUpdate);\n  }, []);"
);

fs.writeFileSync('src/pages/Categories.tsx', content);

let contentDetail = fs.readFileSync('src/pages/CategoryDetail.tsx', 'utf8');

contentDetail = contentDetail.replace(
  "import { categories } from '../data/categories';",
  "import { categoryService } from '../services/categories';\nimport { useState, useEffect } from 'react';"
);

contentDetail = contentDetail.replace(
  "export function CategoryDetail() {",
  "export function CategoryDetail() {\n  const [categories, setCategories] = useState(categoryService.getCategoriesSync());\n  useEffect(() => {\n    const handleUpdate = () => setCategories(categoryService.getCategoriesSync());\n    window.addEventListener('mare_categories_updated', handleUpdate);\n    return () => window.removeEventListener('mare_categories_updated', handleUpdate);\n  }, []);"
);

fs.writeFileSync('src/pages/CategoryDetail.tsx', contentDetail);
