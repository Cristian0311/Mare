import { supabase,isConfigured } from '../lib/supabase/client';
import { Advisor } from '../types';
import { appConfig } from '../config';

export const catalogAdvisorsService={
 async getActiveAdvisors():Promise<Advisor[]>{
  const fallback:Advisor[]=appConfig.advisors.filter(a=>a.active).map(a=>({id:a.id,name:a.name,whatsapp:a.whatsapp,avatarUrl:(a as any).avatar,isPrimary:(a as any).role==='Principal',role:a.role,active:true}));
  if(!isConfigured)return fallback;
  const{data,error}=await supabase.from('mare_catalog_advisors').select('id,name,whatsapp,avatar_path,is_primary,is_active').eq('is_active',true).order('sort_order').order('name');
  if(error||!data?.length)return fallback;
  return data.map((a:any)=>({id:a.id,name:a.name,whatsapp:a.whatsapp,avatarUrl:a.avatar_path||undefined,isPrimary:!!a.is_primary,role:'Asesor de Ventas',active:true}));
 }
};
