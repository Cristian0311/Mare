import { supabase,isConfigured } from '../lib/supabase/client';
import { Category } from '../types/category';
const slugify=(v:string)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
class CategoriesService{
 async getCategories():Promise<Category[]>{if(!isConfigured)return[];const{data,error}=await supabase.from('categories').select('id,name,department,description,color,image').order('name');if(error)throw error;return(data||[]).map((c:any)=>({id:c.id,nombre:c.name,slug:slugify(c.name),descripcion:c.description||undefined,imagen:c.image||undefined,icono:c.color||undefined,activo:true,orden:0,subcategorias:[]}));}
 async getCategoryBySlug(s:string){return(await this.getCategories()).find(c=>c.slug===s);}
 async getCategoryById(id:string){return(await this.getCategories()).find(c=>c.id===id);}
 async getCategoriesSync(){return[] as Category[];}
 async getAllCategories(){return this.getCategories();}
}
export const categoriesService=new CategoriesService();
export const categoryService=categoriesService;
export const getCategories=()=>categoriesService.getCategories();
