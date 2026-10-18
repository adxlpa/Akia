import React, { useState } from 'react';

export const ManifestoSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="w-full py-16 lg:py-24 bg-[#F5F4F2]" id="brand-story">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Story text column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B261D] font-mono">
                  The AKIA Manifesto
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl text-black font-serif font-normal leading-tight">
                  “If an ingredient doesn’t actively heal or nourish, it doesn’t belong in our formulation.”
                </h2>
              </div>
              <p className="text-[15px] sm:text-base text-[#5e5e5e] leading-relaxed">
                AKIA was founded with a singular devotion: returning to pure, honest, small-batch Ayurvedic and botanical care. Frustrated by harsh detergents and artificial foaming agents hidden under misleading claims, we handcraft our soaps using the traditional cold-cured method.
              </p>
              <p className="text-[15px] sm:text-base text-[#5e5e5e] leading-relaxed">
                Every soap bar is cured for 30 to 45 days with unrefined coconut oil, fresh aloe vera, holy thulasi, wild neem, and sacred red sandalwood. Our hair oils are slow-macerated with pure Brahmi and Bhringraj leaves to rejuvenate roots from scalp to tip.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-black border-b border-black pb-1 hover:text-[#8B261D] hover:border-[#8B261D] transition-colors"
                >
                  <span>Read AKIA Handcrafting Standards</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Visual Atelier Process Snapshot */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] bg-white border border-[#E5E5E5] overflow-hidden p-4 shadow-sm flex items-center justify-center">
                <img
                  src="/images/products/thulasi-soap.jpg"
                  alt="AKIA Handcrafted Soap & Botanicals"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-[#E5E5E5] px-4 py-2 flex items-center gap-3">
                  <img src="/images/logo.png" alt="AKIA" className="w-8 h-8 rounded-full" />
                  <p className="text-[11px] font-mono uppercase tracking-wider text-black">
                    AKIA Heritage Laboratory — Kerala
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extraction Philosophy Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white max-w-2xl w-full border border-[#E5E5E5] p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] mb-6">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="AKIA" className="w-7 h-7 rounded-full" />
                <span className="text-[11px] font-semibold tracking-widest uppercase font-mono text-[#8B261D]">
                  AKIA Quality Standard & Botanical Purity
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#5e5e5e] hover:text-black"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-[14px] text-[#5e5e5e] leading-relaxed">
              <h3 className="text-xl text-black font-serif font-medium">100% Sulphate Free & Paraben Free</h3>
              <p>
                Mass-market industrial soaps often use synthetic sulfates (SLS/SLES) and harsh chemical foaming detergents that strip away the skin's protective acid mantle, leaving it dry, itchy, and prone to eczema or irritation.
              </p>
              <p>
                At AKIA, each formulation is cold-crafted with unadulterated botanical oils and medicinal herbs. We employ slow, gentle curing times to produce a rich, dense, naturally hydrating lather that soothes inflammation and promotes long-term dermal vitality.
              </p>
              <div className="bg-[#FDF5EA] p-4 border-l-2 border-[#8B261D] space-y-1 font-mono text-[12px] text-black">
                <div>PURITY MANDATE: 100% Free of artificial sulphates & parabens</div>
                <div>AUTHENTIC HERBS: Thulasi, Neem, Manjistha, Red Sandal, Brahmi</div>
                <div>CUSTOMER ASSISTANCE: Phone 8078462709 / 9497802709</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-10 px-6 bg-black text-white text-[12px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Close Monograph
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
