import { supabase, isConfigured } from '../lib/supabase/client';
import { Category } from '../types/category';

const slugify = (value: string) => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

class CategoriesService {
  async getCategories(): Promise<Category[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase.from('categories').select('id,name,department,description,color,image').order('name');
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id, nombre: c.name, slug: slugify(c.name), descripcion: c.description || undefined,
      imagen: c.image || undefined, icono: c.color || undefined, activo: true, orden: 0, subcategorias: []
    }));
  }
  async getCategoryBySlug(slug: string) { return (await this.getCategories()).find(c => c.slug === slug); }
  async getCategoryById(id: string) { return (await this.getCategories()).find(c => c.id === id); }
  async createCategory(): Promise<never> { throw new Error('Mare es solo lectura: las categorías se administran en el CRM.'); }
  async updateCategory(): Promise<never> { throw new Error('Mare es solo lectura: las categorías se administran en el CRM.'); }
  async deleteCategory(): Promise<never> { throw new Error('Mare es solo lectura: las categorías se administran en el CRM.'); }
}
export const categoriesService = new CategoriesService();
export const getCategories = () => categoriesService.getCategories();
