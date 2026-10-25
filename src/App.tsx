/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CuratedFlagships } from './components/CuratedFlagships';
import { CategoryMonoliths } from './components/CategoryMonoliths';
import { ManifestoSection } from './components/ManifestoSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterBand } from './components/NewsletterBand';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchModal } from './components/SearchModal';

// Code-Split Dynamic Route Views for Faster Initial Page Load
const CatalogueView = lazy(() =>
  import('./components/CatalogueView').then((m) => ({ default: m.CatalogueView }))
);
const AboutView = lazy(() =>
  import('./components/AboutView').then((m) => ({ default: m.AboutView }))
);
const ReviewsView = lazy(() =>
  import('./components/ReviewsView').then((m) => ({ default: m.ReviewsView }))
);
const ContactView = lazy(() =>
  import('./components/ContactView').then((m) => ({ default: m.ContactView }))
);
const PrivacyPolicyView = lazy(() =>
  import('./components/PrivacyPolicyView').then((m) => ({ default: m.PrivacyPolicyView }))
);
const CheckoutView = lazy(() =>
  import('./components/CheckoutView').then((m) => ({ default: m.CheckoutView }))
);
const PaymentView = lazy(() =>
  import('./components/PaymentView').then((m) => ({ default: m.PaymentView }))
);
const OrderConfirmationView = lazy(() =>
  import('./components/OrderConfirmationView').then((m) => ({ default: m.OrderConfirmationView }))
);
const OrderTrackerView = lazy(() =>
  import('./components/OrderTrackerView').then((m) => ({ default: m.OrderTrackerView }))
);
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLoginGate = lazy(() =>
  import('./components/AdminLoginGate').then((m) => ({ default: m.AdminLoginGate }))
);
const NotFoundView = lazy(() =>
  import('./components/NotFoundView').then((m) => ({ default: m.NotFoundView }))
);

const ViewLoadingFallback: React.FC = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-28 pb-20 px-4">
    <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#5e5e5e]">
      <div className="w-7 h-7 border-2 border-black/15 border-t-black rounded-full animate-spin"></div>
      <span className="uppercase tracking-widest text-[11px]">Loading Formulation...</span>
    </div>
  </div>
);

const MainContent: React.FC = () => {
  const { activeView, isAdminAuthenticated } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c]">
      <Header />

      <main className="flex-grow">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <CuratedFlagships />
            <CategoryMonoliths />
            <ManifestoSection />
            <TestimonialsSection />
            <NewsletterBand />
          </>
        )}

        <Suspense fallback={<ViewLoadingFallback />}>
          {activeView === 'catalogue' && <CatalogueView />}
          {activeView === 'about' && <AboutView />}
          {activeView === 'reviews' && <ReviewsView />}
          {activeView === 'contact' && <ContactView />}
          {activeView === 'privacy-policy' && <PrivacyPolicyView />}
          {activeView === 'checkout' && <CheckoutView />}
          {activeView === 'payment' && <PaymentView />}
          {activeView === 'order-confirmation' && <OrderConfirmationView />}
          {activeView === 'order-track' && <OrderTrackerView />}
          {activeView === 'admin' &&
            (isAdminAuthenticated ? <AdminDashboard /> : <AdminLoginGate />)}
          {activeView === 'not-found' && <NotFoundView />}
        </Suspense>
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
