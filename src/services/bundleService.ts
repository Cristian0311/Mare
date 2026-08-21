import { supabase } from '../lib/supabase/client';
import { Bundle, BundleItem, ProductRecommendation } from '../types/bundle';
import { Product } from '../types/product';

const CACHE_KEY = 'mare_bundles_cache';
const META_KEY = 'mare_bundles_meta';

export const bundleService = {
  _cache: [] as Bundle[],
  _fetchedAt: 0,

  async getActiveBundles(forceRefresh = false): Promise<Bundle[]> {
    const NOW = Date.now();
    
    // Load from localStorage if cache is empty
    if (this._cache.length === 0) {
      try {
        const saved = localStorage.getItem(CACHE_KEY);
        if (saved) this._cache = JSON.parse(saved);
      } catch (e) {}
    }

    if (!forceRefresh && this._cache.length > 0 && (NOW - this._fetchedAt < 300000)) {
      return this._cache;
    }

    try {
      // Smart sync
      const { count } = await supabase.from('bundles').select('*', { count: 'exact', head: true });
      const { data: latest } = await supabase.from('bundles').select('updated_at').order('updated_at', { ascending: false }).limit(1);
      
      const remoteCount = count || 0;
      const remoteMaxUpdated = latest?.[0]?.updated_at || '';
      
      const localMetaStr = localStorage.getItem(META_KEY);
      const localMeta = localMetaStr ? JSON.parse(localMetaStr) : null;

      if (!forceRefresh && localMeta && localMeta.count === remoteCount && localMeta.maxUpdated === remoteMaxUpdated && this._cache.length > 0) {
        this._fetchedAt = NOW;
        return this._cache;
      }

      const nowStr = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('bundles')
        .select(`
          *,
          items:bundle_items(
            *,
            product:products(*)
          )
        `)
        .eq('status', 'active')
        .lte('start_date', nowStr)
        .or(`end_date.is.null,end_date.gte.${nowStr}`)
        .order('priority', { ascending: false });

      if (error) throw error;
      
      const mapped = (data || []).map(bundle => this.calculateBundleAvailability(bundle));
      this._cache = mapped;
      this._fetchedAt = NOW;
      localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      localStorage.setItem(META_KEY, JSON.stringify({ count: remoteCount, maxUpdated: remoteMaxUpdated }));
      
      return mapped;
    } catch (e) {
      return this._cache;
    }
  },

  calculateBundleAvailability(bundle: Bundle): Bundle & { availability: number, isAvailable: boolean } {
    if (!bundle.items || bundle.items.length === 0) {
      return { ...bundle, availability: 0, isAvailable: false };
    }

    let minAvailability = Infinity;

    for (const item of bundle.items) {
      if (!item.product) continue;
      
      // If product doesn't track stock, it doesn't limit bundle availability
      if (!item.product.stock_tracking) continue;

      const productStock = item.product.stock_quantity || 0;
      const possibleBundles = Math.floor(productStock / item.quantity);
      
      if (possibleBundles < minAvailability) {
        minAvailability = possibleBundles;
      }
    }

    const availability = minAvailability === Infinity ? 999 : minAvailability;
    
    return {
      ...bundle,
      availability,
      isAvailable: availability > 0
    };
  },

  async getBundleById(id: string): Promise<Bundle | null> {
    const { data, error } = await supabase
      .from('bundles')
      .select(`
        *,
        items:bundle_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) return null;
    return this.calculateBundleAvailability(data);
  },

  async getRecommendations(productId: string): Promise<ProductRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('product_recommendations')
        .select(`
          *,
          recommended_product:products!product_recommendations_recommended_product_id_fkey(*)
        `)
        .eq('product_id', productId)
        .order('score', { ascending: false });

      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createBundle(bundle: Partial<Bundle>, items: Partial<BundleItem>[]): Promise<Bundle> {
    const { data: newBundle, error: bundleError } = await supabase
      .from('bundles')
      .insert([bundle])
      .select()
      .maybeSingle();

    if (bundleError) throw bundleError;

    if (items.length > 0) {
      const itemsToInsert = items.map(item => ({
        ...item,
        bundle_id: newBundle.id
      }));
      
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .insert(itemsToInsert);
        
      if (itemsError) throw itemsError;
    }

    return this.getBundleById(newBundle.id) as Promise<Bundle>;
  }
};
