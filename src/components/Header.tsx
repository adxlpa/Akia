import React, { useState } from 'react';
import { useStore, AppView } from '../context/StoreContext';

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (
    view: AppView,
    catId: string | null = null
  ) => {
    setSelectedCategoryFilter(catId);
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E5E5]">
        {/* Top Announcement Bar */}
        <div className="bg-[#FDF5EA] text-[#1a1c1c] border-b border-[#ECD9C6] py-1.5 px-4 text-center">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] font-mono tracking-wider">
            <p className="hidden md:block text-[#8B261D] font-semibold uppercase truncate">
              AKIA Hand Made Soaps & Herbal Care — 100% Sulphate & Paraben Free
            </p>
            <p className="w-full md:w-auto text-center md:text-right text-[#5e5e5e] truncate">
              Direct Orders: <a href="tel:8078462709" className="text-black font-semibold hover:underline">8078462709</a> / <a href="tel:9497802709" className="text-black font-semibold hover:underline">9497802709</a>
            </p>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="h-16 sm:h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 flex items-center justify-between gap-4">
          {/* Left Group: Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5e5e5e] hover:text-black transition-colors flex items-center justify-center -ml-2"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Brand Logo & Title */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left hover:opacity-90 transition-opacity group"
              aria-label="AKIA Home"
            >
              <img
                src="/images/logo.png"
                alt="AKIA Botanical Seal"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-full border border-[#004080]/30 shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.2em] font-bold text-xl sm:text-2xl text-[#8B261D] leading-none">
                  AKIA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#5e5e5e] font-mono mt-0.5">
                  Hand Made Botanicals
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                  activeView === 'home'
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#5e5e5e] hover:text-black'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('catalogue', null)}
                className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                  activeView === 'catalogue'
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#5e5e5e] hover:text-black'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                  activeView === 'about'
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#5e5e5e] hover:text-black'
                }`}
              >
                Our Story
              </button>
              <button
                onClick={() => handleNavClick('reviews')}
                className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                  activeView === 'reviews'
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#5e5e5e] hover:text-black'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                  activeView === 'contact'
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#5e5e5e] hover:text-black'
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => handleNavClick('order-track')}
                className={`text-[12px] uppercase tracking-widest transition-colors py-1 ${
                  activeView === 'order-track'
                    ? 'text-black font-bold border-b-2 border-black'
                    : 'text-[#5e5e5e] hover:text-black'
                }`}
              >
                Track Order
              </button>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search Formulations"
              className="text-[#5e5e5e] hover:text-black transition-colors p-2 flex items-center justify-center rounded-sm hover:bg-[#F5F4F2]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">search</span>
            </button>

            {/* Desktop Track Order Pill */}
            <button
              onClick={() => handleNavClick('order-track')}
              className={`hidden sm:flex text-[11px] uppercase tracking-widest transition-colors items-center gap-1.5 px-3 py-1.5 border ${
                activeView === 'order-track'
                  ? 'border-black text-black bg-[#F5F4F2] font-semibold'
                  : 'border-[#E5E5E5] text-[#5e5e5e] hover:text-black hover:border-black'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
              <span>Track</span>
            </button>

            {/* Staff / Admin Portal Switch */}
            <button
              onClick={() => handleNavClick(activeView === 'admin' ? 'home' : 'admin')}
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
                {activeView === 'admin' ? 'Exit' : (isAdminAuthenticated ? 'Admin' : 'Staff')}
              </span>
              {isAdminAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative text-[#5e5e5e] hover:text-black transition-colors p-2 flex items-center justify-center border-l border-[#E5E5E5] pl-3 sm:pl-4"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">shopping_bag</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B261D] text-white text-[10px] leading-4 text-center rounded-full font-mono font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E5E5] bg-white px-5 py-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Main Navigation Links */}
            <div className="space-y-1 font-mono text-xs uppercase tracking-widest text-left">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'home' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>01. Home</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => handleNavClick('catalogue', null)}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'catalogue' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>02. All Products</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'about' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>03. Our Story & Heritage</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => handleNavClick('reviews')}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'reviews' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>04. Customer Reviews</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'contact' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>05. Contact & Atelier</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => handleNavClick('order-track')}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'order-track' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>06. Track Consignment</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>

              <button
                onClick={() => handleNavClick('privacy-policy')}
                className={`w-full py-2.5 text-left border-b border-[#F5F4F2] flex items-center justify-between ${
                  activeView === 'privacy-policy' ? 'text-[#8B261D] font-bold' : 'text-black'
                }`}
              >
                <span>07. Privacy Policy</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Quick Category Badges */}
            <div className="pt-2 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#747878] block mb-2 font-semibold">
                Shop By Category:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <button
                  onClick={() => handleNavClick('catalogue', 'handmade-soaps')}
                  className="p-2.5 bg-[#F5F4F2] hover:bg-[#FDF5EA] text-left border border-[#E5E5E5] text-black"
                >
                  Handmade Soaps
                </button>
                <button
                  onClick={() => handleNavClick('catalogue', 'facewash-cleansing')}
                  className="p-2.5 bg-[#F5F4F2] hover:bg-[#FDF5EA] text-left border border-[#E5E5E5] text-black"
                >
                  Face Washes
                </button>
                <button
                  onClick={() => handleNavClick('catalogue', 'hair-care')}
                  className="p-2.5 bg-[#F5F4F2] hover:bg-[#FDF5EA] text-left border border-[#E5E5E5] text-black"
                >
                  Hair Care & Oil
                </button>
                <button
                  onClick={() => handleNavClick('catalogue', 'gels-nourishment')}
                  className="p-2.5 bg-[#F5F4F2] hover:bg-[#FDF5EA] text-left border border-[#E5E5E5] text-black"
                >
                  Gels & Creams
                </button>
              </div>
            </div>

            {/* WhatsApp Quick Direct Action */}
            <div className="pt-2">
              <a
                href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20have%20an%20inquiry%20regarding%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-emerald-700 text-white text-xs uppercase tracking-widest font-mono font-medium flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp: +91 8078462709</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Sticky Navigation Bar (Gold standard mobile UX) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] px-2 py-1.5 shadow-lg safe-bottom">
        <div className="flex items-center justify-around text-center">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
              activeView === 'home' ? 'text-[#8B261D] font-bold' : 'text-[#747878] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">Home</span>
          </button>

          <button
            onClick={() => handleNavClick('catalogue', null)}
            className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
              activeView === 'catalogue' ? 'text-[#8B261D] font-bold' : 'text-[#747878] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">Shop</span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
              activeView === 'about' ? 'text-[#8B261D] font-bold' : 'text-[#747878] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">Story</span>
          </button>

          <button
            onClick={() => handleNavClick('order-track')}
            className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
              activeView === 'order-track' ? 'text-[#8B261D] font-bold' : 'text-[#747878] hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">Track</span>
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 relative text-[#747878] hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span className="text-[9px] font-mono uppercase tracking-wider mt-0.5">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-[#8B261D] text-white text-[9px] leading-3.5 text-center rounded-full font-mono font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
