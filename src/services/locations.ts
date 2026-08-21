import { supabase, isConfigured } from '../lib/supabase/client';
import { cubaLocations, Province, Municipality } from '../data/cubaLocations';

const LOCATIONS_STORAGE_KEY = 'mare_admin_locations';

class LocationService {
  private localLocations: Province[];

  constructor() {
    this.localLocations = this.loadLocalLocations();
  }

  private loadLocalLocations(): Province[] {
    try {
      const saved = localStorage.getItem(LOCATIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading locations from localStorage', e);
    }
    return [...cubaLocations];
  }

  /**
   * Obtiene todas las provincias (incluso las inactivas, para el admin)
   */
  async getAllProvinces(): Promise<Province[]> {
    if (!isConfigured) return this.localLocations;

    const { data, error } = await supabase
      .from('provinces')
      .select('*, municipalities(*)')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching provinces:', error);
      return this.localLocations;
    }

    if (!data || data.length === 0) {
      // Intentar semilla si está vacío y somos admin (esto es un fallback)
      return this.localLocations;
    }

    return data.map(this.mapDbProvince);
  }

  getAllProvincesSync(): Province[] {
    return this.localLocations;
  }

  /**
   * Obtiene todas las provincias activas (para el cliente)
   */
  async getProvinces(): Promise<Province[]> {
    if (!isConfigured) return this.localLocations.filter(p => p.activa);

    const { data, error } = await supabase
      .from('provinces')
      .select('*, municipalities(*)')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching active provinces:', error);
      return this.localLocations.filter(p => p.activa);
    }

    return data.map(this.mapDbProvince);
  }

  getProvincesSync(): Province[] {
    return this.localLocations.filter(p => p.activa);
  }

  /**
   * Obtiene los municipios activos de una provincia
   */
  async getMunicipalitiesByProvince(provinceId: string): Promise<Municipality[]> {
    if (!isConfigured) {
      const province = this.localLocations.find(p => p.id === provinceId || p.nombre === provinceId);
      return province ? province.municipios.filter(m => m.activo) : [];
    }

    const { data, error } = await supabase
      .from('municipalities')
      .select('*')
      .eq('province_id', provinceId)
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching municipalities:', error);
      return [];
    }

    return data.map(this.mapDbMunicipality);
  }

  getMunicipalitiesByProvinceSync(provinceId: string): Municipality[] {
    const province = this.localLocations.find(p => p.id === provinceId || p.nombre === provinceId);
    return province ? province.municipios.filter(m => m.activo) : [];
  }

  /**
   * Actualiza el estado de una provincia
   */
  async toggleProvince(provinceId: string, activa: boolean): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase
        .from('provinces')
        .update({ status: activa ? 'active' : 'inactive', updated_at: new Date().toISOString() })
        .eq('id', provinceId);
      
      if (error) throw error;
    }

    // Sincronizar local
    this.localLocations = this.localLocations.map(p => 
      p.id === provinceId ? { ...p, activa } : p
    );
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(this.localLocations));
    window.dispatchEvent(new Event('mare_locations_updated'));
  }

  /**
   * Actualiza el estado de un municipio
   */
  async toggleMunicipality(provinceId: string, municipalityName: string, activo: boolean): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase
        .from('municipalities')
        .update({ status: activo ? 'active' : 'inactive', updated_at: new Date().toISOString() })
        .eq('province_id', provinceId)
        .eq('name', municipalityName);
      
      if (error) throw error;
    }

    this.localLocations = this.localLocations.map(p => {
      if (p.id === provinceId || p.nombre === provinceId) {
        return {
          ...p,
          municipios: p.municipios.map(m => 
            m.nombre === municipalityName ? { ...m, activo } : m
          )
        };
      }
      return p;
    });
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(this.localLocations));
    window.dispatchEvent(new Event('mare_locations_updated'));
  }

  /**
   * Actualiza el precio de entrega de un municipio
   */
  async updateMunicipalityPrice(provinceId: string, municipalityName: string, precioEntregaMN: number): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase
        .from('municipalities')
        .update({ 
          delivery_fee_cup: precioEntregaMN, 
          updated_at: new Date().toISOString() 
        })
        .eq('province_id', provinceId)
        .eq('name', municipalityName);
      
      if (error) throw error;
    }

    this.localLocations = this.localLocations.map(p => {
      if (p.id === provinceId || p.nombre === provinceId) {
        return {
          ...p,
          municipios: p.municipios.map(m => 
            m.nombre === municipalityName ? { ...m, precioEntregaMN } : m
          )
        };
      }
      return p;
    });
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(this.localLocations));
    window.dispatchEvent(new Event('mare_locations_updated'));
  }

  private mapDbProvince(db: any): Province {
    return {
      id: db.id,
      nombre: db.name,
      activa: db.status === 'active',
      municipios: (db.municipalities || []).map((m: any) => ({
        id: m.id,
        nombre: m.name,
        activo: m.status === 'active',
        precioEntregaMN: Number(m.delivery_fee_cup)
      }))
    };
  }

  private mapDbMunicipality(db: any): Municipality {
    return {
      id: db.id,
      nombre: db.name,
      activo: db.status === 'active',
      precioEntregaMN: Number(db.delivery_fee_cup)
    };
  }
}

export const locationService = new LocationService();
