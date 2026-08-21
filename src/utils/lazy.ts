import { lazy, ComponentType } from 'react';

/**
 * Función ultra-robusta para reintentar la carga dinámica si falla (Error Chunk)
 * Previene pantallas en blanco al actualizar versiones y asegura la recuperación automática sin lanzar excepciones no capturadas.
 */
export function retryLazy<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error: any) {
      console.warn("Chunk load error detected, initiating automatic recovery...", error);
      
      if (typeof window !== 'undefined') {
        try {
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
          }
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          }
        } catch (e) {
          console.warn("Error cleaning cache/SW:", e);
        }

        const now = Date.now();
        const lastReload = parseInt(sessionStorage.getItem('mare_chunk_retry_time') || '0', 10);

        if (now - lastReload > 5000) {
          sessionStorage.setItem('mare_chunk_retry_time', now.toString());
          window.location.reload();
        } else {
          // Force hard reload with timestamp if reloaded recently
          const cleanPath = window.location.pathname;
          window.location.href = cleanPath + (cleanPath.includes('?') ? '&' : '?') + 'refresh=' + now;
        }
      }
      
      // Devolver una promesa pendiente mientras se recarga la página
      // para evitar que React Suspense lance un error no capturado al renderizar
      return new Promise<{ default: T }>(() => {});
    }
  });
}

