import { Suspense, ComponentType } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AnimatedRoutes } from './AnimatedRoutes';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { PromotionProvider } from './contexts/PromotionContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { MaintenanceGuard } from './components/MaintenanceGuard';
import { SWUpdateBanner } from './components/ui/SWUpdateBanner';
import { retryLazy } from './utils/lazy';

// Admin Routes (Lazy Loaded with retry protection)
const AdminLogin = retryLazy(() => import('./admin/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = retryLazy(() => import('./admin/layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = retryLazy(() => import('./admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = retryLazy(() => import('./admin/pages/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminCategories = retryLazy(() => import('./admin/pages/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminWholesale = retryLazy(() => import('./admin/pages/AdminWholesale').then(m => ({ default: m.AdminWholesale })));
const AdminOrders = retryLazy(() => import('./admin/pages/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminOrderDetail = retryLazy(() => import('./admin/pages/AdminOrderDetail').then(m => ({ default: m.AdminOrderDetail })));
const AdminCustomers = retryLazy(() => import('./admin/pages/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminCustomerDetail = retryLazy(() => import('./admin/pages/AdminCustomerDetail').then(m => ({ default: m.AdminCustomerDetail })));
const AdminInventory = retryLazy(() => import('./admin/pages/AdminInventory').then(m => ({ default: m.AdminInventory })));
const AdminLocations = retryLazy(() => import('./admin/pages/AdminLocations').then(m => ({ default: m.AdminLocations })));
const AdminAdvisors = retryLazy(() => import('./admin/pages/AdminAdvisors').then(m => ({ default: m.AdminAdvisors })));
const AdminSettings = retryLazy(() => import('./admin/pages/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminWhatsApp = retryLazy(() => import('./admin/pages/AdminWhatsApp').then(m => ({ default: m.AdminWhatsApp })));
const AdminDelivery = retryLazy(() => import('./admin/pages/AdminDelivery').then(m => ({ default: m.AdminDelivery })));
const AdminPrices = retryLazy(() => import('./admin/pages/AdminPrices').then(m => ({ default: m.AdminPrices })));
const AdminContent = retryLazy(() => import('./admin/pages/AdminContent').then(m => ({ default: m.AdminContent })));

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <FavoritesProvider>
          <PromotionProvider>
            <CartProvider>
              <WhatsAppProvider>
                <Suspense fallback={
                <div className="min-h-screen bg-[#0B1320] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-[#14998E] border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Iniciando MARÉ</div>
                  </div>
                </div>
              }>
                <Routes>
                  {/* Rutas de Administración */}
                  <Route path="/mare0311/login" element={<AdminLogin />} />
                  <Route path="/mare0311" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="productos" element={<AdminProducts />} />
                    <Route path="categorias" element={<AdminCategories />} />
                    <Route path="mayoristas" element={<AdminWholesale />} />
                    <Route path="pedidos" element={<AdminOrders />} />
                    <Route path="pedidos/:id" element={<AdminOrderDetail />} />
                    <Route path="clientes" element={<AdminCustomers />} />
                    <Route path="clientes/:id" element={<AdminCustomerDetail />} />
                    <Route path="inventario" element={<AdminInventory />} />
                    <Route path="zonas" element={<AdminLocations />} />
                    <Route path="asesores" element={<AdminAdvisors />} />
                    <Route path="configuracion" element={<AdminSettings />} />
                    <Route path="whatsapp" element={<AdminWhatsApp />} />
                    <Route path="entregas" element={<AdminDelivery />} />
                    <Route path="precios" element={<AdminPrices />} />
                    <Route path="contenido" element={<AdminContent />} />
                    
                    {/* Fallback para rutas de admin no encontradas */}
                    <Route path="*" element={<Navigate to="/mare0311" replace />} />
                  </Route>

                  {/* Rutas Públicas (Cliente) */}
                  <Route path="/*" element={
                    <MaintenanceGuard>
                      <Layout>
                        <Suspense fallback={null}>
                          <AnimatedRoutes />
                        </Suspense>
                        <ScrollToTop />
                        <OfflineIndicator />
                        <SWUpdateBanner />
                      </Layout>
                    </MaintenanceGuard>
                  } />
                </Routes>
              </Suspense>
              </WhatsAppProvider>
            </CartProvider>
          </PromotionProvider>
        </FavoritesProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}
