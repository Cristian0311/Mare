import { supabase, isConfigured } from '../lib/supabase/client';
import { Product, PaginatedProducts } from '../types';
import { products as defaultProducts } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'mare_admin_products';

const isUUID = (val: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};

class ProductService {
  private localProducts: Product[];

  constructor() {
    this.localProducts = this.loadLocalProducts();
    // Background sync on init if configured
    if (isConfigured) {
      this.syncFromSupabase();
    }
  }

  private loadLocalProducts(): Product[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          let mutated = false;
          const enhanced = parsed.map((p: any) => {
            if (p.id.startsWith("PROD-") && (p.nombre.includes("Demostración") || p.imagenes?.[0]?.includes("placehold.co"))) {
              const defaultProd = defaultProducts.find(dp => dp.id === p.id);
              if (defaultProd) {
                mutated = true;
                return {
                  ...p,
                  nombre: defaultProd.nombre,
                  slug: defaultProd.slug,
                  imagenes: defaultProd.imagenes,
                  descripcionCorta: defaultProd.descripcionCorta,
                  descripcionCompleta: defaultProd.descripcionCompleta
                };
              }
            }
            return p;
          });
          if (mutated) {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(enhanced));
          }
          return enhanced;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return defaultProducts.map(p => ({
      ...p,
      activo: p.activo !== undefined ? p.activo : true
    }));
  }

  private updateLocalCache(products: Product[]) {
    this.localProducts = products;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.localProducts));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mare_products_updated'));
    }
  }

  private async syncFromSupabase() {
    if (!isConfigured) return;
    try {
      // Smart Sync Verification
      const localMetaStr = typeof localStorage !== 'undefined' ? localStorage.getItem('mare_products_meta') : null;
      const localMeta = localMetaStr ? JSON.parse(localMetaStr) : null;
      
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { data: latest } = await supabase.from('products').select('updated_at').order('updated_at', { ascending: false }).limit(1);
      
      const remoteCount = count || 0;
      const remoteMaxUpdated = latest?.[0]?.updated_at || '';

      if (localMeta && localMeta.count === remoteCount && localMeta.maxUpdated === remoteMaxUpdated) {
        // Cache is up to date, skip downloading all products
        return;
      }

      // Changes detected, download full
      const products = await this.getAllProducts();
      this.updateLocalCache(products);

      // Save new meta
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('mare_products_meta', JSON.stringify({ count: remoteCount, maxUpdated: remoteMaxUpdated }));
      }
    } catch (e) {
      console.error('Failed to sync products:', e);
    }
  }

  private mapSupabaseProduct(dbProduct: any): Product {
    // Determine status
    let availability: any = 'disponible';
    if (dbProduct.stock === 0) availability = 'agotado';
    
    // Determine wholesale
    let ventaMayorista = undefined;
    if (dbProduct.wholesale_configs && dbProduct.wholesale_configs.length > 0) {
      const wc = dbProduct.wholesale_configs[0];
      let presentacion = 'Unidad';
      if (wc.unit_type === 'box') presentacion = 'Caja';
      else if (wc.unit_type === 'package') presentacion = 'Paquete';
      else if (wc.unit_type === 'lot') presentacion = 'Lote';
      else if (wc.unit_type === 'quantity') presentacion = 'Cantidad';

      ventaMayorista = {
        habilitada: wc.status === 'active',
        presentacion,
        cantidadMinima: wc.min_quantity,
        precioMN: wc.price_cup
      };
    }

    // Images
    const sortedImages = (dbProduct.product_images || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((img: any) => img.storage_path);

    return {
      id: dbProduct.id,
      slug: dbProduct.slug,
      nombre: dbProduct.name,
      precioMN: dbProduct.price_cup,
      precioAnteriorMN: dbProduct.compare_at_price_cup || undefined,
      imagenes: sortedImages,
      descripcionCorta: dbProduct.description || '',
      descripcionCompleta: dbProduct.description || '',
      categoria: dbProduct.category_id,
      categoria_id: dbProduct.category_id,
      categoriaNombre: dbProduct.categories?.name,
      etiquetas: [],
      estado: 'nuevo',
      disponibilidad: dbProduct.availability_status || availability,
      nuevo: dbProduct.is_new || false,
      oferta: dbProduct.compare_at_price_cup > dbProduct.price_cup,
      destacado: dbProduct.is_featured || false,
      masVendido: false,
      fechaCreacion: dbProduct.created_at,
      orden: dbProduct.sort_order,
      ventaMayorista,
      activo: dbProduct.status !== 'inactive',
      
      // Inventario Avanzado (Fase 52)
      stock_tracking: dbProduct.stock_tracking || false,
      stock_quantity: dbProduct.stock_quantity || 0,
      reserved_quantity: dbProduct.reserved_quantity || 0,
      low_stock_threshold: dbProduct.low_stock_threshold || 5,
      availability_status: dbProduct.availability_status || 'available',
      sku: dbProduct.sku || '',

      // Sistema de variantes (Tallas, Colores, etc.)
      opcionesVariantes: dbProduct.opciones_variantes || [],
      variantes: dbProduct.variantes || []
    };
  }

  async getPaginatedProducts(options: {
    category?: string;
    subcategoryId?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  } = {}): Promise<PaginatedProducts> {
    const { 
      category, 
      subcategoryId, 
      tag, 
      search, 
      limit = 12, 
      offset = 0,
      sort = 'newest'
    } = options;

    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)', { count: 'exact' })
      .eq('status', 'active');

    if (subcategoryId) {
      // Find subcategory by id or slug
      const catQuery = supabase.from('categories').select('id');
      const { data: subcatData } = isUUID(subcategoryId)
        ? await catQuery.eq('id', subcategoryId).maybeSingle()
        : await catQuery.eq('slug', subcategoryId).maybeSingle();

      const subId = subcatData ? subcatData.id : subcategoryId;
      query = query.eq('category_id', subId);
    } else if (category) {
      // Try to find if category is a slug or ID
      const catQuery = supabase.from('categories').select('id');
      const { data: catData } = isUUID(category)
        ? await catQuery.eq('id', category).maybeSingle()
        : await catQuery.eq('slug', category).maybeSingle();
      
      if (catData) {
        // Also fetch all subcategories under this parent category
        const { data: childSubcats } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', catData.id);

        const catIds = [catData.id, ...(childSubcats || []).map(c => c.id)];
        if (catIds.length === 1) {
          query = query.eq('category_id', catIds[0]);
        } else {
          query = query.in('category_id', catIds);
        }
      } else if (isUUID(category)) {
        query = query.eq('category_id', category);
      }
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        query = query.order('price_cup', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price_cup', { ascending: false });
        break;
      case 'popular':
        query = query.order('views_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, count, error } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const products = (data || []).map(p => this.mapSupabaseProduct(p));
    const total = count || 0;
    
    return {
      products,
      total,
      hasMore: offset + products.length < total,
      nextOffset: offset + products.length
    };
  }

  async getAllProducts(): Promise<Product[]> {
    if (!isConfigured) return this.localProducts;

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message && error.code !== 'PGRST205' && !error.message.includes('schema cache')) {
        console.error('Error fetching products from Supabase:', error);
      }
      return this.localProducts; // Fallback
    }

    return data.map(p => this.mapSupabaseProduct(p));
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(p => p.activo !== false);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const p = this.localProducts.find(p => p.slug === slug);
      if (!p || p.activo === false) return undefined;
      return p;
    }
    
    const product = this.mapSupabaseProduct(data);
    if (product.activo === false) return undefined;
    return product;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return this.localProducts.find(p => p.id === id);
    }
    
    return this.mapSupabaseProduct(data);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!isConfigured) {
      return this.localProducts.filter(p => (p.categoria === categoryId || p.subcategoria === categoryId) && p.activo !== false);
    }

    try {
      // Find category by id or slug
      const catQuery = supabase.from('categories').select('id');
      const { data: catData } = isUUID(categoryId)
        ? await catQuery.eq('id', categoryId).maybeSingle()
        : await catQuery.eq('slug', categoryId).maybeSingle();

      const targetId = catData ? catData.id : categoryId;

      // Find subcategories if any
      const { data: childSubcats } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', targetId);

      const allCatIds = [targetId, ...(childSubcats || []).map(c => c.id)];

      let query = supabase
        .from('products')
        .select('*, categories(id, name, slug), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
        .eq('status', 'active');

      if (allCatIds.length === 1) {
        query = query.eq('category_id', allCatIds[0]);
      } else {
        query = query.in('category_id', allCatIds);
      }

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) throw error;

      return (data || []).map(p => this.mapSupabaseProduct(p)).filter(p => p.activo !== false);
    } catch (e) {
      console.error('Error in getProductsByCategory:', e);
      return this.localProducts.filter(p => (p.categoria === categoryId || p.subcategoria === categoryId) && p.activo !== false);
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'slug'>): Promise<Product> {
    // Validate inputs
    if (!product.nombre) throw new Error("Nombre requerido");
    if (product.precioMN === undefined || product.precioMN < 0) throw new Error("Precio inválido");

    const slug = product.nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substr(2, 4);

    if (!isConfigured) {
      const newProduct: Product = {
        ...product,
        id: 'prod-' + Date.now(),
        slug,
        activo: product.activo !== false,
        fechaCreacion: new Date().toISOString()
      };
      const updated = [...this.localProducts, newProduct];
      this.updateLocalCache(updated);
      return newProduct;
    }

    let product_type = 'retail';
    if (product.ventaMayorista?.habilitada) product_type = 'wholesale';

    let stock = null;
    if (product.disponibilidad === 'agotado') stock = 0;

    // Prepare payload
    const insertPayload: any = {
      name: product.nombre,
      slug,
      description: product.descripcionCompleta || product.descripcionCorta,
      category_id: product.categoria || null,
      price_cup: product.precioMN,
      compare_at_price_cup: product.precioAnteriorMN || null,
      status: product.activo === false ? 'inactive' : 'active',
      product_type,
      is_featured: product.destacado || false,
      is_new: product.nuevo || false,
      stock_tracking: product.stock_tracking || false,
      stock_quantity: product.stock_quantity || 0,
      low_stock_threshold: product.low_stock_threshold || 5,
      sku: product.sku || null,
      availability_status: product.disponibilidad,
      sort_order: product.orden || 0,
      opciones_variantes: product.opcionesVariantes || [],
      variantes: product.variantes || []
    };

    // Insert Product
    let { data: insertData, error: prodError } = await supabase
      .from('products')
      .insert(insertPayload)
      .select();

    // If error due to missing jsonb columns (before schema migration execution), retry without variant jsonb fields
    if (prodError && (prodError.message?.includes('opciones_variantes') || prodError.message?.includes('variantes'))) {
      delete insertPayload.opciones_variantes;
      delete insertPayload.variantes;
      const retry = await supabase
        .from('products')
        .insert(insertPayload)
        .select();
      insertData = retry.data;
      prodError = retry.error;
    }

    if (prodError) throw prodError;

    // Handle empty results (PGRST116 prevention)
    const dbProduct = (insertData && insertData.length > 0) ? insertData[0] : {
      id: 'temp-' + Date.now(),
      name: product.nombre,
      slug
    };

    // Insert Images
    if (product.imagenes && product.imagenes.length > 0 && dbProduct.id) {
      const imagesToInsert = product.imagenes.map((img, index) => ({
        product_id: dbProduct.id,
        storage_path: img,
        is_primary: index === 0,
        sort_order: index * 10
      }));

      const { error: imgError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);
      
      if (imgError) console.error("Error inserting images:", imgError);
    }

    // Insert Wholesale
    if (product.ventaMayorista && product.ventaMayorista.habilitada) {
      let unitType = 'unit';
      const pres = product.ventaMayorista.presentacion?.toLowerCase();
      if (pres === 'caja') unitType = 'box';
      else if (pres === 'paquete') unitType = 'package';
      else if (pres === 'lote') unitType = 'lot';
      else if (pres === 'cantidad') unitType = 'quantity';

      const { error: wsError } = await supabase
        .from('wholesale_configs')
        .insert({
          product_id: dbProduct.id,
          unit_type: unitType,
          min_quantity: product.ventaMayorista.cantidadMinima || 1,
          price_cup: product.ventaMayorista.precioMN || 0,
          status: 'active'
        });

      if (wsError) console.error("Error inserting wholesale:", wsError);
    }

    // Sincronizar cache local para que la tienda pública se actualice al instante
    await this.syncFromSupabase();

    return this.getProductById(dbProduct.id) as Promise<Product>;
  }

  async updateProduct(product: Product): Promise<void> {
    if (!product.id) throw new Error("ID requerido");

    if (!isConfigured) {
      const updated = this.localProducts.map(p => {
        if (p.id === product.id) {
          return {
            ...p,
            ...product
          };
        }
        return p;
      });
      this.updateLocalCache(updated);
      return;
    }

    let product_type = 'retail';
    if (product.ventaMayorista?.habilitada) product_type = 'wholesale';

    let stock = null;
    if (product.disponibilidad === 'agotado') stock = 0;

    const updatePayload: any = {
      name: product.nombre,
      description: product.descripcionCompleta || product.descripcionCorta,
      category_id: product.categoria || null,
      price_cup: product.precioMN,
      compare_at_price_cup: product.precioAnteriorMN || null,
      status: product.activo === false ? 'inactive' : 'active',
      product_type,
      is_featured: product.destacado || false,
      is_new: product.nuevo || false,
      stock_tracking: product.stock_tracking || false,
      stock_quantity: product.stock_quantity || 0,
      low_stock_threshold: product.low_stock_threshold || 5,
      sku: product.sku || null,
      availability_status: product.disponibilidad,
      sort_order: product.orden || 0,
      opciones_variantes: product.opcionesVariantes || [],
      variantes: product.variantes || []
    };

    let { error: prodError } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', product.id);

    // Fallback if missing column before migration
    if (prodError && (prodError.message?.includes('opciones_variantes') || prodError.message?.includes('variantes'))) {
      delete updatePayload.opciones_variantes;
      delete updatePayload.variantes;
      const retry = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', product.id);
      prodError = retry.error;
    }

    if (prodError) throw prodError;

    // Update Images: Delete all and re-insert
    await supabase.from('product_images').delete().eq('product_id', product.id);
    if (product.imagenes && product.imagenes.length > 0) {
      const imagesToInsert = product.imagenes.map((img, index) => ({
        product_id: product.id,
        storage_path: img,
        is_primary: index === 0,
        sort_order: index * 10
      }));
      await supabase.from('product_images').insert(imagesToInsert);
    }

    // Update Wholesale: Delete all and re-insert if enabled
    await supabase.from('wholesale_configs').delete().eq('product_id', product.id);
    if (product.ventaMayorista && product.ventaMayorista.habilitada) {
      let unitType = 'unit';
      const pres = product.ventaMayorista.presentacion?.toLowerCase();
      if (pres === 'caja') unitType = 'box';
      else if (pres === 'paquete') unitType = 'package';
      else if (pres === 'lote') unitType = 'lot';
      else if (pres === 'cantidad') unitType = 'quantity';

      await supabase
        .from('wholesale_configs')
        .insert({
          product_id: product.id,
          unit_type: unitType,
          min_quantity: product.ventaMayorista.cantidadMinima || 1,
          price_cup: product.ventaMayorista.precioMN || 0,
          status: 'active'
        });
    }

    // Sincronizar cache local para que la tienda pública se actualice al instante
    await this.syncFromSupabase();
  }

  async toggleProductStatus(id: string, activo: boolean): Promise<void> {
    if (!isConfigured) {
      const updated = this.localProducts.map(p => {
        if (p.id === id) {
          return { ...p, activo };
        }
        return p;
      });
      this.updateLocalCache(updated);
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({ status: activo ? 'active' : 'inactive' })
      .eq('id', id);
    if (error) throw error;
    await this.syncFromSupabase();
  }

  async deleteProduct(id: string): Promise<void> {
    if (!isConfigured) {
      let count = 0;
      try {
        const savedOrders = localStorage.getItem('mare_orders');
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          for (const order of orders) {
            if (order.productos && order.productos.some((item: any) => item.productoId === id)) {
              count++;
            }
          }
        }
      } catch (e) {
        console.error('Error checking product orders', e);
      }

      if (count > 0) {
        throw new Error("SAFE_DELETE_FAILED");
      }

      const updated = this.localProducts.filter(p => p.id !== id);
      this.updateLocalCache(updated);
      return;
    }

    // Check for related order_items
    const { count, error: countError } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', id);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error("SAFE_DELETE_FAILED");
    }

    // Delete product. Rely on ON DELETE CASCADE for images and wholesale
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    await this.syncFromSupabase();
  }

  // Fallback sync methods for public store (to be phased out in Phase 47/48)
  getAllProductsSync(): Product[] { return this.localProducts; }
  getProductsSync(): Product[] { return this.localProducts.filter(p => p.activo !== false); }
  getProductBySlugSync(slug: string): Product | undefined {
    const p = this.localProducts.find(p => p.slug === slug);
    if (!p || p.activo === false) return undefined;
    return p;
  }
}

export const productService = new ProductService();
