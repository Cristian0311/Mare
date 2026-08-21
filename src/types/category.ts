export interface Subcategory {
  id: string;
  nombre: string;
  slug: string;
}

export interface Tag {
  id: string;
  nombre: string;
  slug: string;
}

export interface Category {
  id: string;
  parent_id?: string | null;
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  imagen?: string;
  subcategorias?: Subcategory[];
  activo?: boolean;
  orden?: number;
}
