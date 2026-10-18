import React from 'react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { products, addToCart, setActiveProductModal, setActiveView, setSelectedCategoryFilter } = useStore();

  const featuredSoap = products.find((p) => p.id === 'prod-thulasi-soap') || products[0];
  const hairOil = products.find((p) => p.id === 'prod-bhringraj-hair-oil');
  const redSandal = products.find((p) => p.id === 'prod-red-sandal-soap');

  const handleExploreClick = () => {
    setSelectedCategoryFilter(null);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-[#E5E5E5] pt-28">
      {/* Ambient architectural micro-grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundSize: '48px 48px',
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-5 lg:px-20 py-10 lg:py-16 flex flex-col items-center">
        {/* Monograph Header Bar */}
        <div className="w-full flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#8B261D]"></span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-black font-mono">
              AKIA BOTANICAL ESSENTIALS
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px] uppercase text-[#5e5e5e] tracking-widest font-mono">
            <span>Sulphate Free & Paraben Free</span>
            <span className="text-[#E5E5E5]">/</span>
            <span>Handmade in Kerala</span>
          </div>
        </div>

        {/* Main Headline Callout */}
        <div className="text-center max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDF5EA] border border-[#ECD9C6] text-[#8B261D] text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
            <span>Pure Botanical Heritage</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[72px] lg:leading-[80px] text-black tracking-tight font-serif font-normal text-balance">
            Made by hand.<br className="hidden sm:inline" /> Crafted to heal.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#5e5e5e] max-w-2xl mx-auto leading-relaxed">
            Pure small-batch cold-cured botanical soaps, Ayurvedic hair treatments, and hydrating facial infusions. Zero harsh chemical preservatives or sulphates.
          </p>
        </div>

        {/* Showcase Grid of Flagship AKIA Handcrafted Formulations (NO rotation/turntable) */}
        <div className="w-full max-w-5xl my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Soap Card */}
            {featuredSoap && (
              <div className="group relative bg-[#F9F9F9] border border-[#E5E5E5] p-6 flex flex-col justify-between hover:border-black/50 transition-all duration-300">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#5e5e5e] mb-4">
                  <span>{featuredSoap.badge || 'Featured'}</span>
                  <span>₹{featuredSoap.price}</span>
                </div>
                <div className="relative aspect-square w-full flex items-center justify-center p-2 mb-4 overflow-hidden bg-white border border-[#EBEBEB]">
                  <img
                    src={featuredSoap.imageUrl}
                    alt={featuredSoap.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] uppercase font-mono px-2 py-0.5 tracking-wider">
                    Handmade Soap
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black">{featuredSoap.name}</h3>
                  <p className="text-[12px] text-[#5e5e5e] line-clamp-2 mt-1 mb-4 leading-relaxed">
                    {featuredSoap.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProductModal(featuredSoap)}
                      className="flex-1 h-10 border border-black text-black hover:bg-black hover:text-white text-[11px] font-medium uppercase tracking-wider transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(featuredSoap, featuredSoap.variants?.[0]?.name, 1)}
                      className="h-10 px-4 bg-black text-white hover:bg-neutral-800 text-[11px] font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                      title="Add to Cart"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Red Sandal Soap Card */}
            {redSandal && (
              <div className="group relative bg-[#F9F9F9] border border-[#E5E5E5] p-6 flex flex-col justify-between hover:border-black/50 transition-all duration-300">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#5e5e5e] mb-4">
                  <span>{redSandal.badge || 'Oil Balancing'}</span>
                  <span>₹{redSandal.price}</span>
                </div>
                <div className="relative aspect-square w-full flex items-center justify-center p-2 mb-4 overflow-hidden bg-white border border-[#EBEBEB]">
                  <img
                    src={redSandal.imageUrl}
                    alt={redSandal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#8B261D] text-white text-[10px] uppercase font-mono px-2 py-0.5 tracking-wider">
                    Sandalwood
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black">{redSandal.name}</h3>
                  <p className="text-[12px] text-[#5e5e5e] line-clamp-2 mt-1 mb-4 leading-relaxed">
                    {redSandal.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProductModal(redSandal)}
                      className="flex-1 h-10 border border-black text-black hover:bg-black hover:text-white text-[11px] font-medium uppercase tracking-wider transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(redSandal, redSandal.variants?.[0]?.name, 1)}
                      className="h-10 px-4 bg-black text-white hover:bg-neutral-800 text-[11px] font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                      title="Add to Cart"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Hair Oil Card */}
            {hairOil && (
              <div className="group relative bg-[#F9F9F9] border border-[#E5E5E5] p-6 flex flex-col justify-between hover:border-black/50 transition-all duration-300">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#5e5e5e] mb-4">
                  <span>{hairOil.badge || 'Hair Fall Defense'}</span>
                  <span>₹{hairOil.price}</span>
                </div>
                <div className="relative aspect-square w-full flex items-center justify-center p-2 mb-4 overflow-hidden bg-white border border-[#EBEBEB]">
                  <img
                    src={hairOil.imageUrl}
                    alt={hairOil.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] uppercase font-mono px-2 py-0.5 tracking-wider">
                    Hair Care
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black">{hairOil.name}</h3>
                  <p className="text-[12px] text-[#5e5e5e] line-clamp-2 mt-1 mb-4 leading-relaxed">
                    {hairOil.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProductModal(hairOil)}
                      className="flex-1 h-10 border border-black text-black hover:bg-black hover:text-white text-[11px] font-medium uppercase tracking-wider transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(hairOil, hairOil.variants?.[0]?.name, 1)}
                      className="h-10 px-4 bg-black text-white hover:bg-neutral-800 text-[11px] font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                      title="Add to Cart"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-8">
          <button
            onClick={handleExploreClick}
            type="button"
            className="h-12 px-8 bg-black text-white text-[13px] font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Explore All 16 Formulations</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <a
            href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20would%20like%20to%20place%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-8 border border-black text-black hover:bg-[#8B261D] hover:text-white hover:border-[#8B261D] transition-colors text-[13px] font-medium uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Direct WhatsApp Order</span>
          </a>
        </div>

        {/* Brochure Contact Footnote */}
        <div className="mt-8 text-center text-[12px] text-[#5e5e5e] font-mono">
          <span>Customer Desk & Orders: </span>
          <a href="tel:8078462709" className="text-black font-semibold hover:underline">8078462709</a>
          <span className="mx-2">/</span>
          <a href="tel:9497802709" className="text-black font-semibold hover:underline">9497802709</a>
        </div>
      </div>
    </section>
  );
};
