import { supabase, isConfigured } from '../lib/supabase/client';

export class CustomerService {
  async upsertCustomerFromOrder(customerData: {
    nombre: string;
    telefono: string;
    whatsapp?: string;
    correo?: string;
  }) {
    if (!isConfigured) return null;
    if (!customerData.telefono) return null;
    
    // First, try to find by phone
    const { data: existing } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', customerData.telefono)
      .maybeSingle();
      
    if (existing) {
      // Update if needed
      const { data: updated, error } = await supabase
        .from('customers')
        .update({
          name: customerData.nombre,
          whatsapp: customerData.whatsapp || customerData.telefono,
          email: customerData.correo || existing.email,
          last_order_date: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .maybeSingle();
        
      if (error) console.error('Error updating customer:', error);
      return updated || existing;
    } else {
      // Create new
      const { data: created, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.nombre,
          phone: customerData.telefono,
          whatsapp: customerData.whatsapp || customerData.telefono,
          email: customerData.correo,
          last_order_date: new Date().toISOString()
        })
        .select()
        .maybeSingle();
        
      if (error) {
        console.error('Error creating customer:', error);
        return null;
      }
      return created;
    }
  }

  async getCustomers(options?: {
    search?: string;
    status?: 'active' | 'archived';
    segment?: 'new' | 'frequent' | 'inactive' | 'wholesale';
    page?: number;
    limit?: number;
  }) {
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' });

    if (options?.status) {
      query = query.eq('status', options.status);
    } else {
      query = query.eq('status', 'active');
    }

    if (options?.search) {
      const search = options.search.trim();
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (options?.segment === 'new') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte('created_at', thirtyDaysAgo.toISOString());
    }

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('last_order_date', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async getCustomerById(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        advisor:advisor_id (id, name),
        notes:customer_notes (
          id,
          note,
          created_at,
          admin_id
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getCustomerStats(id: string) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total_cup, order_type, created_at')
      .eq('customer_id', id);

    if (error) throw error;

    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalSpent = validOrders.reduce((sum, o) => sum + (o.total_cup || 0), 0);
    const avgOrder = validOrders.length > 0 ? totalSpent / validOrders.length : 0;
    const wholesaleCount = validOrders.filter(o => o.order_type === 'wholesale').length;
    
    return {
      totalOrders: orders.length,
      validOrders: validOrders.length,
      totalSpent,
      avgOrder,
      wholesaleCount,
      lastOrder: orders.length > 0 ? [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null
    };
  }

  async updateCustomer(id: string, updates: Partial<{
    name: string;
    phone: string;
    email: string;
    status: 'active' | 'archived';
    internal_notes: string;
    advisor_id: string | null;
  }>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async addNote(customerId: string, note: string) {
    const { data, error } = await supabase
      .from('customer_notes')
      .insert({
        customer_id: customerId,
        note
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

export const customerService = new CustomerService();
