
import { supabase } from '../lib/supabase/client';
import { ReplenishmentSuggestion } from '../types/supplier';

export const replenishmentService = {
  async getSuggestions() {
    // 1. Get products with low stock or out of stock
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, stock_quantity, low_stock_threshold, stock_tracking')
      .eq('stock_tracking', true)
      .or(`stock_quantity.lte.low_stock_threshold,stock_quantity.eq.0`)
      .order('stock_quantity', { ascending: true });

    if (error) throw error;

    // 2. Map to suggestions
    const suggestions: ReplenishmentSuggestion[] = products.map(p => {
      const stock = p.stock_quantity || 0;
      const threshold = p.low_stock_threshold || 5;
      const target = threshold * 3; // Simple heuristic: target is 3x threshold
      
      let status: ReplenishmentSuggestion['status'] = 'ok';
      if (stock === 0) status = 'out_of_stock';
      else if (stock <= threshold / 2) status = 'critical_stock';
      else if (stock <= threshold) status = 'low_stock';

      return {
        product_id: p.id,
        name: p.name,
        sku: p.sku,
        stock_quantity: stock,
        low_stock_threshold: threshold,
        stock_target: target,
        suggested_quantity: Math.max(0, target - stock),
        status
      };
    });

    return suggestions.filter(s => s.status !== 'ok');
  }
};
