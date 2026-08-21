
import { supabase } from '../lib/supabase/client';
import { Supplier, SupplierProduct } from '../types/supplier';

export const supplierService = {
  async getSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Supplier[];
  },

  async getSupplierById(id: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as Supplier;
  },

  async createSupplier(supplier: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Supplier;
  },

  async updateSupplier(id: string, supplier: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplier)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Supplier;
  },

  async getSupplierProducts(supplierId: string) {
    const { data, error } = await supabase
      .from('supplier_products')
      .select('*, products(name, sku)')
      .eq('supplier_id', supplierId);
    
    if (error) throw error;
    return data;
  },

  async associateProduct(association: Partial<SupplierProduct>) {
    const { data, error } = await supabase
      .from('supplier_products')
      .upsert(association)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};
