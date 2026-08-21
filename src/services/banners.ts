import { supabase, isConfigured } from '../lib/supabase/client';

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

class BannerService {
  private localBanners: Banner[] = [];
  private bannersFetchedAt = 0;

  constructor() {
    this.loadLocalBanners();
  }

  private loadLocalBanners() {
    try {
      const saved = localStorage.getItem('mare_banners_cache');
      if (saved) {
        this.localBanners = JSON.parse(saved);
      }
    } catch (e) {
      // Ignore
    }
  }

  async getBanners(forceRefresh = false): Promise<Banner[]> {
    if (!isConfigured) return [];
    
    const NOW = Date.now();
    if (!forceRefresh && this.localBanners.length > 0 && (NOW - this.bannersFetchedAt < 300000)) {
      return this.localBanners;
    }

    try {
      // Smart sync check
      const localMetaStr = localStorage.getItem('mare_banners_meta');
      const localMeta = localMetaStr ? JSON.parse(localMetaStr) : null;
      
      const { count } = await supabase.from('banners').select('*', { count: 'exact', head: true });
      const { data: latest } = await supabase.from('banners').select('updated_at').order('updated_at', { ascending: false }).limit(1);
      
      const remoteCount = count || 0;
      const remoteMaxUpdated = latest?.[0]?.updated_at || '';

      if (!forceRefresh && localMeta && localMeta.count === remoteCount && localMeta.maxUpdated === remoteMaxUpdated && this.localBanners.length > 0) {
        this.bannersFetchedAt = NOW;
        return this.localBanners;
      }

      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      const mapped = data.map(this.mapDbBanner);
      this.localBanners = mapped;
      this.bannersFetchedAt = NOW;
      localStorage.setItem('mare_banners_cache', JSON.stringify(mapped));
      localStorage.setItem('mare_banners_meta', JSON.stringify({ count: remoteCount, maxUpdated: remoteMaxUpdated }));
      return mapped;
    } catch (error) {
      console.error('Error fetching banners:', error);
      return this.localBanners;
    }
  }

  async getActiveBanners(): Promise<Banner[]> {
    const all = await this.getBanners();
    return all.filter(b => b.active);
  }

  async createBanner(banner: Partial<Banner>): Promise<Banner | null> {
    const { data, error } = await supabase
      .from('banners')
      .insert([{
        title: banner.title,
        subtitle: banner.subtitle,
        image_path: banner.image,
        button_text: banner.buttonText,
        button_url: banner.link,
        status: banner.active ? 'active' : 'inactive',
        sort_order: banner.order || 0
      }])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapDbBanner(data) : null;
  }

  async updateBanner(id: string, banner: Partial<Banner>): Promise<Banner | null> {
    const updates: any = {};
    if (banner.title !== undefined) updates.title = banner.title;
    if (banner.subtitle !== undefined) updates.subtitle = banner.subtitle;
    if (banner.image !== undefined) updates.image_path = banner.image;
    if (banner.buttonText !== undefined) updates.button_text = banner.buttonText;
    if (banner.link !== undefined) updates.button_url = banner.link;
    if (banner.active !== undefined) updates.status = banner.active ? 'active' : 'inactive';
    if (banner.order !== undefined) updates.sort_order = banner.order;

    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapDbBanner(data) : null;
  }

  async deleteBanner(id: string): Promise<void> {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapDbBanner(db: any): Banner {
    return {
      id: db.id,
      title: db.title || '',
      subtitle: db.subtitle || '',
      image: db.image_path,
      buttonText: db.button_text || '',
      link: db.button_url || '',
      active: db.status === 'active',
      order: db.sort_order || 0
    };
  }
}

export const bannerService = new BannerService();
