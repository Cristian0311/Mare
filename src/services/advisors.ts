import { supabase, isConfigured } from '../lib/supabase/client';
import { Advisor } from '../types';
import { appConfig } from '../config';

const ADVISORS_STORAGE_KEY = 'mare_admin_advisors';

const defaultAdvisors: Advisor[] = appConfig.advisors.map(a => ({
  id: a.id,
  name: a.name,
  whatsapp: a.whatsapp,
  avatarUrl: (a as any).avatar,
  isPrimary: (a as any).role === 'Principal' || (a as any).role === 'Primary',
  role: (a as any).role || 'Asesor de Ventas',
  active: a.active !== undefined ? a.active : true
}));

class AdvisorsService {
  private localAdvisors: Advisor[];

  constructor() {
    this.localAdvisors = this.loadLocalAdvisors();
  }

  private loadLocalAdvisors(): Advisor[] {
    try {
      const saved = localStorage.getItem(ADVISORS_STORAGE_KEY);
      if (saved) {
        const parsed: Advisor[] = JSON.parse(saved);
        return parsed.map(advisor => {
          const defaultMatch = defaultAdvisors.find(d => d.id === advisor.id);
          if (defaultMatch) {
            return { 
              ...advisor, 
              whatsapp: defaultMatch.whatsapp || advisor.whatsapp,
              avatarUrl: defaultMatch.avatarUrl || advisor.avatarUrl 
            };
          }
          return advisor;
        });
      }
    } catch (e) {
      console.error('Error loading advisors from localStorage', e);
    }
    return [...defaultAdvisors];
  }

  async getAllAdvisors(): Promise<Advisor[]> {
    if (!isConfigured) return this.localAdvisors;

    try {
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Si la tabla está vacía en Supabase, intentamos persistir los locales allí si es posible
        // o al menos devolvemos los locales para que no salga vacío
        return this.localAdvisors;
      }

      const mapped = data.map(db => this.mapDbAdvisor(db));
      
      // Sincronizamos con local para persistencia offline
      this.localAdvisors = mapped;
      localStorage.setItem(ADVISORS_STORAGE_KEY, JSON.stringify(mapped));
      
      return mapped;
    } catch (e) {
      console.error('Error in getAllAdvisors:', e);
      return this.localAdvisors;
    }
  }

  async getActiveAdvisors(): Promise<Advisor[]> {
    if (!isConfigured) return this.localAdvisors.filter(a => a.active);

    try {
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        return this.localAdvisors.filter(a => a.active);
      }

      return data.map(db => this.mapDbAdvisor(db));
    } catch (e) {
      console.error('Error in getActiveAdvisors:', e);
      return this.localAdvisors.filter(a => a.active);
    }
  }

  getAllAdvisorsSync(): Advisor[] {
    return this.localAdvisors;
  }

  getActiveAdvisorsSync(): Advisor[] {
    return this.localAdvisors.filter(a => a.active);
  }

  async toggleAdvisor(id: string, active: boolean): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase
        .from('advisors')
        .update({ status: active ? 'active' : 'inactive', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    }

    this.localAdvisors = this.localAdvisors.map(a => 
      a.id === id ? { ...a, active } : a
    );
    this.saveLocalAdvisors();
  }

  async createAdvisor(advisor: Omit<Advisor, 'id'>): Promise<Advisor> {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('advisors')
        .insert({
          name: advisor.name,
          whatsapp: advisor.whatsapp,
          avatar_path: advisor.avatarUrl,
          role: advisor.role,
          status: advisor.active ? 'active' : 'inactive',
          sort_order: 100
        })
        .select()
        .single();
      
      if (error) throw error;
      const newAdvisor = this.mapDbAdvisor(data);
      this.localAdvisors.push(newAdvisor);
      this.saveLocalAdvisors();
      return newAdvisor;
    }

    const newAdvisor: Advisor = {
      ...advisor,
      id: `local-${Date.now()}`
    };
    this.localAdvisors.push(newAdvisor);
    this.saveLocalAdvisors();
    return newAdvisor;
  }

  async updateAdvisor(id: string, advisor: Partial<Advisor>): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase
        .from('advisors')
        .update({
          name: advisor.name,
          whatsapp: advisor.whatsapp,
          avatar_path: advisor.avatarUrl,
          role: advisor.role,
          status: advisor.active === undefined ? undefined : (advisor.active ? 'active' : 'inactive'),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    }

    this.localAdvisors = this.localAdvisors.map(a => 
      a.id === id ? { ...a, ...advisor } : a
    );
    this.saveLocalAdvisors();
  }

  async deleteAdvisor(id: string): Promise<void> {
    if (isConfigured) {
      const { error } = await supabase
        .from('advisors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }

    this.localAdvisors = this.localAdvisors.filter(a => a.id !== id);
    this.saveLocalAdvisors();
  }

  private saveLocalAdvisors() {
    localStorage.setItem(ADVISORS_STORAGE_KEY, JSON.stringify(this.localAdvisors));
    window.dispatchEvent(new Event('mare_advisors_updated'));
  }

  private mapDbAdvisor(db: any): Advisor {
    return {
      id: db.id,
      name: db.name,
      whatsapp: db.whatsapp,
      avatarUrl: db.avatar_path,
      isPrimary: db.role === 'Principal' || db.role === 'Primary',
      role: db.role || 'Asesor de Ventas',
      active: db.status === 'active'
    };
  }

  // Mantenemos compatibilidad con usos anteriores
  async getAdvisors(): Promise<Advisor[]> {
    return this.getAllAdvisors();
  }
}

export const advisorsService = new AdvisorsService();
export const getAdvisors = () => advisorsService.getAdvisors();
