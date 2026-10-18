import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      stars: 5,
      quote:
        '“The Akia Thulasi Soap completely transformed my skin. Pores feel genuinely cleansed, and my persistent acne breakouts reduced dramatically within two weeks. My skin literally shines naturally without dryness.”',
      author: 'Ananya Sharma',
      location: 'Verified Buyer • Kochi, Kerala',
      product: 'Akia Thulasi Soap',
    },
    {
      stars: 5,
      quote:
        '“The Brahmi Bhringaraj Hair Oil is exceptional. Traditional herbal richness that soothes the scalp, promotes deep sleep, and has visibly reduced my hair fall. You can tell it is slowly macerated with real herbs.”',
      author: 'Devika Nair',
      location: 'Verified Buyer • Thiruvananthapuram',
      product: 'Akia Brahmi Bhringaraj Hair Oil',
    },
    {
      stars: 5,
      quote:
        '“The Red Sandal Soap controls excess oil without stripping moisture. It calmed my skin redness and irritation immediately. Knowing it is 100% sulphate and paraben free makes all the difference.”',
      author: 'Kavitha R.',
      location: 'Verified Buyer • Bengaluru',
      product: 'Akia Red Sandal Soap',
    },
  ];

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
              <div className="flex items-center justify-end text-[#C9A227] text-[14px]">
                ★★★★★
              </div>
              <span className="text-[12px] text-[#5e5e5e] font-mono">
                4.9 average from 1,200+ patrons
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial Editorial Cards (3-col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#F9F9F9] border border-[#E5E5E5] flex flex-col justify-between hover:border-black transition-colors"
            >
              <div>
                <div className="text-[#C9A227] text-[14px] mb-4">
                  {'★'.repeat(rev.stars)}
                </div>
                <p className="text-[14px] text-black leading-relaxed font-normal">
                  {rev.quote}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-medium text-black">{rev.author}</h4>
                  <p className="text-[11px] text-[#5e5e5e] font-mono mt-0.5">{rev.location}</p>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#8B261D] font-mono font-semibold">
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
