import { Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/ui/PageTransition';
import { retryLazy } from './utils/lazy';
import { Home } from './pages/Home';

// Lazy load components
const Categories = retryLazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const CategoryDetail = retryLazy(() => import('./pages/CategoryDetail').then(m => ({ default: m.CategoryDetail })));
const ProductDetail = retryLazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Search = retryLazy(() => import('./pages/Search').then(m => ({ default: m.Search })));
const Collection = retryLazy(() => import('./pages/Collection').then(m => ({ default: m.Collection })));
const Cart = retryLazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = retryLazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderSuccess = retryLazy(() => import('./pages/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const Favorites = retryLazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const BundleDetail = retryLazy(() => import('./pages/BundleDetail').then(m => ({ default: m.BundleDetail })));

// Info pages
const InfoCenter = retryLazy(() => import('./pages/info/InfoCenter').then(m => ({ default: m.InfoCenter })));
const HowToBuy = retryLazy(() => import('./pages/info/HowToBuy').then(m => ({ default: m.HowToBuy })));
const Deliveries = retryLazy(() => import('./pages/info/Deliveries').then(m => ({ default: m.Deliveries })));
const FAQ = retryLazy(() => import('./pages/info/FAQ').then(m => ({ default: m.FAQ })));
const Conditions = retryLazy(() => import('./pages/info/Conditions').then(m => ({ default: m.Conditions })));
const Wholesale = retryLazy(() => import('./pages/info/Wholesale').then(m => ({ default: m.Wholesale })));
const Contact = retryLazy(() => import('./pages/info/Contact').then(m => ({ default: m.Contact })));

export function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence>
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          
          <Route path="/categorias" element={
            <PageTransition><Categories /></PageTransition>
          } />
          
          <Route path="/categoria/:slug" element={
            <PageTransition><CategoryDetail /></PageTransition>
          } />
          
          <Route path="/categoria/:slug/:subslug" element={
            <PageTransition><CategoryDetail /></PageTransition>
          } />
          
          <Route path="/producto/:slug" element={
            <PageTransition><ProductDetail /></PageTransition>
          } />
          
          <Route path="/combos/:id" element={
            <PageTransition><BundleDetail /></PageTransition>
          } />
          
          <Route path="/buscar" element={
            <PageTransition><Search /></PageTransition>
          } />
          
          <Route path="/coleccion/:type" element={
            <PageTransition><Collection /></PageTransition>
          } />
          
          <Route path="/mi-pedido" element={
            <PageTransition><Cart /></PageTransition>
          } />
          
          <Route path="/pedido" element={
            <PageTransition><Checkout /></PageTransition>
          } />
          
          <Route path="/pedido-completado" element={
            <PageTransition><OrderSuccess /></PageTransition>
          } />
          
          <Route path="/favoritos" element={
            <PageTransition><Favorites /></PageTransition>
          } />



          {/* Info Routes */}
          <Route path="/informacion" element={
            <PageTransition><InfoCenter /></PageTransition>
          } />
          <Route path="/informacion/como-comprar" element={
            <PageTransition><HowToBuy /></PageTransition>
          } />
          <Route path="/informacion/entregas" element={
            <PageTransition><Deliveries /></PageTransition>
          } />
          <Route path="/informacion/faq" element={
            <PageTransition><FAQ /></PageTransition>
          } />
          <Route path="/informacion/condiciones" element={
            <PageTransition><Conditions /></PageTransition>
          } />
          <Route path="/informacion/mayoristas" element={
            <PageTransition><Wholesale /></PageTransition>
          } />
          <Route path="/informacion/contacto" element={
            <PageTransition><Contact /></PageTransition>
          } />
          
          {/* Catch-all route for unknown client-side paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

