import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      stars: 5,
      quote:
        '“The Revive Serum completely shifted my relationship with skincare. It absorbs instantly without greasy residue and smells like raw meadow seeds. No perfumes, just genuine botanical potency.”',
      author: 'Devika Mehra',
      location: 'Verified Buyer • New Delhi',
      product: 'Revive Amber Serum',
    },
    {
      stars: 5,
      quote:
        '“Finding a natural kitchen cleaner that actually cuts grease without artificial lemon fragrance felt impossible. The thyme and eucalyptus solution leaves our marble flawless.”',
      author: 'Marcus Sterling',
      location: 'Verified Buyer • Bengaluru',
      product: 'Multi-Surface Spray',
    },
    {
      stars: 5,
      quote:
        '“The charcoal bar is cured to perfection. It lasts nearly two months and hasn’t dried out my sensitive winter skin once. The packaging minimalism is unmatched.”',
      author: 'Ananya Roy',
      location: 'Verified Buyer • Mumbai',
      product: 'Charcoal Soap Bar',
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="customer-reviews">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-3 border-b border-[#E5E5E5] gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e5e5e] mb-1">
              Patron Feedback
            </p>
            <h2 className="text-3xl lg:text-4xl text-black font-normal tracking-tight">
              What people are saying
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end text-[#C9A227] text-[14px]">
                ★★★★★
              </div>
              <span className="text-[12px] text-[#5e5e5e] font-mono">
                4.9 average from 2,400+ reviews
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial Editorial Cards (3-col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 bg-white border border-[#E5E5E5] flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="flex items-center text-[#C9A227] text-[13px] mb-4">
                  {'★'.repeat(rev.stars)}
                </div>
                <p className="text-[15px] text-[#1a1c1c] leading-relaxed mb-6 font-normal">
                  {rev.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase text-black">
                    {rev.author}
                  </p>
                  <p className="text-[11px] text-[#5e5e5e]">{rev.location}</p>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#747878]">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
