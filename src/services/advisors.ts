import { Advisor } from '../types';
import { appConfig } from '../config';

const ADVISORS_STORAGE_KEY = 'mare_admin_advisors';
const defaults: Advisor[] = appConfig.advisors.map(a => ({
  id: a.id,
  name: a.name,
  whatsapp: a.whatsapp,
  avatarUrl: (a as any).avatar,
  isPrimary: (a as any).role === 'Principal' || (a as any).role === 'Primary',
  role: (a as any).role || 'Asesor de Ventas',
  active: a.active !== false
}));

class AdvisorsService {
  private localAdvisors: Advisor[] = this.loadLocal();

  private loadLocal(): Advisor[] {
    try {
      const saved = localStorage.getItem(ADVISORS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [...defaults];
    } catch {
      return [...defaults];
    }
  }

  private save() {
    localStorage.setItem(ADVISORS_STORAGE_KEY, JSON.stringify(this.localAdvisors));
    window.dispatchEvent(new Event('mare_advisors_updated'));
  }

  async getAllAdvisors() { return [...this.localAdvisors]; }
  async getActiveAdvisors() { return this.localAdvisors.filter(a => a.active); }
  getAllAdvisorsSync() { return this.localAdvisors; }
  getActiveAdvisorsSync() { return this.localAdvisors.filter(a => a.active); }

  async toggleAdvisor(id: string, active: boolean) {
    this.localAdvisors = this.localAdvisors.map(a => a.id === id ? { ...a, active } : a);
    this.save();
  }

  async createAdvisor(advisor: Omit<Advisor, 'id'>) {
    const created = { ...advisor, id: `local-${Date.now()}` };
    this.localAdvisors.push(created);
    this.save();
    return created;
  }

  async updateAdvisor(id: string, advisor: Partial<Advisor>) {
    this.localAdvisors = this.localAdvisors.map(a => a.id === id ? { ...a, ...advisor } : a);
    this.save();
  }

  async deleteAdvisor(id: string) {
    this.localAdvisors = this.localAdvisors.filter(a => a.id !== id);
    this.save();
  }

  async getAdvisors() { return this.getAllAdvisors(); }
}

export const advisorsService = new AdvisorsService();
export const getAdvisors = () => advisorsService.getAdvisors();
