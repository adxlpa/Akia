import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  category: 'soaps' | 'hair' | 'facewash' | 'gels';
  productName: string;
  headline: string;
  content: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Anjali Menon',
    location: 'Kochi, Kerala',
    rating: 5,
    date: 'October 12, 2026',
    category: 'soaps',
    productName: 'Akia Thulasi Soap',
    headline: 'Cleared hormonal acne without drying my skin!',
    content: 'I have struggled with persistent jawline acne for over two years. Regular soaps made my cheeks taut and flaky. Within 3 weeks of using the Thulasi soap twice daily, my active breakouts dried up and redness subsided significantly. The natural herbal aroma is so calming.',
  },
  {
    id: 'rev-2',
    author: 'Dr. Rahul Varma',
    location: 'Thiruvananthapuram',
    rating: 5,
    date: 'October 8, 2026',
    category: 'hair',
    productName: 'Brahmi Bhringaraj Hair Oil',
    headline: 'Significant reduction in hair fall and amazing sleep.',
    content: 'The oil has an authentic slow-cooked herbal aroma, not artificial fragrance. Applying it warmed before bedtime has genuinely helped with scalp itchiness and hair thinning. Also noticeably helps me fall asleep faster.',
  },
  {
    id: 'rev-3',
    author: 'Devika S.',
    location: 'Calicut, Kerala',
    rating: 5,
    date: 'September 28, 2026',
    category: 'soaps',
    productName: 'Akia Manjisthadi Soap',
    headline: 'Visible reduction in stubborn sun tan.',
    content: 'My hands and face had an uneven tan after daily driving. The Manjisthadi soap lather is creamy and feels luxurious. After one month, my skin tone is much more uniform and glowing. Reordering the twin pack!',
  },
  {
    id: 'rev-4',
    author: 'Lakshmi Nambiar',
    location: 'Thrissur, Kerala',
    rating: 5,
    date: 'September 20, 2026',
    category: 'gels',
    productName: 'Akia Nalpamarathi Gel',
    headline: 'All the benefits of Nalpamaradi oil without the greasy heaviness!',
    content: 'Traditional Nalpamaradi thailam leaves yellow stains on pillows and feels sticky in humid weather. This gel formulation absorbs in 30 seconds and leaves zero oily residue. My dark acne spots have lightened considerably.',
  },
  {
    id: 'rev-5',
    author: 'Sanjay Krishnan',
    location: 'Bengaluru',
    rating: 5,
    date: 'September 15, 2026',
    category: 'facewash',
    productName: 'Akia Manjisthadi Face Wash',
    headline: 'Gentle, refreshing herbal cleanse.',
    content: 'Ordered to Bangalore, arrived in 3 days in neat eco-packaging. Extremely gentle on morning skin, does not leave any tight or stripped sensation. The natural saffron and manjistha infusion feels premium.',
  },
  {
    id: 'rev-6',
    author: 'Deepa Rajan',
    location: 'Kottayam, Kerala',
    rating: 5,
    date: 'September 5, 2026',
    category: 'soaps',
    productName: 'Akia Goat Milk Soap',
    headline: 'A lifesaver for my child’s dry, sensitive skin.',
    content: 'My 6-year old daughter has dry, eczema-prone skin on her arms. Commercial baby soaps still caused flare-ups. The Akia Goat Milk soap is so mild and moisturizing that we stopped needing heavy lotions after bathing.',
  },
  {
    id: 'rev-7',
    author: 'Fathima Rasheed',
    location: 'Malappuram, Kerala',
    rating: 5,
    date: 'August 28, 2026',
    category: 'soaps',
    productName: 'Akia Red Sandal Soap',
    headline: 'Keeps oily T-zone matte and calm all day.',
    content: 'Red sandalwood has always been our family remedy for prickly heat and oil control. This handmade bar lasts a long time if kept dry, and balances my oily skin effortlessly.',
  },
  {
    id: 'rev-8',
    author: 'Meera Nair',
    location: 'Ernakulam, Kerala',
    rating: 5,
    date: 'August 20, 2026',
    category: 'hair',
    productName: 'Akia Herbal Shampoo',
    headline: 'Finally a sulphate-free shampoo that actually lathers well.',
    content: 'Shikakai and Reetha do an incredible job cleaning scalp buildup and oil without needing artificial SLS foam. Dandruff has completely gone after 4 washes.',
  },
];

export const ReviewsView: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'soaps' | 'hair' | 'facewash' | 'gels'>('all');

  const filteredReviews = selectedFilter === 'all'
    ? REVIEWS
    : REVIEWS.filter((r) => r.category === selectedFilter);

  return (
    <div className="pt-28 pb-20 bg-[#f9f9f9]">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
          <button onClick={() => setActiveView('home')} className="hover:text-black transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-black font-semibold">Customer Reviews & Testimonials</span>
        </div>
      </div>

      {/* Hero Score Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-[#E5E5E5] pb-6 md:pb-0 md:pr-8">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-1">
                Verified Customer Satisfaction
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-3 mt-2">
                <span className="text-5xl sm:text-6xl font-serif font-bold text-black leading-none">4.9</span>
                <span className="text-xl text-[#747878] font-mono">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 my-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[24px]">star</span>
                ))}
              </div>
              <p className="text-xs text-[#5e5e5e] font-mono">
                Based on 1,200+ verified customer orders across Kerala & all over India
              </p>
            </div>

            <div className="md:col-span-7 flex flex-col justify-center space-y-3">
              <h1 className="text-2xl sm:text-3xl font-serif text-black leading-snug">
                Real Skin & Hair Transformations, Honest Experiences.
              </h1>
              <p className="text-xs sm:text-sm text-[#5e5e5e] leading-relaxed">
                We believe that word of mouth is the only genuine marketing for authentic herbal skincare. Here is what customers share after switching from mass-produced commercial products to AKIA hand-made botanicals.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/918078462709?text=Hello%20AKIA,%20I%20would%20like%20to%20share%20my%20feedback%20about%20my%20recent%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#8B261D] hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">rate_review</span>
                  <span>Share Your Experience With Us on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'All Reviews (8)' },
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

      {/* Review Cards Grid */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between text-left space-y-4 hover:border-black/50 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]">star</span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#747878] uppercase">{rev.date}</span>
                </div>

                <h3 className="text-base font-serif font-bold text-black leading-snug">
                  “{rev.headline}”
                </h3>

                <p className="text-xs text-[#5e5e5e] leading-relaxed">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-black">{rev.author}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Verified Order
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#747878] font-mono">
                  <span>{rev.location}</span>
                  <span className="text-[#8B261D] font-medium">{rev.productName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
