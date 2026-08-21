import { Product } from '../types';
import { getProductPricing } from './pricing';
import { productService } from '../services/products';

export const getFeaturedProducts = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const activeProducts = products.filter(p => p.activo !== false);

  const sorted = activeProducts.sort((a, b) => {
    // Prioridad Automática: Vistas
    const getViews = (p: Product) => p.views_count ?? parseInt(localStorage.getItem(`mare_simulated_views_${p.id}`) || '0');
    const viewsA = getViews(a);
    const viewsB = getViews(b);

    return viewsB - viewsA;
  });

  return limit ? sorted.slice(0, limit) : sorted.slice(0, 8); // Top 8 by default
};

export const getOffers = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const offers = products.filter(p => getProductPricing(p).hasOffer).sort((a, b) => a.orden - b.orden);
  return limit ? offers.slice(0, limit) : offers;
};

export const getNewProducts = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const news = products
    .filter(p => p.nuevo)
    .sort((a, b) => {
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    });
  return limit ? news.slice(0, limit) : news;
};

export const getBestSellers = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const bestSellers = products
    .filter(p => p.masVendido)
    .sort((a, b) => a.orden - b.orden);
  return limit ? bestSellers.slice(0, limit) : bestSellers;
};

export const getWholesaleProducts = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const wholesale = products.filter(p => p.ventaMayorista?.habilitada).sort((a, b) => a.orden - b.orden);
  return limit ? wholesale.slice(0, limit) : wholesale;
};


export const getProductsByCategory = (categoryId: string, limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const categoryProducts = products
    .filter(p => p.categoria === categoryId)
    .sort((a, b) => a.orden - b.orden);
  return limit ? categoryProducts.slice(0, limit) : categoryProducts;
};

export const getProductBySlug = (slug: string): Product | undefined => {
  const products = productService.getProductsSync();
  return products.find(p => p.slug === slug);
};

export const getProductsByTag = (tag: string, limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const tagged = products
    .filter(p => p.etiquetas.includes(tag))
    .sort((a, b) => a.orden - b.orden);
  return limit ? tagged.slice(0, limit) : tagged;
};

export const getProductsByIds = (ids: string[]): Product[] => {
  if (ids.length === 0) return [];
  const products = productService.getProductsSync();
  const idSet = new Set(ids);
  return products.filter(p => idSet.has(p.id));
};

export const getAllPublicProducts = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  // Incluimos todos los productos activos sin filtrar por tipo para el catálogo completo
  const publicProducts = products
    .sort((a, b) => a.orden - b.orden);
  return limit ? publicProducts.slice(0, limit) : publicProducts;
};
