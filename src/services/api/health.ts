import { supabase, isConfigured } from '../../lib/supabase/client';

export interface HealthStatus {
  id: string;
  status: string;
  last_check: string;
}

/**
 * Verifica la conectividad con la base de datos Supabase.
 * Esta función es solo para diagnóstico de infraestructura (Fase 42).
 */
export const checkDatabaseConnection = async (): Promise<{
  success: boolean;
  data?: HealthStatus;
  error?: string;
}> => {
  if (!isConfigured) {
    return { success: false, error: 'Supabase no está configurado. Por favor, revisa tus variables de entorno.' };
  }

  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error de conexión a la base de datos:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as HealthStatus };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido de red';
    console.error('Error de red al conectar con Supabase:', message);
    return { success: false, error: message };
  }
};
