import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Capturar errores globales de chunks dinámicos (despliegues de nueva versión)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = event?.reason?.message || event?.reason?.toString() || '';
    if (
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Loading chunk')
    ) {
      console.warn('Manejando error de chunk no capturado. Limpiando caché y actualizando...');
      event.preventDefault();
      
      const now = Date.now();
      const lastReload = parseInt(sessionStorage.getItem('mare_chunk_retry_time') || '0', 10);
      
      if ('caches' in window) {
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
      }

      if (now - lastReload > 4000) {
        sessionStorage.setItem('mare_chunk_retry_time', now.toString());
        
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
              registration.unregister();
            }
          }).finally(() => {
            window.location.reload();
          });
        } else {
          window.location.reload();
        }
      }
    }
  });
}

// Register service worker
registerSW({
  onNeedRefresh() {
    console.log('¡Nueva actualización de MARÉ disponible!');
  },
  onOfflineReady() {
    console.log('MARÉ está lista para funcionar en modo offline.');
  },
});

// Periodically check for updates in the background
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // Listen for the new service worker activating, then reload the page instantly
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('Aplicando nueva versión. Recargando...');
      window.location.reload();
    }
  });

  // Check for updates whenever the tab becomes active/visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().catch((err) => console.log('Error checking update:', err));
      });
    }
  });

  // Check for new updates every 30 seconds
  setInterval(() => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update().catch((err) => console.log('Error checking update interval:', err));
    });
  }, 30000);
}

// Quitar el loader inicial una vez que React está listo
const removeInitialLoader = () => {
  if (typeof window === 'undefined') return;
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    console.log('MARÉ: Desvaneciendo cargador inicial...');
    loader.classList.add('fade-out');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.remove();
        console.log('MARÉ: Aplicación lista.');
      }
    }, 800);
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  );
  
  // Usar requestAnimationFrame para asegurar que el primer render ocurra antes de quitar el loader
  requestAnimationFrame(() => {
    setTimeout(removeInitialLoader, 500);
  });
}

