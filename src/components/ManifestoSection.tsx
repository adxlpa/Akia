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
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e5e5e]">
                  The Akira Manifesto
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl text-black font-normal leading-tight">
                  “If an ingredient doesn’t actively heal or clean, it doesn’t belong in our flacon.”
                </h2>
              </div>
              <p className="text-[15px] sm:text-base text-[#5e5e5e] leading-relaxed">
                We began in a modest London workshop in the spring of 2021. Frustrated by dilution metrics and synthetic thickeners hidden behind botanical buzzwords, we decided to manufacture in micro-runs of 200 units maximum.
              </p>
              <p className="text-[15px] sm:text-base text-[#5e5e5e] leading-relaxed">
                Every oil is cold-pressed under gentle mechanical force to preserve active terpenes. Our eco-cleaning solutions replace chlorine and artificial fragrances with fermented citrus extracts and wild mountain thyme.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-black border-b border-black pb-1 hover:text-[#5e5e5e] hover:border-[#5e5e5e] transition-colors"
                >
                  <span>Read Our Extraction Philosophy</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Visual Atelier Process Snapshot */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] bg-white border border-[#E5E5E5] overflow-hidden p-3 shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcTVGQUNSvLmbjLJPfVIArTG6aPtaFSZAKDOTe6E0hb68nBBgyRemspUXrsZxwINtDUeQdajiFi3UiAEG6w2P9NwPuh5vwW04wkT9T-nWTl_Vf1q2v78YTnZ8h6JnaPU94I-Y-f8JvYk9tTUflvRzkTfaO48heVbR6CzLz8HXlKnfz13tGEj7KVDnC9RvwXFceBuAkb3v0ezqteE2r8H-GPa44lF9Nx2k_Zcth9C-v-8sH07dLsvVA"
                  alt="Artisan hands measuring pure botanical oil into an amber glass beaker in a clean laboratory studio"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-[#E5E5E5] px-4 py-2">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-black">
                    Lab Notebook — Folio 148 / St. Ives
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
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black"></span>
                <span className="text-[11px] font-semibold tracking-widest uppercase font-mono">
                  Atelier Monograph / Technical Extraction
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
              <h3 className="text-xl text-black font-medium">Mechanical Cold Pressing Without Heat Shock</h3>
              <p>
                Commercial beauty formulations frequently subject botanical seeds and herbal leaves to petroleum-derived hexane extraction and flash thermal treatments reaching 180°C. While this extracts maximum volume, it irrevocably destroys delicate phytosterols and polyphenol structures.
              </p>
              <p>
                At AKIRA Botanical Laboratory, we employ slow mechanical screw-pressing calibrated under strict ambient temperature caps (under 32°C). Every batch of jojoba, rosehip, and cold-distilled mountain thyme settles in dark amber demijohns for 14 days before cold filtering.
              </p>
              <div className="bg-[#F5F4F2] p-4 border-l-2 border-black space-y-1 font-mono text-[12px] text-black">
                <div>INCI INTEGRITY STANDARD: Zero petrochemical solvents</div>
                <div>YIELD LOSS TOLERANCE: 42% accepted for active terpene purity</div>
                <div>PACKAGING MANDATE: 100% amber borosilicate glass & metal closures</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-10 px-6 bg-black text-white text-[12px] uppercase tracking-widest"
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
