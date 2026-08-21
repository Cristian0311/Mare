
export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  province_id?: number;
  municipality_id?: number;
  notes?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: string;
  supplier_id: string;
  product_id: string;
  last_cost: number;
  currency: string;
  is_primary: boolean;
  created_at: string;
}

export type PurchaseStatus = 'draft' | 'pending' | 'received' | 'cancelled';

export interface Purchase {
  id: string;
  purchase_number: string;
  supplier_id: string;
  status: PurchaseStatus;
  total_amount: number;
  currency: string;
  notes?: string;
  admin_id?: string;
  received_at?: string;
  created_at: string;
  updated_at: string;
  supplier?: {
    name: string;
  };
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_cost: number;
  subtotal: number;
  product?: {
    nombre: string;
    sku?: string;
  };
}

export interface ReplenishmentSuggestion {
  product_id: string;
  name: string;
  sku?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_target: number;
  suggested_quantity: number;
  status: 'out_of_stock' | 'critical_stock' | 'low_stock' | 'ok';
  primary_supplier_id?: string;
  primary_supplier_name?: string;
}
