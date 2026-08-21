export * from './product';
export * from './category';
export * from './variant';

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  buttonText?: string;
  active: boolean;
  order: number;
}

export interface OrderItem {
  productId: string;
  varianteId?: string;
  cantidad: number;
  precioUnitarioMN: number;
}

export interface Order {
  id: string;
  fecha: string;
  items: OrderItem[];
  totalMN: number;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  datosCliente: {
    nombre: string;
    telefono: string;
    direccion?: string;
    provincia?: string;
    municipio?: string;
  };
}

export interface AppConfig {
  tiendaNombre: string;
  eslogan: string;
  whatsappNumber: string;
  monedaBase: 'MN';
  tasaCambioUSD?: number; // Para futura implementación
}

export interface Advisor {
  id: string;
  name: string;
  whatsapp: string;
  avatarUrl?: string;
  isPrimary: boolean;
  active: boolean;
  role?: string;
}

export interface Municipality {
  id: string;
  nombre: string;
  precioEnvioMN: number;
}

export interface Province {
  id: string;
  nombre: string;
  municipios: Municipality[];
}
