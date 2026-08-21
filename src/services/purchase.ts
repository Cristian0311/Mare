
import { supabase } from '../lib/supabase/client';
import { Purchase, PurchaseItem, PurchaseStatus } from '../types/supplier';

export const purchaseService = {
  async getPurchases() {
    const { data, error } = await supabase
      .from('purchases')
      .select('*, suppliers(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Purchase & { suppliers: { name: string } })[];
  },

  async getPurchaseById(id: string) {
    const { data: purchase, error: pError } = await supabase
      .from('purchases')
      .select('*, suppliers(name)')
      .eq('id', id)
      .maybeSingle();
    
    if (pError) throw pError;

    const { data: items, error: iError } = await supabase
      .from('purchase_items')
      .select('*, products(name, sku)')
      .eq('purchase_id', id);
    
    if (iError) throw iError;

    return { 
      ...purchase, 
      items: (items || []).map((item: any) => ({
        ...item,
        products: item.products ? {
          ...item.products,
          nombre: item.products.name
        } : null
      })) as PurchaseItem[] 
    };
  },

  async createPurchase(purchase: Partial<Purchase>, items: Partial<PurchaseItem>[]) {
    // 1. Create Purchase
    const { data: newPurchase, error: pError } = await supabase
      .from('purchases')
      .insert({
        ...purchase,
        purchase_number: `PUR-${Date.now().toString().slice(-6)}`
      })
      .select()
      .maybeSingle();
    
    if (pError) throw pError;

    // 2. Create Items
    const purchaseItems = items.map(item => ({
      ...item,
      purchase_id: newPurchase.id,
      subtotal: (item.quantity || 0) * (item.unit_cost || 0)
    }));

    const { error: iError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);
    
    if (iError) throw iError;

    return newPurchase;
  },

  async updateStatus(id: string, status: PurchaseStatus, adminId?: string) {
    if (status === 'received') {
      const { data, error } = await supabase.rpc('receive_purchase', {
        p_purchase_id: id,
        p_admin_id: adminId
      });
      if (error) throw error;
      if (data && !data.success) throw new Error(data.error);
      return data;
    }

    const { data, error } = await supabase
      .from('purchases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};
