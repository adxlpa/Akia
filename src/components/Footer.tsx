import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter, isAdminAuthenticated } = useStore();
  const [monographEmail, setMonographEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleCategoryNav = (catId: string | null) => {
    setSelectedCategoryFilter(catId);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (monographEmail) {
      setSubscribed(true);
      setMonographEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#F5F4F2] border-t border-[#E5E5E5] pb-20 lg:pb-0">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="AKIA Seal"
                className="w-10 h-10 object-contain rounded-full border border-[#004080]/30 shadow-xs"
              />
              <div>
                <span className="font-serif tracking-[0.2em] font-bold text-xl text-[#8B261D] leading-none block">
                  AKIA
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#5e5e5e] font-mono">
                  Premium Hand Made
                </span>
              </div>
            </div>
            <p className="text-[13px] text-[#5e5e5e] leading-relaxed">
              100% Sulphate Free & Paraben Free botanical soaps and authentic Ayurvedic preparations handcrafted with care in Kerala.
            </p>
            <div className="pt-2 text-[12px] text-black font-mono space-y-1">
              <div>
                <span className="text-[#5e5e5e]">Direct Line: </span>
                <a href="tel:8078462709" className="font-semibold hover:underline">8078462709</a>
              </div>
              <div>
                <span className="text-[#5e5e5e]">Alternate: </span>
                <a href="tel:9497802709" className="font-semibold hover:underline">9497802709</a>
              </div>
            </div>
          </div>

          {/* Col 2: Shop Formulations */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Shop Formulations
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('handmade-soaps')}
                  className="hover:text-black transition-colors text-left"
                >
                  Handmade Soaps (7 Formulations)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('facewash-cleansing')}
                  className="hover:text-black transition-colors text-left"
                >
                  Herbal Face Washes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('hair-care')}
                  className="hover:text-black transition-colors text-left"
                >
                  Brahmi Hair Oil & Shampoo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('gels-nourishment')}
                  className="hover:text-black transition-colors text-left"
                >
                  Aloevera & Nalpamarathi Gels
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('creams-lip-care')}
                  className="hover:text-black transition-colors text-left"
                >
                  Beauty Cream & Lip Balm
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav(null)}
                  className="hover:text-black transition-colors text-left font-medium text-black"
                >
                  Complete 16 Products Index
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Maison & Ethos */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Botanical Ethos
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black transition-colors text-left font-medium text-black"
                >
                  The AKIA Story & Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black transition-colors text-left"
                >
                  Cold-Process Soap Curing
                </button>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Zero Sulphates, Zero Parabens</span>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Fresh Herb Pulp Extracts</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('reviews');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black transition-colors text-left font-medium text-black"
                >
                  Customer Reviews (4.9★)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge & Orders */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Orders & Concierge
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('order-track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black transition-colors text-left font-medium underline underline-offset-4"
                >
                  Track Consignment
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black transition-colors text-left font-medium text-black"
                >
                  Contact & Kerala Atelier
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20would%20like%20to%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-1 text-[#8B261D] font-medium"
                >
                  <span>WhatsApp Concierge</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </a>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Free Shipping above ₹1,000</span>
              </li>
              <li>
                {/* Discrete Staff / Admin Link */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[12px] text-[#5e5e5e] hover:text-black transition-colors flex items-center gap-1.5 pt-2"
                  title="Administrative Portal"
                >
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>{isAdminAuthenticated ? 'Admin Console (Logged In)' : 'Staff Security Gateway'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Dispatches */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              The Botanical Leaflet
            </h4>
            <p className="text-[13px] text-[#5e5e5e] leading-relaxed">
              Occasional updates on newly cured soap batches and seasonal harvest batches.
            </p>
            {subscribed ? (
              <p className="text-[12px] text-black bg-white p-3 border border-[#E5E5E5]">
                ✓ Subscribed to AKIA dispatches.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={monographEmail}
                  onChange={(e) => setMonographEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full h-11 px-4 bg-white border border-[#E5E5E5] focus:border-black focus:outline-none text-[13px] placeholder:text-[#747878] rounded-none"
                />
                <button
                  type="submit"
                  className="w-full h-11 bg-black text-white text-[12px] uppercase tracking-widest hover:bg-[#8B261D] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#5e5e5e]">
          <div className="flex items-center gap-2">
            <p>© 2026 AKIA Hand Made & Herbal Care. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 tracking-wider uppercase font-mono text-[11px] flex-wrap justify-center">
            <span className="text-[#8B261D] font-medium">Direct UPI</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>Google Pay</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>PhonePe</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>Paytm</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>WhatsApp Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
