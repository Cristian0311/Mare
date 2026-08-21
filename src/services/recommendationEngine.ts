import { supabase } from '../lib/supabase/client';
import { Product } from '../types/product';
import { Bundle } from '../types/bundle';
import { RecommendedItem, EventType, RecommendationSettings } from '../types/recommendation';
import { getRecentlyViewedIds } from '../utils/recentlyViewed';
import { bundleService } from './bundleService';
import { productService } from './products';

function getOrCreateSessionId(): string {
  try {
    let sessionId = localStorage.getItem('mare_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('mare_session_id', sessionId);
    }
    return sessionId;
  } catch (e) {
    return 'sess_anon_' + Date.now();
  }
}

class RecommendationEngine {
  private settingsCache: RecommendationSettings | null = null;
  private settingsFetchedAt = 0;

  private async getSettings(): Promise<RecommendationSettings> {
    const NOW = Date.now();
    if (this.settingsCache && NOW - this.settingsFetchedAt < 60000) {
      return this.settingsCache;
    }

    try {
      const { data } = await supabase
        .from('recommendation_settings')
        .select('*')
        .maybeSingle();
      
      if (data) {
        this.settingsCache = data as RecommendationSettings;
        this.settingsFetchedAt = NOW;
        return this.settingsCache;
      }
    } catch (e) {
      // Fallback default
    }

    return {
      id: 'default',
      auto_recommendations_enabled: true,
      max_items_per_section: 4,
      min_confidence_score: 0.1,
      weights: {
        relevance: 0.35,
        popularity: 0.25,
        recency: 0.20,
        margin: 0.10,
        stock: 0.10
      }
    };
  }

  /**
   * Track user interaction asynchronously
   */
  async trackEvent(eventType: EventType, productId?: string, categoryId?: string, source = 'direct', bundleId?: string) {
    try {
      const sessionId = getOrCreateSessionId();
      
      await supabase.from('recommendation_events').insert({
        session_id: sessionId,
        event_type: eventType,
        product_id: productId || null,
        category_id: categoryId || null,
        bundle_id: bundleId || null,
        recommendation_source: source
      });
    } catch (e) {
      // Non-blocking tracking
    }
  }

  /**
   * Exclude out of stock, deactivated, or explicitly excluded items
   */
  private filterValidProducts(products: Product[], isWholesale = false): Product[] {
    return products.filter(p => {
      if (!p || p.activo === false) return false;
      
      // Handle stock
      const stock = p.stock ?? p.stock_actual ?? 0;
      
      // Stock must be > 0
      if (stock <= 0) return false;

      // Handle wholesale mode match
      if (isWholesale) {
        if (!p.ventaMayorista?.activo) return false;
      }

      return true;
    });
  }

  /**
   * Calculate score for ranking products
   */
  calculateRecommendationScore(product: Product, options: {
    categoryMatch?: boolean;
    tagMatches?: number;
    salesCount?: number;
    viewsCount?: number;
    hasActivePromo?: boolean;
    isManual?: boolean;
    manualPriority?: number;
  }): number {
    if (options.isManual) {
      return 100 + (options.manualPriority || 10);
    }

    let score = 0;

    // Relevance
    if (options.categoryMatch) score += 30;
    if (options.tagMatches) score += Math.min(25, options.tagMatches * 5);

    // Popularity
    const sales = options.salesCount || 0;
    score += Math.min(20, sales * 2);

    // Active Promotion Boost (light boost, priority remains relevance)
    if (options.hasActivePromo) score += 10;

    // Stock sufficiency boost
    const stock = product.stock ?? product.stock_actual ?? 0;
    if (stock > 5) score += 5;

    return score;
  }

  /**
   * 1. Related Products (Página de producto: "También te puede interesar")
   */
  async getRelatedProducts(productId: string, currentCategoryId?: string, limit = 4, isWholesale = false): Promise<RecommendedItem[]> {
    const settings = await this.getSettings();
    if (!settings.auto_recommendations_enabled) return [];

    try {
      // First check manual recommendations
      // Using explicit FK name to avoid PGRST200 ambiguous relation error
      const { data: manualData, error: manualError } = await supabase
        .from('product_recommendations')
        .select('*, recommended_product:products!product_recommendations_recommended_product_id_fkey(*)')
        .eq('product_id', productId)
        .eq('type', 'related')
        .order('score', { ascending: false });

      let resultProducts: Product[] = [];

      if (!manualError && manualData && manualData.length > 0) {
        resultProducts = manualData
          .map(m => m.recommended_product)
          .filter(Boolean) as Product[];
      }

      // If we need more products to hit limit
      if (resultProducts.length < limit && currentCategoryId) {
        const { data: categoryProducts } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', currentCategoryId)
          .neq('id', productId)
          .limit(limit * 2);

        if (categoryProducts) {
          const valid = this.filterValidProducts(categoryProducts as Product[], isWholesale);
          for (const p of valid) {
            if (!resultProducts.some(r => r.id === p.id)) {
              resultProducts.push(p);
            }
            if (resultProducts.length >= limit) break;
          }
        }
      }

      // Fallback to popular products if still below limit
      if (resultProducts.length < limit) {
        const popular = await this.getPopularProducts(limit, isWholesale);
        for (const item of popular) {
          if (item.product && item.product.id !== productId && !resultProducts.some(r => r.id === item.product!.id)) {
            resultProducts.push(item.product);
          }
          if (resultProducts.length >= limit) break;
        }
      }

      const validProducts = this.filterValidProducts(resultProducts, isWholesale).slice(0, limit);

      return validProducts.map(p => ({
        product: p,
        type: 'related',
        score: 80,
        reason: 'Relacionado con tu selección'
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * 2. Complementary Products (Página de producto / Carrito: "Completa tu compra")
   */
  async getComplementaryProducts(productId: string, limit = 4, isWholesale = false): Promise<RecommendedItem[]> {
    try {
      let resultProducts: Product[] = [];

      // 1. Check manual complementary rules
      try {
        const { data: manualData, error: manualError } = await supabase
          .from('product_recommendations')
          .select('*, recommended_product:products!product_recommendations_recommended_product_id_fkey(*)')
          .eq('product_id', productId)
          .eq('type', 'complementary')
          .order('score', { ascending: false });

        if (!manualError && manualData && manualData.length > 0) {
          resultProducts = manualData
            .map(m => m.recommended_product)
            .filter(Boolean) as Product[];
        }
      } catch (err) {
        // Silently handle if table missing or Supabase offline
      }

      // 2. Check product bundles containing this product
      try {
        const activeBundles = await bundleService.getActiveBundles();
        const matchingBundles = activeBundles.filter(b => 
          b.items?.some(i => i.product_id === productId)
        );

        for (const bundle of matchingBundles) {
          for (const item of bundle.items || []) {
            if (item.product && item.product_id !== productId && !resultProducts.some(p => p.id === item.product_id)) {
              resultProducts.push(item.product);
            }
          }
        }
      } catch (err) {
        // Silently handle
      }

      // 3. Fallback to products from same category or local catalog
      if (resultProducts.length < limit) {
        try {
          const allProducts = await productService.getProducts();
          const currentProd = allProducts.find(p => p.id === productId || p.slug === productId);

          const candidates = allProducts.filter(p => 
            p.id !== productId && 
            p.slug !== productId &&
            (!currentProd || p.categoria === currentProd.categoria || p.categoria_id === currentProd.categoria_id)
          );

          for (const p of candidates) {
            if (!resultProducts.some(r => r.id === p.id)) {
              resultProducts.push(p);
            }
            if (resultProducts.length >= limit) break;
          }

          if (resultProducts.length < limit) {
            for (const p of allProducts) {
              if (p.id !== productId && p.slug !== productId && !resultProducts.some(r => r.id === p.id)) {
                resultProducts.push(p);
              }
              if (resultProducts.length >= limit) break;
            }
          }
        } catch (err) {
          // Silently handle
        }
      }

      const validProducts = this.filterValidProducts(resultProducts, isWholesale).slice(0, limit);

      return validProducts.map(p => ({
        product: p,
        type: 'complementary',
        score: 90,
        reason: 'Complemento ideal'
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * 3. Popular Products ("Más Vendidos")
   */
  async getPopularProducts(limit = 4, isWholesale = false): Promise<RecommendedItem[]> {
    try {
      // Query order items for most sold products
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .limit(100);

      const salesMap: Record<string, number> = {};
      (orderItems || []).forEach(item => {
        if (item.product_id) {
          salesMap[item.product_id] = (salesMap[item.product_id] || 0) + (item.quantity || 1);
        }
      });

      const topProductIds = Object.keys(salesMap).sort((a, b) => salesMap[b] - salesMap[a]);

      let products: Product[] = [];

      if (topProductIds.length > 0) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('id', topProductIds.slice(0, limit * 3));
        
        if (data) {
          products = (data as Product[]).sort((a, b) => (salesMap[b.id] || 0) - (salesMap[a.id] || 0));
        }
      }

      // If no order data exists yet or Supabase empty, pick from productService
      if (products.length < limit) {
        try {
          const allProds = await productService.getProducts();
          for (const p of allProds) {
            if (!products.some(existing => existing.id === p.id)) {
              products.push(p);
            }
            if (products.length >= limit * 2) break;
          }
        } catch (err) {
          // Ignore
        }
      }

      const validProducts = this.filterValidProducts(products, isWholesale).slice(0, limit);

      return validProducts.map(p => ({
        product: p,
        type: 'popular',
        score: 75,
        reason: 'Producto altamente popular',
        badge: 'MÁS VENDIDO'
      }));
    } catch (e) {
      // Fallback to local catalog directly
      try {
        const allProds = await productService.getProducts();
        const validProducts = this.filterValidProducts(allProds, isWholesale).slice(0, limit);
        return validProducts.map(p => ({
          product: p,
          type: 'popular',
          score: 75,
          reason: 'Producto destacado',
          badge: 'DESTACADO'
        }));
      } catch (err) {
        return [];
      }
    }
  }

  /**
   * 4. Trending Products ("Tendencia")
   */
  async getTrendingProducts(limit = 4, isWholesale = false): Promise<RecommendedItem[]> {
    // Falls back to popular products to avoid RLS console spam on missing tables
    const popular = await this.getPopularProducts(limit, isWholesale);
    return popular.map(p => ({
      ...p,
      type: 'trending',
      reason: 'Alta tendencia esta semana',
      badge: 'TENDENCIA'
    }));
  }

  /**
   * 5. Recently Viewed Products (Device LocalStorage)
   */
  async getRecentlyViewedProducts(limit = 6, isWholesale = false): Promise<RecommendedItem[]> {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) return [];

    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', ids.slice(0, limit * 2));

      if (!data) return [];

      // Sort according to local storage order
      const sorted = (data as Product[]).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      const valid = this.filterValidProducts(sorted, isWholesale).slice(0, limit);

      return valid.map(p => ({
        product: p,
        type: 'recently_viewed',
        score: 100,
        reason: 'Visto recientemente'
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * 6. Personalized Recommendations ("Pensado para ti")
   */
  async getForYouRecommendations(limit = 4, isWholesale = false): Promise<RecommendedItem[]> {
    const recentlyViewedIds = getRecentlyViewedIds();
    
    // If no signals exist, return popular items
    if (recentlyViewedIds.length === 0) {
      return this.getPopularProducts(limit, isWholesale);
    }

    try {
      // Find categories of recently viewed products
      const { data: viewedProducts } = await supabase
        .from('products')
        .select('category_id')
        .in('id', recentlyViewedIds.slice(0, 5));

      const categoryIds = (viewedProducts || []).map(p => p.category_id).filter(Boolean);

      if (categoryIds.length === 0) {
        return this.getPopularProducts(limit, isWholesale);
      }

      // Find other products in these categories excluding recently viewed
      const { data: suggestions } = await supabase
        .from('products')
        .select('*')
        .in('category_id', categoryIds)
        .limit(limit * 3);

      const filtered = (suggestions as Product[] || []).filter(p => !recentlyViewedIds.includes(p.id));
      const valid = this.filterValidProducts(filtered, isWholesale).slice(0, limit);

      if (valid.length === 0) {
        return this.getPopularProducts(limit, isWholesale);
      }

      return valid.map(p => ({
        product: p,
        type: 'for_you',
        score: 95,
        reason: 'Basado en tus preferencias de navegación',
        badge: 'PARA TI'
      }));
    } catch (e) {
      return this.getPopularProducts(limit, isWholesale);
    }
  }

  /**
   * 7. Cart Upsell Recommendations ("Quizás también necesites...")
   */
  async getCartUpsellRecommendations(cartProductIds: string[], limit = 3, isWholesale = false): Promise<RecommendedItem[]> {
    if (!cartProductIds || cartProductIds.length === 0) return [];

    try {
      // Check active bundles for cart products
      const activeBundles = await bundleService.getActiveBundles();
      const relevantBundle = activeBundles.find(b => 
        b.status === 'active' &&
        b.items?.some(i => cartProductIds.includes(i.product_id))
      );

      const items: RecommendedItem[] = [];

      // If relevant bundle exists, prioritize combo recommendation
      if (relevantBundle) {
        items.push({
          bundle: relevantBundle,
          type: 'combos',
          score: 100,
          reason: 'Completa con este Combo con Descuento',
          badge: 'COMBO'
        });
      }

      // Get complementary items for items in cart
      for (const pId of cartProductIds) {
        const comps = await this.getComplementaryProducts(pId, 2, isWholesale);
        for (const comp of comps) {
          if (comp.product && !cartProductIds.includes(comp.product.id) && !items.some(i => i.product?.id === comp.product!.id)) {
            items.push(comp);
          }
          if (items.length >= limit) break;
        }
        if (items.length >= limit) break;
      }

      // If still below limit, get popular products not in cart
      if (items.length < limit) {
        const popular = await this.getPopularProducts(limit * 2, isWholesale);
        for (const pop of popular) {
          if (pop.product && !cartProductIds.includes(pop.product.id) && !items.some(i => i.product?.id === pop.product!.id)) {
            items.push(pop);
          }
          if (items.length >= limit) break;
        }
      }

      return items.slice(0, limit);
    } catch (e) {
      return [];
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
