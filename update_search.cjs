const fs = require('fs');
const content = fs.readFileSync('src/utils/search.ts', 'utf8');
const replacement = `
// Levenshtein distance for fuzzy matching
const levenshtein = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
};

const isFuzzyMatch = (text: string, query: string, maxDistance: number = 2): boolean => {
  if (text.includes(query)) return true;
  
  const textWords = text.split(' ');
  const queryWords = query.split(' ');
  
  // If single word query, check against each word in text
  if (queryWords.length === 1) {
    return textWords.some(word => 
      word.length > 3 && query.length > 3 && 
      (levenshtein(word, query) <= maxDistance || word.includes(query) || query.includes(word))
    );
  }
  
  // For multi-word queries, at least one word should fuzzy match
  return queryWords.some(qWord => 
    qWord.length > 3 && textWords.some(tWord => 
      tWord.length > 3 && levenshtein(tWord, qWord) <= 1
    )
  );
};
`;

const updatedContent = content.replace(/export interface SearchResult/, replacement + '\nexport interface SearchResult');

const newSearchLogic = `export const searchProducts = (products: Product[], query: string): SearchResult[] => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];
  
  for (const product of products) {
    const normName = normalizeText(product.nombre);
    const normBrand = product.marca ? normalizeText(product.marca) : '';
    const normModel = product.modelo ? normalizeText(product.modelo) : '';
    const normTags = product.etiquetas ? product.etiquetas.map(normalizeText) : [];
    const normDesc = product.descripcionCorta ? normalizeText(product.descripcionCorta) : '';
    const normFullDesc = product.descripcionCompleta ? normalizeText(product.descripcionCompleta) : '';
    
    // Category mapping
    const category = categories.find(c => c.id === product.categoria);
    const normCategory = category ? normalizeText(category.nombre) : '';
    const subcategory = category?.subcategorias?.find(s => s.id === product.subcategoria);
    const normSubcategory = subcategory ? normalizeText(subcategory.nombre) : '';

    let score = 0;
    const queryWords = normalizedQuery.split(' ');

    // 1. Exact match in name
    if (normName === normalizedQuery) {
      score += 100;
    }
    // 2. Partial match in name
    else if (normName.includes(normalizedQuery)) {
      score += 50;
      if (normName.startsWith(normalizedQuery)) score += 10;
    }
    // 2.5 Fuzzy match in name
    else if (isFuzzyMatch(normName, normalizedQuery)) {
      score += 40;
    }

    // 3. Match in brand
    if (normBrand && (normBrand.includes(normalizedQuery) || isFuzzyMatch(normBrand, normalizedQuery, 1))) {
      score += 35;
    }

    // 4. Match in model
    if (normModel && normModel.includes(normalizedQuery)) {
      score += 30;
    }

    // 5. Match in category / subcategory
    if (normCategory.includes(normalizedQuery) || normSubcategory.includes(normalizedQuery) ||
        isFuzzyMatch(normCategory, normalizedQuery, 1) || isFuzzyMatch(normSubcategory, normalizedQuery, 1)) {
      score += 25;
    }

    // 6. Match in tags
    if (normTags.some(tag => tag.includes(normalizedQuery) || normalizedQuery.includes(tag) || isFuzzyMatch(tag, normalizedQuery, 1))) {
      score += 20;
    }

    // 7. Match in short description
    if (normDesc.includes(normalizedQuery) || isFuzzyMatch(normDesc, normalizedQuery, 2)) {
      score += 10;
    }
    
    // 8. Match in full description
    if (normFullDesc.includes(normalizedQuery)) {
      score += 5;
    }

    // 9. All words match somewhere
    if (queryWords.length > 1) {
        const allWordsMatch = queryWords.every(word => 
           normName.includes(word) || normBrand.includes(word) || normCategory.includes(word) || normSubcategory.includes(word) || normTags.some(t => t.includes(word))
        );
        if (allWordsMatch) score += 45;
    }

    if (score > 0) {
      results.push({ ...product, relevanceScore: score });
    }
  }

  // Sort by relevance (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
};`;

const finalContent = updatedContent.replace(/export const searchProducts = [\s\S]*?;\n\nexport const suggestCategories/, newSearchLogic + '\n\nexport const suggestCategories');

const suggestCats = `export const suggestCategories = (query: string) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];
  return categories.filter(c => normalizeText(c.nombre).includes(normalizedQuery) || isFuzzyMatch(normalizeText(c.nombre), normalizedQuery, 1));
};`;
const finalContent2 = finalContent.replace(/export const suggestCategories = [\s\S]*?};/, suggestCats);

const suggestSubCats = `export const suggestSubcategories = (query: string) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];
  const results: { categoryId: string, categoryName: string, subcategory: { id: string, nombre: string, slug: string } }[] = [];
  
  categories.forEach(cat => {
    cat.subcategorias?.forEach(sub => {
      if (normalizeText(sub.nombre).includes(normalizedQuery) || isFuzzyMatch(normalizeText(sub.nombre), normalizedQuery, 1)) {
        results.push({
          categoryId: cat.id,
          categoryName: cat.nombre,
          subcategory: sub
        });
      }
    });
  });
  return results;
};`;
const finalContent3 = finalContent2.replace(/export const suggestSubcategories = [\s\S]*?};/, suggestSubCats);

const suggestTagsLogic = `export const suggestTags = (query: string) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];
  const tags = new Set<string>();
  
  products.forEach(p => {
    p.etiquetas?.forEach(tag => {
      if (normalizeText(tag).includes(normalizedQuery) || isFuzzyMatch(normalizeText(tag), normalizedQuery, 1)) {
        tags.add(tag);
      }
    });
  });
  return Array.from(tags);
};`;
const finalContent4 = finalContent3.replace(/export const suggestTags = [\s\S]*?};/, suggestTagsLogic);

fs.writeFileSync('src/utils/search.ts', finalContent4);
