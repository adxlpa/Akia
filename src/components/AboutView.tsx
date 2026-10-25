import React from 'react';
import { useStore } from '../context/StoreContext';

export const AboutView: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();

  const handleBrowseShop = (catId: string | null = null) => {
    setSelectedCategoryFilter(catId);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const HERBS = [
    {
      name: 'Holy Thulasi (Ocimum Sanctum)',
      role: 'Anti-Acne & Deep Pore Purification',
      desc: 'Revered as the Queen of Herbs in Ayurveda, Thulasi cleanses pores deeply, combats breakout-causing bacteria, and shields against premature oxidative aging.',
      image: '/images/products/thulasi-soap.jpg',
    },
    {
      name: 'Wild Neem (Azadirachta Indica)',
      role: 'Blemish Defense & Anti-Inflammatory',
      desc: 'A potent soothing botanic that soothes inflamed skin, clears stubborn blackheads and whiteheads, and calms irritated skin barriers naturally.',
      image: '/images/products/neem-soap.jpg',
    },
    {
      name: 'Manjistha (Rubia Cordifolia)',
      role: 'Even Skin Tone & Melanin Regulation',
      desc: 'Known as the Ayurvedic blood purifier for skin, Manjistha diminishes sun tans, hyperpigmentation, and marks while instilling a translucent, radiant glow.',
      image: '/images/products/manjisthadi-soap.jpg',
    },
    {
      name: 'Red Sandalwood (Rakta Chandana)',
      role: 'Oil Balancing & Cooling Relief',
      desc: 'Harvested sustainably, Red Sandalwood cools heat, relieves redness and itchiness, and normalizes excess facial sebum without drying skin.',
      image: '/images/products/red-sandal-soap.jpg',
    },
    {
      name: 'Brahmi & Bhringraj',
      role: 'Follicular Nourishment & Hair Fall Control',
      desc: 'Slowly macerated in cold-pressed virgin coconut oil, this traditional duo prevents premature greying, encourages baby hair growth, and induces sound, restful sleep.',
      image: '/images/products/bhringraj-hair-oil.jpg',
    },
    {
      name: 'Pure Aloe Barbadensis',
      role: 'Cellular Hydration & Barrier Healing',
      desc: 'Extracted fresh to preserve polysaccharides, our aloe vera delivers deep non-greasy moisture, soothing sunburns and promoting dermal regeneration.',
      image: '/images/products/aloevera-gel.jpg',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#f9f9f9]">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
          <li>
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-black transition-colors"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li className="text-black font-semibold" aria-current="page">
            Our Story & Botanical Heritage
          </li>
        </ol>
      </nav>

      {/* Hero Narrative Section */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16 lg:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3 py-1 bg-[#FDF5EA] text-[#8B261D] border border-[#ECD9C6] text-[11px] font-mono uppercase tracking-widest font-semibold">
              The AKIA Heritage Atelier — Kerala, India
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black leading-tight">
              Honest Ayurvedic Alchemy, Handcrafted Without Compromise.
            </h1>
            <p className="text-base sm:text-lg text-[#5e5e5e] leading-relaxed">
              AKIA was born from a singular conviction: return to pure, time-honored Ayurvedic skincare. Disillusioned by commercial mass-market soaps filled with harsh detergents, petroleum sulfates, and artificial stabilizers, we established a small-batch artisan laboratory dedicated to cold-cured botanical purity.
            </p>
            <p className="text-sm sm:text-base text-[#5e5e5e] leading-relaxed">
              Every bar of soap is cured for 30 to 45 days in small batches in Kerala, combining cold-pressed coconut oil with freshly gathered leaves, roots, and botanicals. We formulate with zero sulphates, zero parabens, and zero filler chemicals.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleBrowseShop(null)}
                className="h-11 px-6 bg-[#8B261D] hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors font-mono flex items-center gap-2"
              >
                <span>Explore Formulations</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('contact')}
                className="h-11 px-6 bg-white border border-[#E5E5E5] hover:border-black text-black text-xs uppercase tracking-widest font-medium transition-colors font-mono"
              >
                Contact Our Atelier
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] bg-white border border-[#E5E5E5] p-4 shadow-sm overflow-hidden flex items-center justify-center">
              <img
                src="/images/products/thulasi-soap.jpg"
                alt="AKIA Artisan Cold-Cured Herbal Soap in Kerala Atelier"
                width={450}
                height={550}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm border border-[#E5E5E5] p-4 text-left">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8B261D] font-semibold block">
                  Cold Process Standard
                </span>
                <p className="text-xs font-serif text-black mt-1">
                  30–45 Days Natural Curing in Kerala Ambient Humidity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Principles of AKIA Formulation */}
      <section className="bg-[#F5F4F2] py-16 lg:py-20 border-y border-[#E5E5E5] mb-20">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
          <div className="max-w-2xl mb-12 text-left">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-2">
              Our Non-Negotiable Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-black">
              Four Principles That Guide Every Batch We Produce
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 sm:p-8 border border-[#E5E5E5] space-y-3 text-left">
              <span className="w-10 h-10 rounded-full bg-[#FDF5EA] text-[#8B261D] flex items-center justify-center font-mono font-bold text-sm">
                01
              </span>
              <h3 className="text-base font-bold text-black font-serif">100% Sulphate & Paraben Free</h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                We never use SLS, SLES, parabens, phthalates, or synthetic hardeners. Every formulation maintains the skin's natural acidic pH mantle.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-[#E5E5E5] space-y-3 text-left">
              <span className="w-10 h-10 rounded-full bg-[#FDF5EA] text-[#8B261D] flex items-center justify-center font-mono font-bold text-sm">
                02
              </span>
              <h3 className="text-base font-bold text-black font-serif">Virgin Coconut Oil Matrix</h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Cold-pressed from fresh Kerala coconuts, our natural base naturally retains glycerin during saponification for deep cellular hydration.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-[#E5E5E5] space-y-3 text-left">
              <span className="w-10 h-10 rounded-full bg-[#FDF5EA] text-[#8B261D] flex items-center justify-center font-mono font-bold text-sm">
                03
              </span>
              <h3 className="text-base font-bold text-black font-serif">Traditional Slow Maceration</h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Herbs like Brahmi, Bhringraj, and Nalpamara are slowly decocted over gentle temperatures so their volatile therapeutic phyto-compounds remain active.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-[#E5E5E5] space-y-3 text-left">
              <span className="w-10 h-10 rounded-full bg-[#FDF5EA] text-[#8B261D] flex items-center justify-center font-mono font-bold text-sm">
                04
              </span>
              <h3 className="text-base font-bold text-black font-serif">Small Batch Traceability</h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Hand-poured, hand-cut, and manually inspected. We preserve freshness and potency by producing only what we can cure to perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Botanical Ingredients Encyclopedia */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-[#E5E5E5]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-1">
              Active Plant Phyto-Chemistry
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-black">
              Key Botanical Actives in AKIA Formulations
            </h2>
          </div>
          <button
            onClick={() => handleBrowseShop(null)}
            className="text-xs uppercase tracking-widest text-[#8B261D] hover:text-black font-mono font-semibold transition-colors flex items-center gap-1"
          >
            <span>View All Products</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HERBS.map((herb, idx) => (
            <div key={idx} className="bg-white border border-[#E5E5E5] p-5 sm:p-6 flex flex-col justify-between text-left">
              <div className="space-y-3">
                <div className="w-full h-44 bg-[#F5F4F2] overflow-hidden border border-[#E5E5E5] mb-4">
                  <img
                    src={herb.image}
                    alt={`${herb.name} - Botanical Active for ${herb.role}`}
                    width={280}
                    height={176}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B261D] font-semibold block">
                  {herb.role}
                </span>
                <h3 className="text-base font-serif font-bold text-black">{herb.name}</h3>
                <p className="text-xs text-[#5e5e5e] leading-relaxed">{herb.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="bg-[#1a1c1c] text-white p-8 sm:p-12 lg:p-16 text-center space-y-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#E5D7C7] block">
            Experience Authentic Artisan Quality
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif max-w-2xl mx-auto leading-tight">
            Ready to upgrade your daily bath to pure, restorative botanical care?
          </h2>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleBrowseShop(null)}
              className="h-12 px-8 bg-[#8B261D] hover:bg-white hover:text-black text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors"
            >
              Shop The Complete Collection
            </button>
            <a
              href="https://wa.me/918078462709?text=Hello%20AKIA%20team,%20I%20would%20like%20to%20learn%20more%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 bg-transparent border border-white/40 hover:border-white text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors inline-flex items-center gap-2"
            >
              <span>Message on WhatsApp</span>
              <span className="material-symbols-outlined text-[16px]">chat</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
