import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        }
      }
    },
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'icon.svg', 'offline.html'],
        manifest: {
          name: 'MARÉ - Todo lo que buscas',
          short_name: 'MARÉ',
          description: 'Tu tienda oficial MARÉ. Encuentra ofertas, categorías y los mejores productos.',
          theme_color: '#0B1320',
          background_color: '#F5F7F8',
          display: 'standalone',
          icons: [
            {
              src: 'icon.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            },
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          // Permitimos que el Service Worker maneje tanto la ruta pública como la administrativa
          navigateFallbackAllowlist: [
            /^(?!\/__).*/ // Permitir todo excepto rutas internas de Firebase/Vercel si existieran
          ],
          navigateFallback: '/index.html',
          // Reglas personalizadas para manejar múltiples entry points (index y admin)
          runtimeCaching: [
            {
              // Forzar que las rutas de administración usen admin.html incluso offline
              urlPattern: ({ url }) => url.pathname.startsWith('/mare0311'),
              handler: 'NetworkFirst', // Intentar red primero para admin (seguridad), fallback a caché
              options: {
                cacheName: 'mare-admin-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 24 * 60 * 60, // 24 horas para contenido admin crítico
                },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'mare-images-cache',
                expiration: {
                  maxEntries: 100, // Aumentado para catálogo más robusto
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              },
            },
            {
              // Caché para fuentes de Google
              urlPattern: /^https:\/\/fonts\.googleapis\.com/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              },
            },
          ],
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: false,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: null,
    },
  };
});
