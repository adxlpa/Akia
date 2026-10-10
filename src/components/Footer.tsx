import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();
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
    <footer className="w-full bg-[#F5F4F2] border-t border-[#E5E5E5]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Shop Formulations
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('facewash-cleansing')}
                  className="hover:text-black transition-colors text-left"
                >
                  Botanical Skincare
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('handmade-soaps')}
                  className="hover:text-black transition-colors text-left"
                >
                  Restorative Bodycare
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('eco-domestic')}
                  className="hover:text-black transition-colors text-left"
                >
                  Artisanal Eco-Cleaning
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('hair-care')}
                  className="hover:text-black transition-colors text-left"
                >
                  Ayurvedic Hair Care
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav('creams-lip-care')}
                  className="hover:text-black transition-colors text-left"
                >
                  Balms & Lip Care
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav(null)}
                  className="hover:text-black transition-colors text-left font-medium"
                >
                  Full Formulations Index
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Maison & Ethos
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-black transition-colors text-left"
                >
                  The AKIRA Philosophy
                </button>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Cold-Pressed Extraction</span>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Zero Microplastic Standard</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-black transition-colors text-left"
                >
                  Laboratory Testimonials
                </button>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Artisan Provenance</span>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Concierge
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('order-track')}
                  className="hover:text-black transition-colors text-left font-medium underline underline-offset-4"
                >
                  Track Consignment
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210?text=Hello%20AKIRA,%20I%20would%20like%20a%20complimentary%20consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors flex items-center gap-1"
                >
                  <span>WhatsApp Concierge</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </a>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Shipping & Duties (Free &gt; ₹1,500)</span>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Returns & Replacements</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('admin')}
                  className="hover:text-black transition-colors text-left text-neutral-800"
                >
                  Admin Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              Transparency
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#5e5e5e]">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav(null)}
                  className="hover:text-black transition-colors text-left"
                >
                  Full INCI Index
                </button>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Sustainably Sourced Amber Glass</span>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Fair Harvest Protocols</span>
              </li>
              <li>
                <span className="text-[#5e5e5e]">Batch Certificate Standards</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Monograph */}
          <div className="space-y-4 lg:col-span-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-black font-mono">
              The Monograph
            </h4>
            <p className="text-[13px] text-[#5e5e5e] leading-relaxed">
              Occasional dispatches on slow botanical craft, formulation chemistry, and limited editions.
            </p>
            {subscribed ? (
              <p className="text-[12px] text-black bg-white p-3 border border-[#E5E5E5]">
                ✓ Subscribed to Monograph dispatches.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={monographEmail}
                  onChange={(e) => setMonographEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full h-11 px-4 bg-white border border-[#E5E5E5] focus:border-black focus:outline-none text-[13px] placeholder:text-[#747878] rounded-none"
                />
                <button
                  type="submit"
                  className="w-full h-11 bg-black text-white text-[12px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#5e5e5e]">
          <div className="flex items-center gap-3">
            <p>© 2025 AKIRA Botanical Laboratory. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 tracking-wider uppercase font-mono text-[11px] flex-wrap justify-center">
            <span className="text-black font-medium">UPI</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>Google Pay</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>PhonePe</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>Paytm</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>Mastercard</span>
            <span className="text-[#E5E5E5]">|</span>
            <span>Visa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
