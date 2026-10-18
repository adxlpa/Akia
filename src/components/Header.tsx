import React from 'react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    cartItemCount,
    setCartOpen,
    activeView,
    setActiveView,
    setSelectedCategoryFilter,
    setSearchModalOpen,
    isAdminAuthenticated,
  } = useStore();

  const handleNavClick = (view: 'home' | 'catalogue', catId: string | null = null, sectionId?: string) => {
    setSelectedCategoryFilter(catId);
    setActiveView(view);
    if (view === 'home' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E5E5]">
      {/* Top Monograph Announcement Bar */}
      <div className="bg-[#FDF5EA] text-[#1a1c1c] border-b border-[#ECD9C6] py-2 px-4 text-center">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] font-mono tracking-wider">
          <p className="hidden sm:block text-[#8B261D] font-semibold uppercase">
            AKIA Hand Made Soap & Herbal Care — Sulphate & Paraben Free
          </p>
          <p className="w-full sm:w-auto text-center sm:text-right text-[#5e5e5e]">
            Orders & Inquiries: <a href="tel:8078462709" className="text-black font-semibold hover:underline">8078462709</a> / <a href="tel:9497802709" className="text-black font-semibold hover:underline">9497802709</a>
          </p>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="h-20 max-w-[1440px] mx-auto px-5 lg:px-20 flex items-center justify-between gap-6">
        {/* Brand & Logo from PDF */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity group"
            aria-label="AKIA Home"
          >
            <img
              src="/images/logo.png"
              alt="AKIA Botanical Seal"
              className="w-12 h-12 object-contain rounded-full border border-[#004080]/30 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.2em] font-bold text-2xl text-[#8B261D] leading-none">
                AKIA
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#5e5e5e] font-mono mt-1">
                Premium Hand Made
              </span>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-7">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                activeView === 'home'
                  ? 'text-black font-semibold border-b-2 border-black'
                  : 'text-[#5e5e5e] hover:text-black'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'handmade-soaps')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Soaps
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'facewash-cleansing')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Face Wash
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'hair-care')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Hair Care
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'gels-nourishment')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Gels & Creams
            </button>
            <button
              onClick={() => handleNavClick('catalogue', null)}
              className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                activeView === 'catalogue'
                  ? 'text-black font-semibold border-b-2 border-black'
                  : 'text-[#5e5e5e] hover:text-black'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('home', null, 'brand-story')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Our Story
            </button>
            <button
              onClick={() => handleNavClick('home', null, 'customer-reviews')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            aria-label="Search Formulations"
            className="text-[#5e5e5e] hover:text-black transition-colors p-2 flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Track Consignment / Order lookup */}
          <button
            onClick={() => setActiveView('order-track')}
            className={`text-[12px] uppercase tracking-widest transition-colors flex items-center gap-1.5 px-2.5 py-1.5 border ${
              activeView === 'order-track'
                ? 'border-black text-black bg-[#F5F4F2]'
                : 'border-[#E5E5E5] text-[#5e5e5e] hover:text-black hover:border-black'
            }`}
            title="Track Your Consignment"
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span className="hidden md:inline text-[11px] font-medium">Track Order</span>
          </button>

          {/* Staff Access Portal Switch (Secure Gate) */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
            className={`text-[11px] uppercase tracking-widest px-2.5 py-1.5 border transition-all flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'bg-black text-white border-black font-semibold'
                : 'border-[#E5E5E5] hover:border-black text-[#5e5e5e] hover:text-black'
            }`}
            title={isAdminAuthenticated ? 'Admin Console Active' : 'Staff Portal Access'}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isAdminAuthenticated ? 'admin_panel_settings' : 'lock'}
            </span>
            <span className="hidden sm:inline">
              {activeView === 'admin' ? 'Exit Portal' : (isAdminAuthenticated ? 'Admin' : 'Staff')}
            </span>
            {isAdminAuthenticated && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Shopping Cart"
            className="relative text-[#5e5e5e] hover:text-black transition-colors p-2 flex items-center justify-center border-l border-[#E5E5E5] pl-4"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B261D] text-white text-[10px] leading-4 text-center rounded-full font-mono font-medium">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
