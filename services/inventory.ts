import { supabase, isConfigured } from '../lib/supabase/client';

export const MARE_BRANCH_ID = '871e7074-dbea-48dc-ae1e-f1570b5e0047';

export const inventoryService = {
  async getInventoryByProduct(productId: string) {
    if (!isConfigured) return [];
    const { data, error } = await supabase.from('inventory').select('*').eq('product_id', productId).eq('branch_id', MARE_BRANCH_ID);
    if (error) throw error;
    return data || [];
  },
  async getInventoryStats() {
    if (!isConfigured) return { total_products: 0, available: 0, low_stock: 0, out_of_stock: 0, on_order: 0, reserved_total: 0 };
    const { data, error } = await supabase.from('inventory').select('product_id,quantity,min_quantity').eq('branch_id', MARE_BRANCH_ID);
    if (error) throw error;
    const rows = data || [];
    return {
      total_products: new Set(rows.map((r:any) => r.product_id)).size,
      available: rows.filter((r:any) => Number(r.quantity) > 0).length,
      low_stock: rows.filter((r:any) => Number(r.quantity) > 0 && Number(r.quantity) <= Number(r.min_quantity || 0)).length,
      out_of_stock: rows.filter((r:any) => Number(r.quantity) <= 0).length,
      on_order: 0,
      reserved_total: 0
    };
  },
  async adjustStock(): Promise<never> { throw new Error('Mare no modifica inventario. El inventario pertenece al CRM.'); },
  async createMovement(): Promise<never> { throw new Error('Mare no crea movimientos. El inventario pertenece al CRM.'); }
};
