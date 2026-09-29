import { supabase, isConfigured } from '../lib/supabase/client';
import { Advisor } from '../types';

export const catalogAdvisorsService = {
  async getActiveAdvisors(): Promise<Advisor[]> {
    if (!isConfigured) return [];
    const { data, error } = await supabase.from('mare_catalog_advisors')
      .select('id,name,whatsapp,avatar_path,is_primary,is_active')
      .eq('is_active', true)
      .order('sort_order')
      .order('name');
    if (error) return [];
    return (data || []).map((a:any) => ({
      id: a.id,
      name: a.name,
      whatsapp: a.whatsapp,
      avatarUrl: a.avatar_path || undefined,
      isPrimary: !!a.is_primary,
      role: 'Asesor de Ventas',
      active: true
    }));
  }
};
