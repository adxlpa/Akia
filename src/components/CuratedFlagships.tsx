import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const CuratedFlagships: React.FC = () => {
  const { products, addToCart, setActiveProductModal, setActiveView } = useStore();

  // Find the 3 flagship products
  const serum = products.find((p) => p.id === 'prod-revive-serum');
  const cleaner = products.find((p) => p.id === 'prod-botanical-cleaner');
  const soap = products.find((p) => p.id === 'prod-charcoal-soap');

  const flagships = [serum, cleaner, soap].filter(Boolean);

  // Local state for selected variant indices
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: number }>({
    'prod-revive-serum': 0,
    'prod-botanical-cleaner': 0,
    'prod-charcoal-soap': 0,
  });

  const handleVariantSelect = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIndex }));
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* TRUST & ARTISANAL INTEGRITY STRIP */}
      {/* ========================================================================= */}
      <section className="w-full border-b border-[#E5E5E5] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-20 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-black text-[20px]">science</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Small-Batch Craft
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                Under 200 units per formulation, hand-numbered and tested.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-black text-[20px]">verified</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  100% Honest INCI
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                No vague "parfum", no fillers. Every molecule declared.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-black text-[20px]">recycling</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Plastic Neutral
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                100% infinitely recyclable apothecary amber glass & metal caps.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-black text-[20px]">spa</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Cruelty Free & Vegan
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                Cold-pressed vegetal actives. Zero animal derivative tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BEST SELLERS: "LOVED ON REPEAT" */}
      {/* ========================================================================= */}
      <section className="w-full py-16 lg:py-24 bg-[#f9f9f9]" id="best-sellers">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-3 border-b border-[#E5E5E5] gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e5e5e] mb-1">
                Curated Flagships
              </p>
              <h2 className="text-3xl lg:text-4xl text-black tracking-tight font-normal">
                Loved on repeat
              </h2>
            </div>
            <p className="text-[11px] font-mono text-[#5e5e5e] uppercase tracking-widest">
              Permanent Formulations / Constant Replenishment
            </p>
          </div>

          {/* Product Cards Grid (3-Up Exhibition) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {flagships.map((product) => {
              if (!product) return null;
              const vIndex = selectedVariants[product.id] || 0;
              const currentVariant = product.variants?.[vIndex];
              const displayPrice = currentVariant ? currentVariant.price : product.price;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white border border-[#E5E5E5] hover:border-black transition-colors duration-200"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => setActiveProductModal(product)}
                    className="relative w-full aspect-square overflow-hidden bg-[#F5F4F2] flex items-center justify-center p-8 cursor-pointer"
                  >
                    {product.badge && (
                      <span className="absolute top-4 left-4 z-10 bg-black text-white text-[11px] uppercase tracking-widest px-2.5 py-1">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Info & Purchase Area */}
                  <div className="p-6 flex flex-col flex-grow justify-between border-t border-[#E5E5E5]">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center text-[#C9A227] text-[13px] tracking-tight">
                          {'★'.repeat(Math.floor(product.rating || 5))}
                          <span className="text-[#5e5e5e] ml-1 text-[12px] font-normal">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                        <span className="text-[11px] uppercase tracking-wider text-[#5e5e5e] font-mono">
                          {product.weight}
                        </span>
                      </div>

                      <h3
                        onClick={() => setActiveProductModal(product)}
                        className="text-lg font-medium text-black mb-1 cursor-pointer hover:underline underline-offset-4"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[13px] text-[#5e5e5e] mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5E5E5]">
                      {/* Variant Selector Chips if available */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          {product.variants.map((v, idx) => (
                            <button
                              key={v.name}
                              type="button"
                              onClick={() => handleVariantSelect(product.id, idx)}
                              className={`px-3 py-1 text-xs transition-colors rounded-none border ${
                                vIndex === idx
                                  ? 'border-black bg-black text-white'
                                  : 'border-[#E5E5E5] hover:border-black text-[#5e5e5e]'
                              }`}
                            >
                              {v.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Price and Add to Cart */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-lg text-black font-semibold font-mono">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          {product.marketRate && (
                            <span className="text-[11px] text-[#5e5e5e] line-through font-mono">
                              Mkt: ₹{product.marketRate.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const chosenVariant = product.variants?.[vIndex];
                            addToCart(product, chosenVariant?.name, 1);
                          }}
                          className="h-10 px-4 bg-black text-white text-[12px] uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Complete Formulations Index */}
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setActiveView('catalogue');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center h-12 px-8 border border-black text-black hover:bg-black hover:text-white transition-colors text-[12px] uppercase tracking-widest"
            >
              View Complete Formulations Index ({products.length})
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
