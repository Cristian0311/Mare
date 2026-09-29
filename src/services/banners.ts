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

  constructor() {
    try {
      const saved = localStorage.getItem('mare_banners_cache');
      if (saved) this.localBanners = JSON.parse(saved);
    } catch {}
  }

  async getBanners(): Promise<Banner[]> {
    return this.localBanners;
  }

  async getActiveBanners(): Promise<Banner[]> {
    return this.localBanners.filter(b => b.active);
  }

  async createBanner(): Promise<never> {
    throw new Error('Los banners se administran fuera de Mare.');
  }

  async updateBanner(): Promise<never> {
    throw new Error('Los banners se administran fuera de Mare.');
  }

  async deleteBanner(): Promise<never> {
    throw new Error('Los banners se administran fuera de Mare.');
  }
}

export const bannerService = new BannerService();
