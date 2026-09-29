import { supabase, isConfigured } from '../lib/supabase/client';
import { appConfig as defaultConfig } from '../config';

const CONFIG_STORAGE_KEY = 'mare_admin_config';
const CRM_SETTINGS_ID = 'global';

const isObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const mergeConfig = (saved: unknown) => {
  const raw = isObject(saved) ? saved : {};
  return {
    ...defaultConfig,
    ...raw,
    store: { ...defaultConfig.store, ...(isObject(raw.store) ? raw.store : {}), contact: { ...defaultConfig.store.contact, ...(isObject(raw.store?.contact) ? raw.store.contact : {}), socials: { ...defaultConfig.store.contact.socials, ...(isObject(raw.store?.contact?.socials) ? raw.store.contact.socials : {}) } } },
    currency: { ...defaultConfig.currency, ...(isObject(raw.currency) ? raw.currency : {}) },
    maintenance: { ...defaultConfig.maintenance, ...(isObject(raw.maintenance) ? raw.maintenance : {}) },
    whatsapp: { ...defaultConfig.whatsapp, ...(isObject(raw.whatsapp) ? raw.whatsapp : {}), templates: { ...defaultConfig.whatsapp.templates, ...(isObject(raw.whatsapp?.templates) ? raw.whatsapp.templates : {}) } },
    advisors: Array.isArray(raw.advisors) ? raw.advisors : defaultConfig.advisors,
    delivery: { ...defaultConfig.delivery, ...(isObject(raw.delivery) ? raw.delivery : {}), pickupLocations: Array.isArray(raw.delivery?.pickupLocations) ? raw.delivery.pickupLocations : defaultConfig.delivery.pickupLocations },
    seo: { ...defaultConfig.seo, ...(isObject(raw.seo) ? raw.seo : {}) },
    features: { ...defaultConfig.features, ...(isObject(raw.features) ? raw.features : {}) }
  };
};

class ConfigService {
  private localConfig: typeof defaultConfig;

  constructor() {
    this.localConfig = this.loadLocalConfig();
  }

  private loadLocalConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = mergeConfig(parsed);
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('Invalid local MARÉ configuration; using defaults.');
      try { localStorage.removeItem(CONFIG_STORAGE_KEY); } catch {}
    }
    return mergeConfig({});
  }

  async getConfig() {
    const config = mergeConfig(this.localConfig);
    if (!isConfigured) return config;

    try {
      const { data } = await supabase
        .from('settings')
        .select('store_config,catalog_config,currencies')
        .eq('id', CRM_SETTINGS_ID)
        .maybeSingle();

      if (data?.store_config) {
        const store = data.store_config as any;
        config.tiendaNombre = store.storeName || config.tiendaNombre;
        config.eslogan = store.slogan || config.eslogan;
        config.store = {
          ...config.store,
          name: store.storeName || config.store.name,
          slogan: store.slogan || config.store.slogan,
          contact: {
            ...config.store.contact,
            phone: store.phone || config.store.contact.phone
          }
        };
        config.delivery = {
          ...config.delivery,
          pickupLocations: Array.isArray(store.pickupLocations) ? store.pickupLocations : config.delivery.pickupLocations
        };
        config.whatsapp = {
          ...config.whatsapp,
          generalNumber: store.phone || config.whatsapp.generalNumber,
          mainNumber: store.phone || config.whatsapp.mainNumber
        };
      }

      const currencies = Array.isArray(data?.currencies) ? data.currencies as any[] : [];
      const usd = currencies.find(c => c.code === 'USD');
      if (usd?.rateToBase && Number(usd.rateToBase) > 0) {
        config.currency.exchangeRateUSD = Number(usd.rateToBase);
      }
    } catch {
      console.warn('CRM settings sync unavailable; using local catalog configuration.');
    }

    this.localConfig = mergeConfig(config);
    try { localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig)); } catch {}
    return this.localConfig;
  }

  getConfigSync() { return this.localConfig; }

  async updateConfig(newConfig: Partial<typeof defaultConfig>) {
    const updatedConfig = mergeConfig({
      ...this.localConfig,
      ...newConfig,
      features: { ...this.localConfig.features, ...(newConfig.features || {}) },
      whatsapp: { ...this.localConfig.whatsapp, ...(newConfig.whatsapp || {}) },
      delivery: { ...this.localConfig.delivery, ...(newConfig.delivery || {}) },
      currency: { ...this.localConfig.currency, ...(newConfig.currency || {}) },
      store: { ...this.localConfig.store, ...(newConfig.store || {}) }
    });
    this.localConfig = updatedConfig;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
    return updatedConfig;
  }

  async getSeoSettings() {
    const seo = (this.localConfig as any).seo;
    return seo ? { title: seo.title || seo.defaultTitle || '', description: seo.description || seo.defaultDescription || '', keywords: seo.keywords || '' } : null;
  }

  async updateSeoSettings(settings: any) {
    this.localConfig = mergeConfig({ ...this.localConfig, seo: { ...(this.localConfig as any).seo, ...settings } }) as typeof defaultConfig;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
  }

  async getStoreSettings() { return {}; }

  async updateStoreSettings(settings: Record<string, any>) {
    try {
      const existing = JSON.parse(localStorage.getItem('mare_content_settings') || '{}');
      localStorage.setItem('mare_content_settings', JSON.stringify({ ...existing, ...settings }));
    } catch {}
    window.dispatchEvent(new Event('mare_config_updated'));
  }

  async updateExchangeRate(newRate: number) {
    if (newRate <= 0) throw new Error('La tasa debe ser mayor que 0');
    this.localConfig.currency.exchangeRateUSD = newRate;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
  }
}

export const configService = new ConfigService();
