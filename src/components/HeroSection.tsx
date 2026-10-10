import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const [rotationDeg, setRotationDeg] = useState(0);
  const { products, addToCart, setActiveProductModal } = useStore();

  const serumProduct = products.find((p) => p.id === 'prod-revive-serum') || products[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationDeg(parseInt(e.target.value, 10));
  };

  const perspectiveScale = 1 + Math.sin((rotationDeg * Math.PI) / 180) * 0.04;

  const handleExploreClick = () => {
    if (serumProduct) {
      setActiveProductModal(serumProduct);
    } else {
      const el = document.getElementById('brand-story');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-[#E5E5E5] pt-28">
      {/* Ambient architectural micro-grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundSize: '48px 48px',
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-5 lg:px-20 py-8 lg:py-16 flex flex-col items-center">
        {/* Monograph Header Bar */}
        <div className="w-full flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black"></span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-black">
              Edition No. 04
            </span>
          </div>
          <div className="flex items-center gap-3 text-[12px] uppercase text-[#5e5e5e] tracking-widest font-mono">
            <span>Batch Standard: 200 Flacons</span>
            <span className="text-[#E5E5E5]">/</span>
            <span>Cold-Extracted London</span>
          </div>
        </div>

        {/* Main Headline Callout */}
        <div className="text-center max-w-3xl mb-8">
          <p className="text-[11px] font-semibold uppercase text-[#5e5e5e] tracking-[0.2em] mb-3">
            The Signature Formulation
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-[76px] lg:leading-[84px] text-black tracking-tight font-normal text-balance">
            Made by hand.<br className="hidden sm:inline" /> Made to last.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5e5e5e] max-w-xl mx-auto leading-relaxed">
            Pure small-batch botanicals, formulated with monastic restraint and zero compromises.
          </p>
        </div>

        {/* Interactive 3D Turntable / Studio Pedestal Stage */}
        <div className="relative w-full max-w-5xl aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center bg-[#F5F4F2] my-4 border border-[#E5E5E5] select-none group overflow-hidden">
          {/* Live Rotation Degree Badge */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 px-3 py-1.5 border border-[#E5E5E5] backdrop-blur-sm shadow-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse"></span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
              360° CRAFT VIEW — Y-AXIS {rotationDeg}°
            </span>
          </div>

          {/* Technical Specification Callout 1: Left Top */}
          <div className="absolute left-4 lg:left-12 top-1/4 z-20 hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase text-black tracking-wider">
                Seed Extracts
              </p>
              <p className="text-[12px] text-[#5e5e5e]">99.4% Active lipid matrix</p>
            </div>
            <div className="w-12 lg:w-20 h-px bg-black/40"></div>
            <div className="w-1.5 h-1.5 bg-black"></div>
          </div>

          {/* Technical Specification Callout 2: Right Top */}
          <div className="absolute right-4 lg:right-12 top-1/3 z-20 hidden md:flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-black"></div>
            <div className="w-12 lg:w-20 h-px bg-black/40"></div>
            <div className="text-left">
              <p className="text-[11px] font-semibold uppercase text-black tracking-wider">
                Amber Flacon
              </p>
              <p className="text-[12px] text-[#5e5e5e]">Hand-numbered Batch 04</p>
            </div>
          </div>

          {/* Technical Specification Callout 3: Left Bottom */}
          <div className="absolute left-6 lg:left-16 bottom-16 z-20 hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase text-black tracking-wider">
                Clean INCI Integrity
              </p>
              <p className="text-[12px] text-[#5e5e5e]">Zero synthetic perfumes or sulfates</p>
            </div>
            <div className="w-10 lg:w-16 h-px bg-black/40"></div>
            <div className="w-1.5 h-1.5 bg-black"></div>
          </div>

          {/* Pedestal & Bottle Display */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfh8wflpeA35YySLo2pB9ChHVTBCY39g8DlDfItcdIpEzcVyB9LPcxB0QM934jHP7j6kp7jS-_ORveRyfYEA-WGBA_hfVvhLl3v_H22_FTqk7vdq9-39fppUAjLZRNJRMf6J9g2vjiybkj7l_n8HcIR3HiPpkyhJd0lAl08OOX3KSAD90wA2w9Bq9My6tXvjhuOkMk7ve4-o_3h47tX0MCtU1xPasUlRC84v_nC_iaAptX5MYXwjQX"
              alt="Akira Revive Amber Serum flacon on a solid round concrete pedestal with natural soft directional morning light"
              className="max-h-[82%] max-w-[82%] object-contain transition-transform duration-75 will-change-transform drop-shadow-[0_20px_35px_rgba(0,0,0,0.06)] pointer-events-none"
              style={{
                transform: `rotateY(${rotationDeg}deg) scale(${perspectiveScale})`,
              }}
            />
          </div>

          {/* Floating Scrub Slider Controller */}
          <div className="absolute bottom-6 inset-x-6 sm:inset-x-auto sm:w-96 flex flex-col items-center gap-2 bg-white/95 border border-[#E5E5E5] p-3 backdrop-blur-sm shadow-sm z-20">
            <div className="flex items-center justify-between w-full text-[11px] tracking-widest text-[#5e5e5e] uppercase">
              <span>Drag to Inspect</span>
              <span className="font-mono text-black font-semibold">{rotationDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationDeg}
              onChange={handleSliderChange}
              className="w-full accent-black h-1 bg-[#E5E5E5] rounded-none cursor-ew-resize appearance-none"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              if (serumProduct) {
                addToCart(serumProduct, '30ml Flacon', 1);
              }
            }}
            type="button"
            className="h-12 px-8 bg-black text-white text-[13px] font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Shop The Serum — ₹1,850</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            onClick={handleExploreClick}
            type="button"
            className="h-12 px-8 border border-black text-black hover:bg-black hover:text-white transition-colors text-[13px] font-medium uppercase tracking-widest flex items-center justify-center"
          >
            Explore The Formulation
          </button>
        </div>
      </div>
    </section>
  );
};
