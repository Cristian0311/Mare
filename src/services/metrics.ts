import { supabase } from '../lib/supabase/client';

export const metricsService = {
  // Increment global store visits once per session
  async incrementGlobalVisits(): Promise<void> {
    const sessionKey = 'mare_visited_global_session';
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      return;
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionKey, 'true');
    }

    try {
      // First try the RPC
      const { error: rpcError } = await supabase.rpc('increment_global_visits');
      
      if (rpcError) {
        console.warn('RPC increment_global_visits failed, trying manual update:', rpcError);
        
        // Fallback: direct table query
        const { data, error: selectError } = await supabase
          .from('store_metrics')
          .select('value')
          .eq('id', 'global_visits')
          .maybeSingle();

        if (selectError) throw selectError;

        const currentVal = data?.value || 0;
        const { error: upsertError } = await supabase
          .from('store_metrics')
          .upsert({ 
            id: 'global_visits', 
            value: currentVal + 1, 
            updated_at: new Date().toISOString() 
          }, { onConflict: 'id' });
          
        if (upsertError) throw upsertError;
      }
    } catch (e) {
      console.error('Critical error in incrementGlobalVisits:', e);
      // Local fallback
      const localKey = 'mare_local_visits_fallback';
      const localCount = parseInt(localStorage.getItem(localKey) || '0');
      localStorage.setItem(localKey, (localCount + 1).toString());
    }
  },

  // Get total store visits
  async getGlobalVisits(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('store_metrics')
        .select('value')
        .eq('id', 'global_visits')
        .maybeSingle();
      
      if (!error && data?.value !== undefined && data?.value !== null) {
        return data.value;
      }
      
      return parseInt(localStorage.getItem('mare_local_visits_fallback') || '0');
    } catch (e) {
      console.error('Failed to fetch global visits:', e);
      return parseInt(localStorage.getItem('mare_local_visits_fallback') || '0');
    }
  },

  async resetGlobalVisits(): Promise<void> {
    try {
      const { error } = await supabase
        .from('store_metrics')
        .upsert({ 
          id: 'global_visits', 
          value: 1, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });
        
      if (error) throw error;
      localStorage.setItem('mare_local_visits_fallback', '1');
    } catch (e) {
      console.error('Failed to reset global visits:', e);
      localStorage.setItem('mare_local_visits_fallback', '1');
    }
  },

  // Increment product views and return current view count once per session
  async incrementProductViews(productId: string): Promise<number> {
    if (!productId) return 1;

    const sessionKey = `mare_viewed_prod_${productId}`;
    const alreadyViewed = typeof window !== 'undefined' && sessionStorage.getItem(sessionKey);

    try {
      if (!alreadyViewed) {
        if (typeof window !== 'undefined') sessionStorage.setItem(sessionKey, 'true');
        const { error: rpcError } = await supabase.rpc('increment_product_views', { product_id: productId });
        
        if (rpcError) {
          const { data: prodData } = await supabase
            .from('products')
            .select('views_count')
            .eq('id', productId)
            .maybeSingle();

          const currentViews = ((prodData as any)?.views_count || 0) + 1;
          await supabase
            .from('products')
            .update({ views_count: currentViews })
            .eq('id', productId);
        }
      }

      const { data } = await supabase
        .from('products')
        .select('views_count')
        .eq('id', productId)
        .maybeSingle();
        
      if (data && (data as any).views_count !== undefined && (data as any).views_count !== null) {
        return (data as any).views_count;
      }
      throw new Error("Missing view count");
    } catch (e) {
      const key = `mare_simulated_views_${productId}`;
      const local = parseInt(localStorage.getItem(key) || '15');
      if (!alreadyViewed) {
        if (typeof window !== 'undefined') sessionStorage.setItem(sessionKey, 'true');
        localStorage.setItem(key, (local + 1).toString());
        return local + 1;
      }
      return local;
    }
  },
};
