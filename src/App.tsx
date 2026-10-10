/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
import { CatalogueView } from './components/CatalogueView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutView } from './components/CheckoutView';
import { PaymentView } from './components/PaymentView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackerView } from './components/OrderTrackerView';
import { SearchModal } from './components/SearchModal';
import { AdminDashboard } from './components/AdminDashboard';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

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

        {activeView === 'catalogue' && <CatalogueView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'payment' && <PaymentView />}
        {activeView === 'order-confirmation' && <OrderConfirmationView />}
        {activeView === 'order-track' && <OrderTrackerView />}
        {activeView === 'admin' && <AdminDashboard />}
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
