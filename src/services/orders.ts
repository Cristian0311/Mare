import { supabase } from '../lib/supabase/client';
import { CustomerService } from './customers';
import { inventoryService } from './inventory';

// We need a customer service to map to customers
export interface CreateOrderParams {
  order_number: string;
  order_type: 'retail' | 'wholesale' | 'reservation';
  customer_data: {
    nombre: string;
    telefono: string;
    whatsapp?: string;
    correo?: string;
  };
  advisor_id?: string;
  subtotal_cup: number;
  delivery_fee_cup: number;
  total_cup: number;
  province_id?: string;
  municipality_id?: string;
  address?: string;
  customer_notes?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    unit_price_cup: number;
    quantity: number;
    subtotal_cup: number;
    variant_info?: any;
  }>;
}

export class OrderService {
  
  async createOrder(params: CreateOrderParams) {
    try {
      // 1. Resolve or create customer
      const customerService = new CustomerService();
      const customer = await customerService.upsertCustomerFromOrder(params.customer_data);
      
      // 2. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: params.order_number,
          customer_id: customer?.id || null,
          advisor_id: params.advisor_id || null,
          order_type: params.order_type,
          status: 'pending',
          subtotal_cup: params.subtotal_cup,
          delivery_fee_cup: params.delivery_fee_cup,
          total_cup: params.total_cup,
          province_id: params.province_id || null,
          municipality_id: params.municipality_id || null,
          address: params.address,
          customer_notes: params.customer_notes
        })
        .select()
        .maybeSingle();
        
      if (orderError) throw orderError;
      
      // 3. Create order items
      // 3a. Get current costs for snapshotting (Fase 54)
      const productIds = params.items.map(i => i.product_id);
      const { data: currentProducts } = await supabase
        .from('products')
        .select('id, cost_cup')
        .in('id', productIds);

      const itemsToInsert = params.items.map(item => {
        const productData = currentProducts?.find(p => p.id === item.product_id);
        const cost_unit_cup = productData?.cost_cup || 0;
        
        return {
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price_cup: item.unit_price_cup,
          quantity: item.quantity,
          subtotal_cup: item.subtotal_cup,
          variant_info: item.variant_info,
          // Added for inventory tracking (Fase 52)
          is_wholesale: params.order_type === 'wholesale',
          units_per_presentation: (item as any).units_per_presentation || 1,
          // Added for Profitability snapshot (Fase 54)
          cost_unit_cup: cost_unit_cup,
          margin_unit_cup: item.unit_price_cup - cost_unit_cup
        };
      });
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);
        
      if (itemsError) throw itemsError;
      
      // 4. Create reservation if applicable
      if (params.order_type === 'reservation') {
        const item = params.items[0]; // Assuming one product per reservation order
        if (item) {
          const deposit_amount = Math.round(item.subtotal_cup * 0.3);
          const remaining_amount = item.subtotal_cup - deposit_amount;
          
          await supabase.from('reservations').insert({
            customer_id: customer?.id || null,
            product_id: item.product_id,
            advisor_id: params.advisor_id || null,
            quantity: item.quantity,
            price_at_reservation: item.unit_price_cup,
            deposit_percentage: 30,
            remaining_percentage: 70,
            deposit_amount_cup: deposit_amount,
            remaining_amount_cup: remaining_amount,
            status: 'pending',
            notes: params.customer_notes
          });
        }
      }
      
      return order;
    } catch (e) {
      console.error('Error creating order in Supabase:', e);
      // We don't want to block the whatsapp flow if DB fails, but we should log it
      throw e;
    }
  }

  async getAllOrders() {
    const res = await this.getOrders();
    return res.data || [];
  }

  async getOrders(options?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
    search?: string;
    customerId?: string;
  }) {
    let query = supabase
      .from('orders')
      .select('*, customer:customers(*), province:provinces(*), municipality:municipalities(*), advisor:advisors(*)');
      
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    
    if (options?.type) {
      query = query.eq('order_type', options.type);
    }

    if (options?.customerId) {
      query = query.eq('customer_id', options.customerId);
    }
    
    if (options?.search) {
      const search = options.search.trim();
      if (search) {
        // Search in order_number or customer name (needs or filter)
        query = query.or(`order_number.ilike.%${search}%,customer_notes.ilike.%${search}%`);
        // For searching in customer name, we might need a separate join or search on the related table
      }
    }
    
    query = query.order('created_at', { ascending: false });
    
    if (options?.page && options?.limit) {
      const from = (options.page - 1) * options.limit;
      const to = from + options.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    return { data, count };
  }
  
  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*), province:provinces(*), municipality:municipalities(*), advisor:advisors(*), items:order_items(*)')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }
  
  async updateOrderStatus(id: string, status: string) {
    // 1. Get current order with items
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    const oldStatus = order.status;

    // 2. Update status
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();
      
    if (error) throw error;

    // 3. Inventory Logic
    try {
      // Transition to Confirmed (First time)
      if (status === 'confirmed' && oldStatus === 'pending') {
        for (const item of order.items) {
          const totalUnits = item.quantity * (item.units_per_presentation || 1);
          await inventoryService.adjustStock({
            productId: item.product_id,
            quantity: totalUnits,
            type: 'sale',
            reason: `Venta - Pedido #${order.order_number}`,
            orderId: order.id
          });
        }
      } 
      // Transition from Confirmed to Cancelled
      else if (status === 'cancelled' && (oldStatus === 'confirmed' || oldStatus === 'processing' || oldStatus === 'ready')) {
        for (const item of order.items) {
          const totalUnits = item.quantity * (item.units_per_presentation || 1);
          await inventoryService.adjustStock({
            productId: item.product_id,
            quantity: totalUnits,
            type: 'return',
            reason: `Cancelación - Pedido #${order.order_number}`,
            orderId: order.id
          });
        }
      }
    } catch (invError) {
      console.error('Error updating inventory for order status change:', invError);
      // We don't block the status change if inventory fails, but maybe we should?
      // For now, we just log it.
    }

    return data;
  }

  async updateOrder(id: string, updates: Partial<{
    status: string;
    internal_notes: string;
    deposit_status: 'pending' | 'received';
  }>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }
}

export const orderService = new OrderService();
