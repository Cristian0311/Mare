import { supabase, isConfigured } from '../lib/supabase/client';
import { Product, PaginatedProducts } from '../types';

const CACHE_KEY = 'mare_catalog_cache';
const BRANCH_ID = '871e7074-dbea-48dc-ae1e-f1570b5e0047';

const slugify = (value: string) => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

class ProductService {
  private readCache(): Product[] { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'); } catch { return []; } }
  private writeCache(products: Product[]) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(products)); } catch {} }

  private async stockMap(ids: string[]) {
    if (!ids.length) return new Map<string, number>();
    const { data, error } = await supabase.from('inventory').select('product_id,quantity').eq('branch_id', BRANCH_ID).in('product_id', ids);
    if (error) throw error;
    const map = new Map<string, number>();
    for (const row of data || []) map.set(row.product_id, (map.get(row.product_id) || 0) + Number(row.quantity || 0));
    return map;
  }

  private map(row: any, stocks: Map<string, number>): Product {
    const stock = stocks.get(row.id) ?? 0;
    const active = row.status !== 'inactive';
    const available = active && stock > 0;
    return {
      id: row.id,
      slug: `${slugify(row.name)}-${String(row.id).slice(-6)}`,
      nombre: row.name,
      precioMN: Number(row.price || 0),
      imagenes: row.image ? [row.image] : [],
      descripcionCorta: '',
      descripcionCompleta: '',
      categoria: row.category_id || '',
      categoria_id: row.category_id || undefined,
      categoriaNombre: row.categories?.name,
      etiquetas: [],
      disponibilidad: available ? 'disponible' : 'agotado',
      available,
      sku: row.sku || undefined,
      stockVisual: stock,
      stock,
      stock_actual: stock,
      precioCUP: Number(row.price || 0),
      stock_tracking: true,
      stock_quantity: stock,
      reserved_quantity: 0,
      low_stock_threshold: Number(row.min_stock_alert || 0),
      availability_status: available ? 'available' : 'out_of_stock',
      nuevo: false, oferta: false, destacado: false, masVendido: false,
      fechaCreacion: row.created_at, orden: 0, activo: active,
      opcionesVariantes: [],
      variantes: []
    };
  }

  private query() {
    return supabase.from('products').select('id,name,sku,price,category_id,status,min_stock_alert,image,created_at,categories(id,name)');
  }

  async getPaginatedProducts(options: any = {}): Promise<PaginatedProducts> {
    if (!isConfigured) {
      const cached = this.readCache();
      return { products: cached, total: cached.length, hasMore: false, nextOffset: cached.length };
    }
    const { limit = 12, offset = 0, category, search, minPrice, maxPrice, sort = 'newest' } = options;
    let q: any = this.query().eq('status', 'active');
    if (search?.trim()) q = q.or(`name.ilike.%${search.trim()}%,sku.ilike.%${search.trim()}%,barcode.ilike.%${search.trim()}%`);
    if (minPrice != null) q = q.gte('price', minPrice);
    if (maxPrice != null) q = q.lte('price', maxPrice);
    if (category) q = q.eq('category_id', category);
    q = sort === 'price-asc' ? q.order('price', { ascending: true }) : sort === 'price-desc' ? q.order('price', { ascending: false }) : q.order('created_at', { ascending: false });
    const { data, error } = await q.range(offset, offset + limit - 1);
    if (error) throw error;
    const stocks = await this.stockMap((data || []).map((p:any) => p.id));
    const products = (data || []).map((p:any) => this.map(p, stocks));
    if (offset === 0) this.writeCache(products);
    return { products, total: offset + products.length, hasMore: products.length === limit, nextOffset: offset + products.length };
  }

  async getAllProducts(): Promise<Product[]> {
    if (!isConfigured) return this.readCache();
    const { data, error } = await this.query().eq('status', 'active').order('created_at', { ascending: false });
    if (error) throw error;
    const products = (data || []).map((p:any) => p);
    const stocks = await this.stockMap(products.map((p:any) => p.id));
    const mapped = products.map((p:any) => this.map(p, stocks));
    this.writeCache(mapped);
    return mapped;
  }

  async getProducts() { return this.getAllProducts(); }
  async getProductById(id: string) {
    if (!isConfigured) return this.readCache().find(p => p.id === id);
    const { data, error } = await this.query().eq('id', id).maybeSingle();
    if (error || !data) return undefined;
    return this.map(data, await this.stockMap([id]));
  }
  async getProductBySlug(slug: string) { return (await this.getAllProducts()).find(p => p.slug === slug); }
  async getProductsByCategory(categoryId: string) { return (await this.getAllProducts()).filter(p => p.categoria === categoryId); }

  async createProduct(): Promise<never> { throw new Error('Mare es solo lectura: administra productos en el CRM.'); }
  async updateProduct(): Promise<never> { throw new Error('Mare es solo lectura: administra productos en el CRM.'); }
  async deleteProduct(): Promise<never> { throw new Error('Mare es solo lectura: administra productos en el CRM.'); }
}

export const productService = new ProductService();
export const getProducts = () => productService.getProducts();
export const getProductById = (id: string) => productService.getProductById(id);
export const getProductBySlug = (slug: string) => productService.getProductBySlug(slug);
