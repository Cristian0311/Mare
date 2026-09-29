import { supabase,isConfigured } from '../lib/supabase/client';
import { Category } from '../types/category';

const CACHE_KEY='mare_categories_cache';
const slugify=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

class CategoriesService {
  private readCache():Category[] {
    try {
      const raw=localStorage.getItem(CACHE_KEY);
      const parsed=raw?JSON.parse(raw):[];
      return Array.isArray(parsed)?parsed:[];
    } catch { return []; }
  }
  private writeCache(categories:Category[]) {
    try { localStorage.setItem(CACHE_KEY,JSON.stringify(categories)); } catch {}
  }
  getCategoriesSync():Category[] { return this.readCache(); }

  async getCategories():Promise<Category[]> {
    if(!isConfigured) return this.readCache();
    const {data,error}=await supabase.from('categories').select('id,name,department,description,color,image').order('name');
    if(error) throw error;
    const mapped=(data||[]).map((c:any)=>({
      id:c.id,
      nombre:c.name,
      slug:slugify(c.name),
      descripcion:c.description||undefined,
      imagen:c.image||undefined,
      icono:c.color||undefined,
      activo:true,
      orden:0,
      subcategorias:[]
    }));
    this.writeCache(mapped);
    return mapped;
  }

  async hydrate():Promise<Category[]> {
    try {
      const categories=await this.getCategories();
      if(typeof window!=='undefined') window.dispatchEvent(new Event('mare_categories_updated'));
      return categories;
    } catch(error) {
      console.warn('CRM categories unavailable; using cached categories.',error);
      return this.readCache();
    }
  }

  async getCategoryBySlug(slug:string){ return (await this.getCategories()).find(c=>c.slug===slug); }
  async getCategoryById(id:string){ return (await this.getCategories()).find(c=>c.id===id); }
  async getAllCategories(){ return this.getCategories(); }
}

export const categoriesService=new CategoriesService();
export const categoryService=categoriesService;
export const getCategories=()=>categoriesService.getCategories();
