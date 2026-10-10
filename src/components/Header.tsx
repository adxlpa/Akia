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
      <div className="bg-[#F5F4F2] text-[#1a1c1c] border-b border-[#E5E5E5] py-2 px-4 text-center">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5e5e5e]">
          Handcrafted in small batches — Complimentary shipping on orders above ₹1,500
        </p>
      </div>

      {/* Main Header Container */}
      <div className="h-20 max-w-[1440px] mx-auto px-5 lg:px-20 flex items-center justify-between gap-6">
        {/* Brand & Nav */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-2xl tracking-tight uppercase text-black font-normal hover:opacity-90 transition-opacity"
            aria-label="AKIRA Home"
          >
            <span className="tracking-[0.25em] font-light text-2xl">AKIRA</span>
            <span className="w-1.5 h-1.5 bg-black inline-block"></span>
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
              onClick={() => handleNavClick('catalogue', 'facewash-cleansing')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Skin
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'handmade-soaps')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Body
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'hair-care')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Hair Care
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'eco-domestic')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Home Cleaning
            </button>
            <button
              onClick={() => handleNavClick('catalogue', null)}
              className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                activeView === 'catalogue'
                  ? 'text-black font-semibold border-b-2 border-black'
                  : 'text-[#5e5e5e] hover:text-black'
              }`}
            >
              Full Catalogue
            </button>
            <button
              onClick={() => handleNavClick('home', null, 'brand-story')}
              className="text-[12px] uppercase tracking-widest text-[#5e5e5e] hover:text-black transition-colors"
            >
              Philosophy
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

          {/* Currency indicator */}
          <div className="hidden sm:flex items-center border-l border-[#E5E5E5] pl-4">
            <span className="text-[12px] uppercase text-[#5e5e5e] tracking-widest font-mono">
              ₹ INR
            </span>
          </div>

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

          {/* Admin Dashboard switch */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
            className={`text-[11px] uppercase tracking-widest px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'bg-black text-white border-black font-semibold'
                : 'border-black/30 hover:border-black text-black hover:bg-neutral-100'
            }`}
            title="Admin Management Console"
          >
            <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
            <span>{activeView === 'admin' ? 'Exit Admin' : 'Admin'}</span>
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
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] leading-4 text-center rounded-full font-mono font-medium">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
