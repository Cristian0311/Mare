import { Product } from './product';

export type InventoryMovementType = 'entry' | 'sale' | 'reserve' | 'release' | 'adjustment' | 'return';

export interface InventoryMovement {
  id: string;
  product_id: string;
  type: InventoryMovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason?: string;
  order_id?: string;
  reservation_id?: string;
  admin_id?: string;
  created_at: string;
  product?: Partial<Product>;
}

export interface InventoryStats {
  total_products: number;
  available: number;
  low_stock: number;
  out_of_stock: number;
  on_order: number;
  reserved_total: number;
}
