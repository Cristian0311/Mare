import { Product } from '../types/product';
import { RecommendedItem, EventType, RecommendationSettings } from '../types/recommendation';
import { getRecentlyViewedIds } from '../utils/recentlyViewed';
import { productService } from './products';

class RecommendationEngine {
  async getSettings(): Promise<RecommendationSettings> {
    return {
      id: 'crm-catalog',
      auto_recommendations_enabled: true,
      max_items_per_section: 4,
      min_confidence_score: 0,
      weights: { relevance: 0.5, popularity: 0.2, recency: 0.1, margin: 0, stock: 0.2 }
    };
  }

  async trackEvent(eventType: EventType, productId?: string, categoryId?: string, source = 'direct') {
    try {
      localStorage.setItem('mare_last_catalog_event', JSON.stringify({
        eventType, productId, categoryId, source, at: new Date().toISOString()
      }));
    } catch {}
  }

  private valid(products: Product[], excludeIds: string[] = []) {
    return products.filter(p => p && p.activo !== false && (p.stock ?? 0) > 0 && !excludeIds.includes(p.id));
  }

  private wrap(products: Product[], type: any, reason: string, badge?: string): RecommendedItem[] {
    return products.map((product, index) => ({
      product,
      type,
      score: 100 - index,
      reason,
      ...(badge ? { badge } : {})
    })) as RecommendedItem[];
  }

  calculateRecommendationScore(product: Product, options: { categoryMatch?: boolean; tagMatches?: number; salesCount?: number; viewsCount?: number; hasActivePromo?: boolean; isManual?: boolean; manualPriority?: number; }): number {
    if (options.isManual) return 100 + (options.manualPriority || 10);
    let score = options.categoryMatch ? 30 : 0;
    score += Math.min(25, (options.tagMatches || 0) * 5);
    score += Math.min(20, (options.salesCount || 0) * 2);
    if (options.hasActivePromo) score += 10;
    if ((product.stock ?? 0) > 5) score += 5;
    return score;
  }

  async getRelatedProducts(productId: string, currentCategoryId?: string, limit = 4, _isWholesale = false): Promise<RecommendedItem[]> {
    const all = await productService.getProducts();
    const current = all.find(p => p.id === productId);
    const category = currentCategoryId || current?.categoria_id || current?.categoria;
    const candidates = this.valid(all, [productId]).filter(p => !category || p.categoria_id === category || p.categoria === category);
    return this.wrap(candidates.slice(0, limit), 'related', 'Relacionado con tu selección');
  }

  async getComplementaryProducts(productId: string, limit = 4, _isWholesale = false): Promise<RecommendedItem[]> {
    const all = await productService.getProducts();
    const current = all.find(p => p.id === productId);
    const category = current?.categoria_id || current?.categoria;
    const candidates = this.valid(all, [productId]).filter(p => !category || p.categoria_id === category || p.categoria === category);
    return this.wrap(candidates.slice(0, limit), 'complementary', 'Complemento ideal');
  }

  async getPopularProducts(limit = 4, _isWholesale = false): Promise<RecommendedItem[]> {
    const all = await productService.getProducts();
    return this.wrap(this.valid(all).slice(0, limit), 'popular', 'Producto disponible', 'DESTACADO');
  }

  async getTrendingProducts(limit = 4, _isWholesale = false): Promise<RecommendedItem[]> {
    return (await this.getPopularProducts(limit)).map(p => ({ ...p, type: 'trending', reason: 'Disponible en el catálogo', badge: 'DESTACADO' }));
  }

  async getRecentlyViewedProducts(limit = 6, _isWholesale = false): Promise<RecommendedItem[]> {
    const ids = getRecentlyViewedIds();
    if (!ids.length) return [];
    const all = await productService.getProducts();
    const products = ids.map(id => all.find(p => p.id === id)).filter(Boolean) as Product[];
    return this.wrap(this.valid(products), 'recently_viewed', 'Visto recientemente').slice(0, limit);
  }

  async getForYouRecommendations(limit = 4, _isWholesale = false): Promise<RecommendedItem[]> {
    const ids = getRecentlyViewedIds();
    if (!ids.length) return this.getPopularProducts(limit);
    const all = await productService.getProducts();
    const viewed = all.filter(p => ids.includes(p.id));
    const categories = new Set(viewed.map(p => p.categoria_id || p.categoria));
    const candidates = this.valid(all, ids).filter(p => categories.has(p.categoria_id || p.categoria));
    return this.wrap((candidates.length ? candidates : this.valid(all, ids)).slice(0, limit), 'for_you', 'Basado en el catálogo que has visto');
  }

  async getCartUpsellRecommendations(cartProductIds: string[], limit = 3, _isWholesale = false): Promise<RecommendedItem[]> {
    const all = await productService.getProducts();
    return this.wrap(this.valid(all, cartProductIds).slice(0, limit), 'complementary', 'También puede interesarte');
  }
}

export const recommendationEngine = new RecommendationEngine();
