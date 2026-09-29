import { supabase, isConfigured } from '../lib/supabase/client';
import { appConfig as defaultConfig } from '../config';

const CONFIG_STORAGE_KEY = 'mare_admin_config';
const CRM_SETTINGS_ID = 'global';

class ConfigService {
  private localConfig: typeof defaultConfig;

  constructor() {
    this.localConfig = this.loadLocalConfig();
  }

  private loadLocalConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading local config:', e);
    }
    return defaultConfig;
  }

  async getConfig() {
    const config = { ...this.localConfig };
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
        config.store = { ...config.store, name: store.storeName || config.store.name, slogan: store.slogan || config.store.slogan, contact: { ...config.store.contact, phone: store.phone || config.store.contact.phone } };
        config.delivery = { ...config.delivery, pickupLocations: store.pickupLocations || config.delivery.pickupLocations };
        config.whatsapp = { ...config.whatsapp, generalNumber: store.phone || config.whatsapp.generalNumber, mainNumber: store.phone || config.whatsapp.mainNumber };
      }

      const currencies = (data?.currencies || []) as any[];
      const usd = currencies.find(c => c.code === 'USD');
      if (usd?.rateToBase) config.currency.exchangeRateUSD = Number(usd.rateToBase);
    } catch (e) {
      // CRM schema/RLS differences must never break the public catalog.
      console.warn('CRM settings sync unavailable; using local catalog configuration.');
    }

    this.localConfig = config;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    return config;
  }

  getConfigSync() {
    return this.localConfig;
  }

  async updateConfig(newConfig: Partial<typeof defaultConfig>) {
    const updatedConfig = { ...this.localConfig, ...newConfig };
    if (newConfig.features) updatedConfig.features = { ...this.localConfig.features, ...newConfig.features };
    if (newConfig.whatsapp) updatedConfig.whatsapp = { ...this.localConfig.whatsapp, ...newConfig.whatsapp };
    if (newConfig.delivery) updatedConfig.delivery = { ...this.localConfig.delivery, ...newConfig.delivery };
    if (newConfig.currency) updatedConfig.currency = { ...this.localConfig.currency, ...newConfig.currency };
    if (newConfig.store) updatedConfig.store = { ...this.localConfig.store, ...newConfig.store };

    this.localConfig = updatedConfig;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
    return updatedConfig;
  }

  async getSeoSettings() {
    const seo = (this.localConfig as any).seo;
    return seo ? {
      title: seo.title || seo.defaultTitle || '',
      description: seo.description || seo.defaultDescription || '',
      keywords: seo.keywords || ''
    } : null;
  }

  async updateSeoSettings(settings: any) {
    this.localConfig = {
      ...this.localConfig,
      seo: { ...(this.localConfig as any).seo, ...settings }
    } as typeof defaultConfig;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
  }

  async getStoreSettings() {
    // Mare no mantiene una tabla de configuración propia.
    // El contenido editable permanece local hasta que exista un endpoint CRM explícito.
    return {};
  }

  async updateStoreSettings(settings: Record<string, any>) {
    try {
      const existing = JSON.parse(localStorage.getItem('mare_content_settings') || '{}');
      localStorage.setItem('mare_content_settings', JSON.stringify({ ...existing, ...settings }));
    } catch {}
    window.dispatchEvent(new Event('mare_config_updated'));
  }

  async updateExchangeRate(newRate: number): Promise<void> {
    if (newRate <= 0) throw new Error('La tasa debe ser mayor que 0');
    this.localConfig.currency.exchangeRateUSD = newRate;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
  }
}

export const configService = new ConfigService();
