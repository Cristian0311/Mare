// Tipos preparados para el futuro Panel Administrativo
import { Product, Category } from '../types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: import('./permissions').AdminRole;
  active: boolean;
}

export interface AdminProduct extends Product {
  // Campos extra que solo interesan al admin
  notes?: string;
  costMN?: number; // Costo de adquisición, no visible al público
  isActive: boolean; // Para ocultar sin eliminar
}

export interface AdminCategory extends Category {
  isActive: boolean;
  sortOrder: number;
}
