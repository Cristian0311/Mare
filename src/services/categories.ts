import { supabase, isConfigured } from '../lib/supabase/client';
import { Category, Subcategory } from '../types';
import { categories as defaultCategories } from '../data/categories';

const CATEGORIES_STORAGE_KEY = 'mare_admin_categories';

class CategoryService {
  private localCategories: Category[];

  constructor() {
    this.localCategories = this.loadLocalCategories();
    // Background sync on init if configured
    if (isConfigured) {
      this.syncFromSupabase();
    }
  }

  private loadLocalCategories(): Category[] {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Calcular el total de subcategorías tanto en local como en los datos por defecto
        const countSubcats = (cats: Category[]) => 
          cats.reduce((acc, cat) => acc + (cat.subcategorias?.length || 0), 0);
          
        const localSubcatCount = countSubcats(parsed);
        const defaultSubcatCount = countSubcats(defaultCategories);

        const hasRopa = parsed.some((c: any) => c.id === 'ropa');
        const hasNewHogar = parsed.some((c: any) => c.id === 'hogar');
        
        // Migrar si faltan categorías clave, si el número de categorías principales cambió,
        // o si el número total de subcategorías ha cambiado (nuevo en esta actualización)
        if (!hasRopa || !hasNewHogar || parsed.length !== defaultCategories.length || localSubcatCount !== defaultSubcatCount) {
          console.log('Detectada discrepancia en categorías o subcategorías. Migrando caché local...');
          const migrated = defaultCategories.map(c => ({
            ...c,
            activo: c.activo !== undefined ? c.activo : true,
            orden: c.orden || 0
          }));
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }
    return defaultCategories.map(c => ({
      ...c,
      activo: c.activo !== undefined ? c.activo : true,
      orden: 0
    }));
  }

  /**
   * Fuerza la restauración de las categorías a los valores por defecto definidos en el código.
   * Útil cuando el usuario quiere sincronizar cambios estructurales hechos en src/data/categories.ts
   */
  async resetToDefaults(): Promise<Category[]> {
    const migrated = defaultCategories.map(c => ({
      ...c,
      activo: c.activo !== undefined ? c.activo : true,
      orden: 0
    }));
    this.updateLocalCache(migrated);
    return migrated;
  }

  private updateLocalCache(categories: Category[]) {
    this.localCategories = categories.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(this.localCategories));
    window.dispatchEvent(new Event('mare_categories_updated'));
  }

  private async syncFromSupabase() {
    if (!isConfigured) return;
    try {
      // Smart Sync Verification
      const localMetaStr = localStorage.getItem('mare_categories_meta');
      const localMeta = localMetaStr ? JSON.parse(localMetaStr) : null;
      
      const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      const { data: latest } = await supabase.from('categories').select('updated_at').order('updated_at', { ascending: false }).limit(1);
      
      const remoteCount = count || 0;
      const remoteMaxUpdated = latest?.[0]?.updated_at || '';

      if (localMeta && localMeta.count === remoteCount && localMeta.maxUpdated === remoteMaxUpdated) {
        // Cache is up to date, skip downloading all categories
        return;
      }

      // Changes detected, download full
      const categories = await this.getAllCategories();
      this.updateLocalCache(categories);

      // Save new meta
      localStorage.setItem('mare_categories_meta', JSON.stringify({ count: remoteCount, maxUpdated: remoteMaxUpdated }));
    } catch (e) {
      console.error('Failed to sync categories:', e);
    }
  }

  private mapCategory(dbCategory: any, allDbCategories: any[] = []): Category {
    const subcategorias = allDbCategories
      .filter(c => c.parent_id === dbCategory.id)
      .map(sub => ({
        id: sub.id,
        nombre: sub.name,
        slug: sub.slug
      } as Subcategory));

    return {
      id: dbCategory.id,
      parent_id: dbCategory.parent_id,
      nombre: dbCategory.name,
      slug: dbCategory.slug,
      descripcion: dbCategory.description,
      imagen: dbCategory.image_path,
      icono: dbCategory.icon,
      activo: dbCategory.status === 'active',
      orden: dbCategory.sort_order || 0,
      subcategorias: subcategorias.length > 0 ? subcategorias : undefined
    };
  }

  async getAllCategories(flat: boolean = false): Promise<Category[]> {
    if (!isConfigured) {
      if (flat) {
        const all: Category[] = [];
        this.localCategories.forEach(cat => {
          all.push(cat);
          if (cat.subcategorias) {
            cat.subcategorias.forEach(sub => {
              all.push({
                id: sub.id,
                parent_id: cat.id,
                nombre: sub.nombre,
                slug: sub.slug,
                activo: true,
                orden: 0
              } as Category);
            });
          }
        });
        return all.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      }
      return this.localCategories.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      // Avoid logging schema cache / table missing errors when using local fallback
      if (error.message && error.code !== 'PGRST205' && !error.message.includes('schema cache')) {
        console.error('Error fetching categories from Supabase, falling back to local:', error);
      }
      return this.localCategories.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }

    if (flat) {
      return data.map(c => this.mapCategory(c));
    }

    const parents = data.filter(c => !c.parent_id);
    return parents.map(p => this.mapCategory(p, data));
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.getAllCategories();
    return categories.filter(c => c.activo !== false);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const category = this.localCategories.find(c => c.slug === slug);
      if (!category || category.activo === false) return undefined;
      return category;
    }

    if (data.status !== 'active') return undefined;

    return this.mapCategory(data);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return this.localCategories.find(c => c.id === id);
    }

    return this.mapCategory(data);
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    if (!isConfigured) {
      const newCat: Category = {
        id: category.id || 'cat-' + Date.now(),
        nombre: category.nombre || '',
        slug: category.slug || '',
        descripcion: category.descripcion || '',
        imagen: category.imagen,
        activo: category.activo !== false,
        orden: category.orden || 0,
        subcategorias: category.subcategorias || []
      };
      const updated = [...this.localCategories, newCat];
      this.updateLocalCache(updated);
      return newCat;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.nombre,
        parent_id: category.parent_id || null,
        slug: category.slug,
        description: category.descripcion,
        image_path: category.imagen,
        status: category.activo ? 'active' : 'inactive',
        sort_order: category.orden || 0
      })
      .select();

    if (error) throw error;
    
    // Handle cases where INSERT succeeds but SELECT returns 0 rows (PGRST116 prevention)
    const resultData = (data && data.length > 0) ? data[0] : {
      id: category.id || 'new-id',
      name: category.nombre,
      slug: category.slug,
      description: category.descripcion,
      image_path: category.imagen,
      status: category.activo ? 'active' : 'inactive',
      sort_order: category.orden || 0
    };

    await this.syncFromSupabase();
    return this.mapCategory(resultData);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    if (!isConfigured) {
      const updated = this.localCategories.map(c => {
        if (c.id === id) {
          return {
            ...c,
            nombre: category.nombre !== undefined ? category.nombre : c.nombre,
            slug: category.slug !== undefined ? category.slug : c.slug,
            descripcion: category.descripcion !== undefined ? category.descripcion : c.descripcion,
            imagen: category.imagen !== undefined ? category.imagen : c.imagen,
            activo: category.activo !== undefined ? category.activo : c.activo,
            orden: category.orden !== undefined ? category.orden : c.orden,
            subcategorias: category.subcategorias !== undefined ? category.subcategorias : c.subcategorias
          };
        }
        return c;
      });
      this.updateLocalCache(updated);
      const found = updated.find(c => c.id === id);
      if (!found) throw new Error("Category not found");
      return found;
    }

    const updates: any = {};
    if (category.nombre !== undefined) updates.name = category.nombre;
    if (category.slug !== undefined) updates.slug = category.slug;
    if (category.descripcion !== undefined) updates.description = category.descripcion;
    if (category.imagen !== undefined) updates.image_path = category.imagen;
    if (category.parent_id !== undefined) updates.parent_id = category.parent_id || null;
    if (category.activo !== undefined) updates.status = category.activo ? 'active' : 'inactive';
    if (category.orden !== undefined) updates.sort_order = category.orden;

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    // Handle empty results to prevent single() errors
    const resultData = (data && data.length > 0) ? data[0] : {
      id,
      ...updates
    };

    await this.syncFromSupabase();
    return this.mapCategory(resultData);
  }

  async toggleCategoryStatus(id: string, activo: boolean): Promise<void> {
    if (!isConfigured) {
      const updated = this.localCategories.map(c => {
        if (c.id === id) {
          return { ...c, activo };
        }
        return c;
      });
      this.updateLocalCache(updated);
      return;
    }

    const { error } = await supabase
      .from('categories')
      .update({ status: activo ? 'active' : 'inactive' })
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    await this.syncFromSupabase();
  }

  async deleteCategory(id: string): Promise<void> {
    if (!isConfigured) {
      let count = 0;
      try {
        const savedProducts = localStorage.getItem('mare_admin_products');
        if (savedProducts) {
          const products = JSON.parse(savedProducts);
          count = products.filter((p: any) => p.categoria === id).length;
        }
      } catch (e) {
        console.error('Error checking category products', e);
      }

      if (count > 0) {
        throw new Error("SAFE_DELETE_FAILED");
      }

      const updated = this.localCategories.filter(c => c.id !== id);
      this.updateLocalCache(updated);
      return;
    }

    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) throw countError;
    if (count && count > 0) {
      throw new Error("SAFE_DELETE_FAILED");
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await this.syncFromSupabase();
  }

  // Sync methods for legacy components (Phase 47 preserves these)
  getAllCategoriesSync(): Category[] { return this.localCategories; }
  getCategoriesSync(): Category[] { return this.localCategories.filter(c => c.activo !== false); }
  getCategoryBySlugSync(slug: string): Category | undefined { 
    const category = this.localCategories.find(c => c.slug === slug);
    if (!category || category.activo === false) return undefined;
    return category;
  }
}

export const categoryService = new CategoryService();
