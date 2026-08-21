export interface VariantOption {
  nombre: string; // ej: 'Color', 'Talla', 'Capacidad'
  valores: string[]; // ej: ['Negro', 'Blanco'], ['S', 'M', 'L']
}

export interface ProductVariant {
  id: string;
  atributos: Record<string, string>; // ej: { Color: 'Negro', Capacidad: '64 GB' }
  precioMN?: number; // Precio específico de esta variante si varía del base
  precioAnteriorMN?: number;
  stock?: number;
  disponibilidad?: 'disponible' | 'pocas-unidades' | 'agotado' | 'reservado' | 'proximamente';
  imagen?: string; // Imagen específica de la variante
}
