import { ProductVariant, VariantOption } from './variant';

export type ProductAvailability = 'disponible' | 'agotado';

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  precioMN: number;
  precioAnteriorMN?: number;
  imagenes: string[];
  descripcionCorta: string;
  descripcionCompleta: string;
  categoria: string; // ID de la categoría
  categoria_id?: string; // Alias para compatibilidad
  categoriaNombre?: string; // Nombre de la categoría
  subcategoria?: string; // ID de la subcategoría
  etiquetas: string[];
  estado?: 'nuevo' | 'usado' | 'reacondicionado';
  disponibilidad: ProductAvailability;
  marca?: string;
  modelo?: string;
  peso?: string;
  garantia?: string;
  stockVisual?: number;
  stock?: number;
  stock_actual?: number;
  precioCUP?: number;
  
  // Inventario Avanzado (Fase 52)
  stock_tracking?: boolean;
  stock_quantity?: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
  availability_status?: 'available' | 'low_stock' | 'out_of_stock' | 'on_order' | 'discontinued';
  sku?: string;
  
  // Proveedores & Costos (Fase 53)
  primary_supplier_id?: string;
  cost_cup?: number;
  
  // Flags para colecciones especiales
  nuevo: boolean;
  oferta: boolean;
  destacado: boolean;
  masVendido: boolean;
  views_count?: number; // Para destacar automáticamente
  
  fechaCreacion: string;
  orden: number;
  
  // Sistema de venta mayorista (opcional)
  ventaMayorista?: {
    habilitada: boolean;
    activo?: boolean;
    presentacion: 'Unidad' | 'Paquete' | 'Caja' | 'Lote';
    cantidadMinima: number;
    unidadesPorPresentacion?: number;
    precioMN: number;
    precioCUP?: number;
    ahorroMN?: number;
  };
  
  // Sistema de variantes
  opcionesVariantes?: VariantOption[];
  variantes?: ProductVariant[];
  activo?: boolean;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  hasMore: boolean;
  nextOffset: number;
}
