import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ReviewsView: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter, reviews, isAdminAuthenticated } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'soaps' | 'hair' | 'facewash' | 'gels'>('all');

  const filteredReviews = selectedFilter === 'all'
    ? reviews
    : reviews.filter((r) => {
        const cat = (r.category || '').toLowerCase();
        if (selectedFilter === 'soaps') return cat.includes('soap');
        if (selectedFilter === 'hair') return cat.includes('hair') || cat.includes('oil') || cat.includes('shampoo');
        if (selectedFilter === 'facewash') return cat.includes('face') || cat.includes('wash') || cat.includes('cleans');
        if (selectedFilter === 'gels') return cat.includes('gel') || cat.includes('cream');
        return cat === selectedFilter;
      });

  const hasReviews = reviews.length > 0;
  const avgRatingNumber = hasReviews
    ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length
    : 5.0;
  const avgRatingFormatted = avgRatingNumber.toFixed(1);
  const fullStarsCount = Math.round(avgRatingNumber);

  return (
    <div className="pt-28 pb-20 bg-[#f9f9f9]">
      {/* Accessible Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
          <li>
            <button onClick={() => setActiveView('home')} className="hover:text-black transition-colors">
              Home
            </button>
          </li>
          <li>/</li>
          <li className="text-black font-semibold" aria-current="page">
            Customer Reviews & Testimonials
          </li>
        </ol>
      </nav>

      {/* Hero Score Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-[#E5E5E5] pb-6 md:pb-0 md:pr-8">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-1">
                Verified Customer Satisfaction
              </span>
              {hasReviews ? (
                <>
                  <div className="flex items-baseline justify-center md:justify-start gap-3 mt-2">
                    <span className="text-5xl sm:text-6xl font-serif font-bold text-black leading-none">
                      {avgRatingFormatted}
                    </span>
                    <span className="text-xl text-[#747878] font-mono">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 my-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-[24px] ${
                          i < fullStarsCount ? 'text-amber-500' : 'text-neutral-300'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#5e5e5e] font-mono">
                    Based on {reviews.length} verified customer review{reviews.length !== 1 ? 's' : ''} across Kerala & all over India
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline justify-center md:justify-start gap-3 mt-2">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-black leading-none">
                      Awaiting Reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 text-neutral-300 my-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[24px]">
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#5e5e5e] font-mono">
                    Previous mock reviews cleared. Ready for authentic customer experiences.
                  </p>
                </>
              )}
            </div>

            <div className="md:col-span-7 flex flex-col justify-center space-y-3">
              <h1 className="text-2xl sm:text-3xl font-serif text-black leading-snug">
                Real Skin & Hair Transformations, Honest Experiences.
              </h1>
              <p className="text-xs sm:text-sm text-[#5e5e5e] leading-relaxed">
                We believe that word of mouth is the only genuine marketing for authentic herbal skincare. Here is what customers share after switching from mass-produced commercial products to AKIA hand-made botanicals.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20would%20like%20to%20share%20my%20feedback%20about%20my%20recent%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#8B261D] hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">rate_review</span>
                  <span>Share Your Experience With Us on WhatsApp</span>
                </a>
                {isAdminAuthenticated && (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-black hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: `All Reviews (${reviews.length})` },
            { id: 'soaps', label: 'Handmade Soaps' },
            { id: 'hair', label: 'Hair Care' },
            { id: 'facewash', label: 'Face Wash' },
            { id: 'gels', label: 'Gels & Creams' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`h-9 px-4 text-xs uppercase tracking-wider font-mono whitespace-nowrap transition-colors border ${
                selectedFilter === tab.id
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-[#5e5e5e] border-[#E5E5E5] hover:border-black hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Review Cards Grid or Empty State */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16">
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between text-left space-y-4 hover:border-black/50 transition-colors shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[16px]">
                          star
                        </span>
                      ))}
                    </div>
                    {rev.date && (
                      <span className="text-[10px] font-mono text-[#747878] uppercase">{rev.date}</span>
                    )}
                  </div>

                  <h3 className="text-base font-serif font-bold text-black leading-snug">
                    “{rev.headline}”
                  </h3>

                  <p className="text-xs text-[#5e5e5e] leading-relaxed whitespace-pre-line">
                    {rev.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-black">{rev.author}</span>
                    {rev.isVerified !== false && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        Verified Order
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#747878] font-mono">
                    <span>{rev.location || 'Kerala, India'}</span>
                    <span className="text-[#8B261D] font-medium">{rev.productName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E5E5] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#8B261D]">rate_review</span>
            <h3 className="text-xl font-serif text-black">
              {hasReviews ? 'No Reviews Under This Category' : 'No Customer Reviews Published Yet'}
            </h3>
            <p className="text-xs text-[#5e5e5e] font-mono leading-relaxed">
              {hasReviews
                ? 'Try selecting "All Reviews" or another category tab above to see existing reviews.'
                : 'The previous mock reviews have been removed. Add genuine customer reviews in the Admin Panel to display them here.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20would%20like%20to%20share%20my%20feedback%20about%20my%20recent%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-5 bg-black hover:bg-[#8B261D] text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Share Experience on WhatsApp</span>
              </a>
              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-10 px-5 bg-white border border-black hover:bg-black hover:text-white text-black text-xs uppercase tracking-widest font-mono font-medium transition-colors inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Add Reviews in Admin Panel</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Bottom CTA to Shop */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="bg-[#F5F4F2] border border-[#E5E5E5] p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif text-black">
            Ready to experience the difference of pure Kerala botanical formulations?
          </h2>
          <p className="text-xs text-[#5e5e5e] max-w-xl mx-auto leading-relaxed">
            All 16 products are in stock, freshly cured, and dispatched directly from our Kerala apothecary with free shipping over ₹1,000.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setActiveView('catalogue');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-11 px-8 bg-[#8B261D] hover:bg-black text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
