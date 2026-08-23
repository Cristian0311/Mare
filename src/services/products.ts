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
      activo: p.activo !== undefined ? p.activo : true,
      available: p.available !== undefined ? p.available : (p.disponibilidad !== 'agotado')
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
        precioMN: wc.price_cup,
        unidadesPorPresentacion: wc.units_per_presentation || 1
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
      // Mapeo inteligente de categorías jerárquicas - REFORZADO
      categoria: dbProduct.categories?.parent_id ? dbProduct.categories.parent_id : dbProduct.category_id,
      subcategoria: dbProduct.categories?.parent_id ? dbProduct.category_id : '',
      categoria_id: dbProduct.category_id,
      categoriaNombre: dbProduct.categories?.name,
      etiquetas: Array.isArray(dbProduct.tags) ? dbProduct.tags : [],
      estado: 'nuevo',
      // Fuente única de verdad para disponibilidad (Manual)
      available: dbProduct.available !== false,
      disponibilidad: dbProduct.available === false ? 'agotado' : 'disponible',
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
    collection?: 'ofertas' | 'novedades' | 'destacados' | 'mayorista' | 'todos';
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    brands?: string[];
    tags?: string[];
    disponibilidad?: ('disponible' | 'agotado')[];
    estado?: string[];
  } = {}): Promise<PaginatedProducts> {
    const { 
      category, 
      subcategoryId, 
      tag, 
      search, 
      limit = 12, 
      offset = 0,
      sort = 'newest',
      collection,
      minPrice,
      maxPrice,
      brand,
      brands,
      tags,
      disponibilidad,
      estado
    } = options;

    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug, parent_id), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)', { count: 'exact' })
      .eq('status', 'active');

    // Filtros de Colección Directos en Supabase
    if (collection === 'ofertas') {
      query = query.gt('compare_at_price_cup', 0);
    } else if (collection === 'novedades') {
      // Priorizar productos marcados como nuevos o por fecha reciente
      query = query.order('is_new', { ascending: false }).order('created_at', { ascending: false });
    } else if (collection === 'destacados') {
      // Priorizar productos destacados o más populares sin ocultar el catálogo
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    } else if (collection === 'mayorista') {
      query = query.eq('product_type', 'wholesale');
    }

    // Filtros de Rango de Precio y Marca
    if (minPrice !== undefined && minPrice !== null) {
      query = query.gte('price_cup', minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      query = query.lte('price_cup', maxPrice);
    }
    if (brand && brand !== '') {
      query = query.ilike('brand', `%${brand}%`);
    } else if (brands && brands.length > 0) {
      query = query.in('brand', brands);
    }

    // Filtro de Disponibilidad
    if (disponibilidad && disponibilidad.length > 0) {
      const wantAvailable = disponibilidad.includes('disponible');
      const wantAgotado = disponibilidad.includes('agotado');
      if (wantAvailable && !wantAgotado) {
        query = query.eq('available', true);
      } else if (wantAgotado && !wantAvailable) {
        query = query.eq('available', false);
      }
    }

    // Filtro de Estado
    if (estado && estado.length > 0) {
      if (estado.includes('nuevo')) {
        query = query.eq('is_new', true);
      }
      if (estado.includes('oferta')) {
        query = query.gt('compare_at_price_cup', 0);
      }
      if (estado.includes('destacado')) {
        query = query.eq('is_featured', true);
      }
      if (estado.includes('mayorista')) {
        query = query.eq('product_type', 'wholesale');
      }
    }

    // Filtro de Etiquetas
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    // Jerarquía de Categorías y Subcategorías
    if (subcategoryId) {
      // Si hay subcategoría, filtramos por ese ID específico (o slug)
      if (isUUID(subcategoryId)) {
        query = query.eq('category_id', subcategoryId);
      } else {
        const { data: subcatData } = await supabase.from('categories').select('id').eq('slug', subcategoryId).maybeSingle();
        if (subcatData) query = query.eq('category_id', subcatData.id);
      }
    } else if (category) {
      // Si solo hay categoría, buscamos productos de esa categoría O de cualquiera de sus subcategorías
      const catQuery = supabase.from('categories').select('id');
      const { data: catData } = isUUID(category)
        ? await catQuery.eq('id', category).maybeSingle()
        : await catQuery.eq('slug', category).maybeSingle();
      
      if (catData) {
        // Obtener IDs de todas las subcategorías
        const { data: subcats } = await supabase.from('categories').select('id').eq('parent_id', catData.id);
        const catIds = [catData.id, ...(subcats || []).map(s => s.id)];
        query = query.in('category_id', catIds);
      }
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // BUSCADOR REAL (Fase 7-12) & SEMÁNTICO (Vectores IA)
    if (search && search.trim()) {
      const cleanSearch = search.trim().toLowerCase();
      let matchedSemanticIds: string[] = [];

      try {
        // Intentar búsqueda semántica llamando a nuestro backend
        const embedRes = await fetch('/api/ai/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanSearch })
        });
        
        if (embedRes.ok) {
          const { embedding } = await embedRes.json();
          if (embedding && embedding.length > 0) {
            // Buscamos productos similares usando la función pgvector de Supabase
            const { data: semData, error: semErr } = await supabase.rpc('match_products', {
              query_embedding: embedding,
              match_threshold: 0.3, // Umbral para coincidencia
              match_count: 20
            });
            if (!semErr && semData) {
              matchedSemanticIds = semData.map((d: any) => d.id);
            }
          }
        }
      } catch (e) {
        console.warn('Semantic search fallback:', e);
      }
      
      // Intentamos identificar si el usuario busca una categoría directamente
      const { data: matchedCats } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${cleanSearch}%`);
      
      const matchedCatIds = (matchedCats || []).map(c => c.id);

      let orClauses = [
        `name.ilike.%${cleanSearch}%`,
        `tags.cs.{"${cleanSearch}"}`,
        `description.ilike.%${cleanSearch}%`
      ];

      if (matchedCatIds.length > 0) {
        orClauses.push(`category_id.in.(${matchedCatIds.join(',')})`);
      }
      
      if (matchedSemanticIds.length > 0) {
        orClauses.push(`id.in.(${matchedSemanticIds.join(',')})`);
      }
      
      query = query.or(orClauses.join(','));
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
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, count, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase Query Error:', error);
      throw error;
    }

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
      .select('*, categories(id, name, slug, parent_id), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
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
      .select('*, categories(id, name, slug, parent_id), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
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
      .select('*, categories(id, name, slug, parent_id), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
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
        .select('*, categories(id, name, slug, parent_id), product_images(storage_path, is_primary, sort_order), wholesale_configs(*)')
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

    // Prepare payload
    const insertPayload: any = {
      name: product.nombre,
      slug,
      description: product.descripcionCompleta || product.descripcionCorta,
      // Priorizar subcategoría si existe, de lo contrario usar categoría principal
      category_id: (product.subcategoria && product.subcategoria !== '') 
        ? product.subcategoria 
        : ((product.categoria && product.categoria !== '') ? product.categoria : null),
      tags: product.etiquetas || [],
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
      // Sincronización de disponibilidad manual (Fuente Única de Verdad)
      available: product.available !== false,
      availability_status: product.available === false ? 'out_of_stock' : 'available',
      sort_order: product.orden || 0,
      opciones_variantes: product.opcionesVariantes || [],
      variantes: product.variantes || []
    };

    // Forzar limpieza de category_id si no es un UUID válido
    if (insertPayload.category_id && !isUUID(insertPayload.category_id)) {
      insertPayload.category_id = null;
    }

    // Insert Product
    let { data: insertData, error: prodError } = await supabase
      .from('products')
      .insert(insertPayload)
      .select();

    // If error due to missing jsonb columns (before schema migration execution), retry without variant jsonb fields
    if (prodError && (prodError.message?.includes('opciones_variantes') || prodError.message?.includes('variantes') || prodError.message?.includes('tags'))) {
      delete insertPayload.opciones_variantes;
      delete insertPayload.variantes;
      delete insertPayload.tags;
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
      const pres = String(product.ventaMayorista.presentacion || '').toLowerCase();
      if (pres === 'caja') unitType = 'box';
      else if (pres === 'paquete') unitType = 'package';
      else if (pres === 'lote') unitType = 'lot';
      else if (pres === 'cantidad') unitType = 'quantity';

      let wsPayload: any = {
        product_id: dbProduct.id,
        unit_type: unitType,
        min_quantity: product.ventaMayorista.cantidadMinima || 1,
        price_cup: product.ventaMayorista.precioMN || 0,
        units_per_presentation: product.ventaMayorista.unidadesPorPresentacion || 1,
        status: 'active'
      };

      let { error: wsError } = await supabase
        .from('wholesale_configs')
        .insert(wsPayload);
        
      if (wsError && wsError.message?.includes('units_per_presentation')) {
        delete wsPayload.units_per_presentation;
        const retry = await supabase.from('wholesale_configs').insert(wsPayload);
        wsError = retry.error;
      }

      if (wsError) console.error("Error inserting wholesale:", wsError);
    }

    // Sincronizar cache local para que la tienda pública se actualice al instante
    const fullNewProduct = await this.getProductById(dbProduct.id);
    if (fullNewProduct) {
      this.localProducts = [fullNewProduct, ...this.localProducts];
      this.updateLocalCache(this.localProducts);
    }

    await this.syncFromSupabase();

    return fullNewProduct as Product;
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

    const updatePayload: any = {
      name: product.nombre,
      description: product.descripcionCompleta || product.descripcionCorta,
      // Priorizar subcategoría si existe, de lo contrario usar categoría principal
      category_id: (product.subcategoria && product.subcategoria !== '' && product.subcategoria !== 'undefined') 
        ? product.subcategoria 
        : ((product.categoria && product.categoria !== '' && product.categoria !== 'undefined') ? product.categoria : null),
      tags: Array.isArray(product.etiquetas) ? product.etiquetas : [],
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
      // Sincronización de disponibilidad manual (Fuente Única de Verdad)
      available: product.available !== false,
      availability_status: product.available === false ? 'out_of_stock' : 'available',
      sort_order: product.orden || 0,
      opciones_variantes: product.opcionesVariantes || [],
      variantes: product.variantes || []
    };

    // Forzar limpieza de category_id si no es un UUID válido para evitar errores 400
    if (updatePayload.category_id && !isUUID(updatePayload.category_id)) {
      updatePayload.category_id = null;
    }

    let { error: prodError } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', product.id);

    // Fallback if missing column before migration
    if (prodError && (prodError.message?.includes('opciones_variantes') || prodError.message?.includes('variantes') || prodError.message?.includes('tags'))) {
      delete updatePayload.opciones_variantes;
      delete updatePayload.variantes;
      delete updatePayload.tags;
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

      let wsPayload: any = {
        product_id: product.id,
        unit_type: unitType,
        min_quantity: product.ventaMayorista.cantidadMinima || 1,
        price_cup: product.ventaMayorista.precioMN || 0,
        units_per_presentation: product.ventaMayorista.unidadesPorPresentacion || 1,
        status: 'active'
      };

      let { error: wsError } = await supabase
        .from('wholesale_configs')
        .insert(wsPayload);
        
      if (wsError && wsError.message?.includes('units_per_presentation')) {
        delete wsPayload.units_per_presentation;
        const retry = await supabase.from('wholesale_configs').insert(wsPayload);
        wsError = retry.error;
      }
      
      if (wsError) console.error("Error inserting wholesale:", wsError);
    }

    // Sincronizar cache local inmediatamente para evitar retrasos en la UI
    this.localProducts = this.localProducts.map(p => p.id === product.id ? { ...p, ...product } : p);
    this.updateLocalCache(this.localProducts);

    // Sincronizar con Supabase en segundo plano (no bloqueante)
    this.syncFromSupabase().catch(console.error);
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
