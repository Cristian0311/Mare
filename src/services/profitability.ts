import { supabase } from '../lib/supabase/client';

export interface ProfitabilityStats {
  revenue: number;
  cost: number;
  margin: number;
  margin_percent: number;
  order_count: number;
}

export interface ProductProfitability {
  product_id: string;
  nombre: string;
  sku: string;
  total_units_sold: number;
  total_revenue: number;
  total_cost: number;
  total_margin: number;
  margin_percent: number;
}

export const profitabilityService = {
  async getStats(startDate: string, endDate: string): Promise<ProfitabilityStats> {
    const { data, error } = await supabase.rpc('get_profitability_stats', {
      p_start_date: startDate,
      p_end_date: endDate
    });
    
    if (error) throw error;
    return data as ProfitabilityStats;
  },

  async getProductProfitability(): Promise<ProductProfitability[]> {
    const { data, error } = await supabase
      .from('product_profitability')
      .select('*')
      .order('total_margin', { ascending: false });
    
    if (error) throw error;
    return data as ProductProfitability[];
  },

  async getInventoryValuation() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, sku, stock_quantity, cost_cup')
      .eq('stock_tracking', true)
      .gt('stock_quantity', 0);
    
    if (error) throw error;
    
    const valuation = data.reduce((acc, p) => {
      const cost = p.cost_cup || 0;
      const qty = p.stock_quantity || 0;
      return acc + (cost * qty);
    }, 0);

    return {
      total_valuation: valuation,
      items: data
    };
  }
};
