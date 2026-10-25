import React from 'react';
import { useStore } from '../context/StoreContext';

export const NotFoundView: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();

  const handleGoHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoCatalogue = () => {
    setSelectedCategoryFilter(null);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoContact = () => {
    setActiveView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-[75vh] pt-32 pb-24 flex flex-col items-center justify-center text-center px-5">
      {/* Accessible Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
          <li>
            <button onClick={handleGoHome} className="hover:text-black transition-colors">
              Home
            </button>
          </li>
          <li>/</li>
          <li className="text-black font-semibold" aria-current="page">
            Page Not Found (404)
          </li>
        </ol>
      </nav>

      {/* Main 404 Card */}
      <div className="max-w-xl w-full bg-white border border-[#E5E5E5] p-8 sm:p-12 shadow-sm relative">
        <div className="w-16 h-16 rounded-full bg-[#FDF5EA] border border-[#ECD9C6] text-[#8B261D] flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[32px]">spa</span>
        </div>

        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8B261D] font-bold block mb-2">
          HTTP Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif text-black font-normal tracking-tight mb-4">
          Formulation or Page Not Found
        </h1>

        <p className="text-sm text-[#5e5e5e] leading-relaxed mb-8">
          The page you are looking for may have been retired, renamed, or is temporarily unavailable. Explore our handcrafted herbal soaps or return to the main apothecary.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="w-full sm:w-auto h-11 px-6 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Return to Home</span>
          </button>

          <button
            type="button"
            onClick={handleGoCatalogue}
            className="w-full sm:w-auto h-11 px-6 bg-[#8B261D] hover:bg-[#721f17] text-white text-xs font-mono uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Browse Formulations</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#5e5e5e]">
          <span>Need assistance?</span>
          <button
            type="button"
            onClick={handleGoContact}
            className="text-black font-semibold underline hover:text-[#8B261D] transition-colors"
          >
            Contact Atelier Concierge
          </button>
          <span>•</span>
          <a
            href="https://wa.me/918078462709"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-semibold hover:underline"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
};
