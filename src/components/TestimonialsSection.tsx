import React from 'react';
import { useStore } from '../context/StoreContext';

export const TestimonialsSection: React.FC = () => {
  const { setActiveView, reviews } = useStore();

  const hasReviews = reviews.length > 0;
  const avgRatingNumber = hasReviews
    ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length
    : 5.0;
  const avgRatingFormatted = avgRatingNumber.toFixed(1);
  const roundedStars = Math.round(avgRatingNumber);

  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="customer-reviews">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-3 border-b border-[#E5E5E5] gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e5e5e] mb-1 font-mono">
              Customer Feedback
            </p>
            <h2 className="text-3xl lg:text-4xl text-black font-serif font-normal tracking-tight">
              What patrons are saying
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              {hasReviews ? (
                <>
                  <div className="flex items-center justify-end text-[#C9A227] text-[14px]">
                    {'★'.repeat(roundedStars)}{'☆'.repeat(5 - roundedStars)}
                  </div>
                  <span className="text-[12px] text-[#5e5e5e] font-mono">
                    {avgRatingFormatted} average from {reviews.length} patron{reviews.length !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-[12px] text-[#5e5e5e] font-mono">
                  Authentic experiences & feedback
                </span>
              )}
            </div>
          </div>
        </div>

        {hasReviews ? (
          <>
            {/* Testimonial Editorial Cards (Up to 3-col) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {reviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="p-8 bg-[#F9F9F9] border border-[#E5E5E5] flex flex-col justify-between hover:border-black transition-colors"
                >
                  <div>
                    <div className="text-[#C9A227] text-[14px] mb-4">
                      {'★'.repeat(rev.rating || 5)}
                    </div>
                    {rev.headline && (
                      <h4 className="text-base font-serif font-bold text-black mb-2 leading-snug">
                        “{rev.headline}”
                      </h4>
                    )}
                    <p className="text-[13px] text-black leading-relaxed font-normal">
                      {rev.content}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <h4 className="text-[13px] font-medium text-black">{rev.author}</h4>
                      <p className="text-[11px] text-[#5e5e5e] font-mono mt-0.5">
                        {rev.isVerified !== false ? 'Verified Buyer • ' : ''}{rev.location || 'Kerala'}
                      </p>
                    </div>
                    {rev.productName && (
                      <span className="text-[11px] uppercase tracking-wider text-[#8B261D] font-mono font-semibold max-w-[120px] text-right truncate">
                        {rev.productName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Link to Dedicated Reviews Page */}
            <div className="mt-10 sm:mt-12 text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveView('reviews');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-11 px-6 bg-white border border-black hover:bg-black hover:text-white text-black text-xs uppercase tracking-widest font-mono font-medium transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <span>Read All Verified Customer Reviews ({reviews.length})</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </>
        ) : (
          <div className="p-10 lg:p-14 bg-[#F9F9F9] border border-[#E5E5E5] text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-[#8B261D]">spa</span>
            <h3 className="text-xl sm:text-2xl font-serif text-black font-normal">
              Freshly Cured Herbal Skincare Straight from Kerala
            </h3>
            <p className="text-xs text-[#5e5e5e] max-w-xl mx-auto leading-relaxed font-mono">
              All previous mock reviews have been removed. Have you experienced AKIA handmade soaps, face washes, or hair oils? Share your feedback with our herbalists directly!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20would%20like%20to%20share%20my%20feedback%20about%20my%20recent%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-5 bg-black hover:bg-[#8B261D] text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Share Feedback on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveView('reviews');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-10 px-5 bg-white border border-black hover:bg-black hover:text-white text-black text-xs uppercase tracking-widest font-mono font-medium transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">rate_review</span>
                <span>Visit Reviews Page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
