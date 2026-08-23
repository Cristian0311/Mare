import { supabase } from '../lib/supabase/client';
import { InventoryMovement, InventoryMovementType } from '../types/inventory';

export class InventoryService {
  async getMovements(options?: {
    productId?: string;
    type?: InventoryMovementType;
    limit?: number;
    page?: number;
  }) {
    let query = supabase
      .from('inventory_movements')
      .select(`
        *,
        product:products(id, nombre:name)
      `);

    if (options?.productId) {
      query = query.eq('product_id', options.productId);
    }
    if (options?.type) {
      query = query.eq('type', options.type);
    }

    const limit = options?.limit || 20;
    const page = options?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async adjustStock(params: {
    productId: string;
    quantity: number;
    type: InventoryMovementType;
    reason: string;
    orderId?: string;
    reservationId?: string;
  }) {
    const { productId, quantity, type, reason, orderId, reservationId } = params;

    const { data, error } = await supabase.rpc('adjust_product_stock', {
      p_product_id: productId,
      p_quantity: quantity,
      p_type: type,
      p_reason: reason,
      p_order_id: orderId,
      p_reservation_id: reservationId
    });

    if (error) throw error;
    if (data && !data.success) throw new Error(data.error);
    
    return data;
  }

  async getInventoryStats() {
    const { data, error } = await supabase
      .from('products')
      .select('available, availability_status, stock_tracking, stock_quantity, reserved_quantity');

    if (error) throw error;

    const stats = {
      total_products: data.length,
      available: data.filter(p => p.available === true).length,
      low_stock: data.filter(p => p.availability_status === 'low_stock').length,
      out_of_stock: data.filter(p => p.available === false).length,
      on_order: data.filter(p => p.availability_status === 'on_order').length,
      reserved_total: data.reduce((sum, p) => sum + (p.reserved_quantity || 0), 0)
    };

    return stats;
  }
}

export const inventoryService = new InventoryService();
