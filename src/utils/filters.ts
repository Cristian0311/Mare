import { Product, ProductAvailability } from '../types';
import { getProductPricing } from './pricing';

export interface FilterOptions {
  categoryId?: string;
  subcategoryId?: string;
  tags?: string[];
  brands?: string[];
  estado?: ('nuevo' | 'oferta' | 'destacado' | 'masVendido' | 'exclusivo' | 'liquidacion')[];
  disponibilidad?: ProductAvailability[];
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export const filterProducts = (products: Product[], options: FilterOptions): Product[] => {
  return products.filter(product => {
    if (options.categoryId && product.categoria !== options.categoryId) return false;
    
    if (options.subcategoryId && product.subcategoria !== options.subcategoryId) return false;
    
    if (options.tags && options.tags.length > 0) {
      const hasAllTags = options.tags.every(tag => product.etiquetas.includes(tag));
      if (!hasAllTags) return false;
    }

    if (options.brands && options.brands.length > 0) {
      if (!product.marca || !options.brands.includes(product.marca)) return false;
    }
    
    if (options.estado && options.estado.length > 0) {
      const isNuevo = options.estado.includes('nuevo') && product.nuevo;
      const isOferta = options.estado.includes('oferta') && getProductPricing(product).hasOffer;
      const isDestacado = options.estado.includes('destacado') && product.destacado;
      const isMasVendido = options.estado.includes('masVendido') && product.masVendido;
      const isExclusivo = options.estado.includes('exclusivo') && product.etiquetas.includes('Exclusivo');
      const isLiquidacion = options.estado.includes('liquidacion') && product.etiquetas.includes('Liquidación');
      
      // If none of the selected state flags match this product, exclude it
      if (!(isNuevo || isOferta || isDestacado || isMasVendido || isExclusivo || isLiquidacion)) {
        return false;
      }
    }
    
    if (options.disponibilidad && options.disponibilidad.length > 0) {
      if (!options.disponibilidad.includes(product.disponibilidad)) return false;
    }
    
    const finalPrice = getProductPricing(product).finalPrice;
    if (options.minPrice !== undefined && finalPrice < options.minPrice) return false;
    if (options.maxPrice !== undefined && finalPrice > options.maxPrice) return false;
    
    // Search query is now handled by searchProducts before this step in Search.tsx.
    // If we want to support it here, we should ideally use searchProducts.
    // We will bypass it here to avoid breaking fuzzy search.
    
    return true;
  });
};

export type SortOption = 'recommended' | 'date-desc' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'best-sellers' | 'featured' | 'offers';

export const sortProducts = (products: Product[], sortOption: SortOption): Product[] => {
  const sorted = [...products];
  
  switch (sortOption) {
    case 'price-asc':
      sorted.sort((a, b) => getProductPricing(a).finalPrice - getProductPricing(b).finalPrice);
      break;
    case 'price-desc':
      sorted.sort((a, b) => getProductPricing(b).finalPrice - getProductPricing(a).finalPrice);
      break;
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case 'featured':
      sorted.sort((a, b) => {
        const getViews = (p: Product) => p.views_count ?? parseInt(localStorage.getItem(`mare_simulated_views_${p.id}`) || '0');
        const viewsA = getViews(a);
        const viewsB = getViews(b);
        if (viewsA !== viewsB) return viewsB - viewsA;
        return a.orden - b.orden;
      });
      break;
    case 'best-sellers':
      sorted.sort((a, b) => {
        if (a.masVendido && !b.masVendido) return -1;
        if (!a.masVendido && b.masVendido) return 1;
        return a.orden - b.orden;
      });
      break;
    case 'offers':
      sorted.sort((a, b) => {
        const aOffer = getProductPricing(a).hasOffer;
        const bOffer = getProductPricing(b).hasOffer;
        if (aOffer && !bOffer) return -1;
        if (!aOffer && bOffer) return 1;
        return a.orden - b.orden;
      });
      break;
    case 'recommended':
    default:
      // Orden por defecto
      sorted.sort((a, b) => {
        const aScore = (a as any).relevanceScore || 0;
        const bScore = (b as any).relevanceScore || 0;
        if (aScore !== bScore) {
          return bScore - aScore; // Highest score first
        }
        return a.orden - b.orden;
      });
  }
  
  return sorted;
};
