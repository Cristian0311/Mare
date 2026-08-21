import { Product } from '../types';
import { getProductPricing } from './pricing';
import { productService } from '../services/products';

export const getFeaturedProducts = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const activeProducts = products.filter(p => p.activo !== false);

  const sorted = [...activeProducts].sort((a, b) => {
    // 1. Explicitly marked as featured in Supabase / admin
    if (a.destacado && !b.destacado) return -1;
    if (!a.destacado && b.destacado) return 1;

    // 2. High views / popularity
    const viewsA = a.views_count ?? (typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem(`mare_simulated_views_${a.id}`) || '0') : 0);
    const viewsB = b.views_count ?? (typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem(`mare_simulated_views_${b.id}`) || '0') : 0);
    if (viewsB !== viewsA) {
      return viewsB - viewsA;
    }

    // 3. Diversified sequence by category to prevent duplicate ordering
    const catA = a.categoria || '';
    const catB = b.categoria || '';
    if (catA !== catB) {
      return catA.localeCompare(catB);
    }

    return a.orden - b.orden;
  });

  return limit ? sorted.slice(0, limit) : sorted.slice(0, 10);
};

export const getOffers = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const activeProducts = products.filter(p => p.activo !== false);
  const offers = activeProducts
    .filter(p => getProductPricing(p).hasOffer)
    .sort((a, b) => {
      const pricingA = getProductPricing(a);
      const pricingB = getProductPricing(b);
      if (pricingB.discountPercentage !== pricingA.discountPercentage) {
        return pricingB.discountPercentage - pricingA.discountPercentage;
      }
      return a.orden - b.orden;
    });
  return limit ? offers.slice(0, limit) : offers;
};

export const getNewProducts = (limit?: number): Product[] => {
  const products = productService.getProductsSync();
  const activeProducts = products.filter(p => p.activo !== false);
  const news = [...activeProducts]
    .sort((a, b) => {
      if (a.nuevo && !b.nuevo) return -1;
      if (!a.nuevo && b.nuevo) return 1;
      const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
      const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;
      return b.orden - a.orden;
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
