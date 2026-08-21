/**
 * Tipos base para la infraestructura de base de datos Supabase (PostgreSQL).
 * Representa el esquema completo de MARÉ (Fase 43).
 */

export interface DatabaseProduct {
  id: string; // UUID
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price_cup: number;
  status: 'active' | 'inactive' | 'draft';
  product_type: 'retail' | 'wholesale' | 'reservation';
  is_featured: boolean;
  stock: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface DatabaseWholesaleConfig {
  id: string;
  product_id: string;
  unit_type: 'unit' | 'quantity' | 'box' | 'package' | 'lot';
  min_quantity: number;
  price_cup: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DatabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrder {
  id: string;
  customer_id: string | null;
  advisor_id: string | null;
  order_type: 'retail' | 'wholesale' | 'reservation';
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  subtotal_cup: number;
  delivery_fee_cup: number;
  total_cup: number;
  province_id: string | null;
  municipality_id: string | null;
  address: string | null;
  customer_notes: string | null;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price_cup: number;
  quantity: number;
  subtotal_cup: number;
  variant_info: any;
  created_at: string;
}

export interface DatabaseReservation {
  id: string;
  customer_id: string | null;
  product_id: string | null;
  advisor_id: string | null;
  quantity: number;
  price_at_reservation: number;
  deposit_percentage: number;
  remaining_percentage: number;
  deposit_amount_cup: number;
  remaining_amount_cup: number;
  status: 'pending' | 'requested' | 'purchased' | 'ready' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProvince {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMunicipality {
  id: string;
  province_id: string;
  name: string;
  status: 'active' | 'inactive';
  sort_order: number;
  delivery_fee_cup: number;
  is_delivery_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAdvisor {
  id: string;
  name: string;
  avatar_path: string | null;
  phone: string | null;
  whatsapp: string;
  gender: 'male' | 'female' | 'other' | null;
  role: string;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomer {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  province_id: string | null;
  municipality_id: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
