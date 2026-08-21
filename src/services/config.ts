import { supabase, isConfigured } from '../lib/supabase/client';
import { appConfig as defaultConfig } from '../config';
import { AppConfig } from '../types';

const CONFIG_STORAGE_KEY = 'mare_admin_config';

class ConfigService {
  private localConfig: typeof defaultConfig;

  constructor() {
    this.localConfig = this.loadLocalConfig();
  }

  private loadLocalConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...defaultConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading config from localStorage', e);
    }
    return defaultConfig;
  }

  /**
   * Obtiene la configuración general del sistema, sincronizando con DB
   */
  async getConfig() {
    if (!isConfigured) return this.localConfig;

    const config = { ...this.localConfig };

    try {
      // 1. Obtener tasa de cambio
      const { data: currencyData } = await supabase
        .from('currency_settings')
        .select('exchange_rate')
        .eq('is_active', true)
        .maybeSingle();

      if (currencyData) {
        config.currency.exchangeRateUSD = currencyData.exchange_rate;
      }

      // 2. Obtener configuraciones de la tienda (WhatsApp, etc)
      const { data: settingsData } = await supabase
        .from('store_settings')
        .select('key, value');

      if (settingsData) {
        settingsData.forEach(setting => {
          if (setting.key === 'whatsapp') config.whatsapp = { ...config.whatsapp, ...setting.value };
          if (setting.key === 'wholesale') config.wholesale = { ...config.wholesale, ...setting.value };
          if (setting.key === 'reservation') config.reservation = { ...config.reservation, ...setting.value };
          if (setting.key === 'delivery') config.delivery = { ...config.delivery, ...setting.value };
          if (setting.key === 'general') {
            config.tiendaNombre = setting.value.tiendaNombre || config.tiendaNombre;
            config.eslogan = setting.value.eslogan || config.eslogan;
          }
        });
      }
    } catch (e) {
      console.error('Error syncing config with Supabase:', e);
    }

    // Actualizar local para sincronía
    this.localConfig = config;
    return config;
  }

  /**
   * Obtiene la configuración sincrónica (para uso en contextos donde async no es ideal)
   */
  getConfigSync() {
    return this.localConfig;
  }

  /**
   * Actualiza la configuración local y en DB
   */
  async updateConfig(newConfig: Partial<typeof defaultConfig>) {
    this.localConfig = { ...this.localConfig, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig));

    if (isConfigured) {
      try {
        // Guardar partes específicas en store_settings
        if (newConfig.whatsapp) {
          await this.saveSetting('whatsapp', newConfig.whatsapp);
        }
        if (newConfig.wholesale) {
          await this.saveSetting('wholesale', newConfig.wholesale);
        }
        if (newConfig.reservation) {
          await this.saveSetting('reservation', newConfig.reservation);
        }
        if (newConfig.delivery) {
          await this.saveSetting('delivery', newConfig.delivery);
        }
        if (newConfig.tiendaNombre || newConfig.eslogan) {
          await this.saveSetting('general', {
            tiendaNombre: newConfig.tiendaNombre || this.localConfig.tiendaNombre,
            eslogan: newConfig.eslogan || this.localConfig.eslogan
          });
        }
      } catch (e) {
        console.error('Error saving config to Supabase:', e);
      }
    }

    window.dispatchEvent(new Event('mare_config_updated'));
    return this.localConfig;
  }

  /**
   * Obtiene la configuración de SEO
   */
  async getSeoSettings() {
    if (!isConfigured) return null;

    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching SEO settings:', error);
      return null;
    }

    return data;
  }

  /**
   * Actualiza la configuración de SEO
   */
  async updateSeoSettings(settings: any) {
    if (!isConfigured) return;

    const { data: existing } = await supabase
      .from('seo_settings')
      .select('id')
      .eq('is_active', true)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('seo_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('seo_settings')
        .insert({ ...settings, is_active: true });
      
      if (error) throw error;
    }
  }

  private async saveSetting(key: string, value: any) {
    const { error } = await supabase
      .from('store_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  }

  /**
   * Actualiza la tasa de USD en Supabase
   */
  async updateExchangeRate(newRate: number): Promise<void> {
    if (newRate <= 0) throw new Error("La tasa debe ser mayor que 0");

    if (isConfigured) {
      // Primero verificamos si existe un registro activo
      const { data: existing } = await supabase
        .from('currency_settings')
        .select('id')
        .eq('is_active', true)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('currency_settings')
          .update({ exchange_rate: newRate, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('currency_settings')
          .insert({
            base_currency: 'CUP',
            target_currency: 'USD',
            exchange_rate: newRate,
            is_active: true
          });
        
        if (error) throw error;
      }
    }

    // Actualizamos en local temporalmente para sincronía
    this.localConfig.currency.exchangeRateUSD = newRate;
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.localConfig));
    window.dispatchEvent(new Event('mare_config_updated'));
  }

  /**
   * Obtiene configuraciones genéricas de la tienda
   */
  async getStoreSettings() {
    if (!isConfigured) return {};
    
    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value');
      
    if (error) throw error;
    
    return (data || []).reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  }

  /**
   * Actualiza configuraciones genéricas de la tienda
   */
  async updateStoreSettings(settings: Record<string, any>) {
    if (!isConfigured) return;
    
    for (const [key, value] of Object.entries(settings)) {
      await this.saveSetting(key, value);
    }
  }
}

export const configService = new ConfigService();
