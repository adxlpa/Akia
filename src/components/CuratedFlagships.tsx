import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const CuratedFlagships: React.FC = () => {
  const { products, addToCart, setActiveProductModal, setActiveView } = useStore();

  // Find the flagship AKIA products from brochure
  const thulasiSoap = products.find((p) => p.id === 'prod-thulasi-soap') || products[0];
  const hairOil = products.find((p) => p.id === 'prod-bhringraj-hair-oil') || products[1];
  const manjisthadiWash = products.find((p) => p.id === 'prod-manjisthadi-facewash') || products[2];

  const flagships = [thulasiSoap, hairOil, manjisthadiWash].filter((p): p is Product => Boolean(p));

  // Local state for selected variant indices
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: number }>({
    'prod-thulasi-soap': 0,
    'prod-bhringraj-hair-oil': 0,
    'prod-manjisthadi-facewash': 0,
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
                <span className="material-symbols-outlined text-[#8B261D] text-[20px]">eco</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Sulphate & Paraben Free
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                100% natural, cold-cured botanical soaps safe for sensitive skin.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#8B261D] text-[20px]">verified</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Handcrafted in Kerala
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                Small-batch artisan preparation honoring authentic herbal traditions.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#8B261D] text-[20px]">spa</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Pure Herbal Actives
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                Enriched with Thulasi, Neem, Manjistha, Red Sandal, & Brahmi.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#8B261D] text-[20px]">phone_in_talk</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-black">
                  Direct Phone / WhatsApp
                </span>
              </div>
              <p className="text-[13px] text-[#5e5e5e] leading-snug">
                Call 8078462709 or 9497802709 for personalized consultations.
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
                AKIA Flagships
              </p>
              <h2 className="text-3xl lg:text-4xl text-black tracking-tight font-serif font-normal">
                Loved on repeat
              </h2>
            </div>
            <p className="text-[11px] font-mono text-[#5e5e5e] uppercase tracking-widest">
              Brochure Highlights / Daily Botanical Rituals
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
                    className="relative w-full aspect-square overflow-hidden bg-[#F5F4F2] flex items-center justify-center p-4 cursor-pointer"
                  >
                    {product.badge && (
                      <span className="absolute top-4 left-4 z-10 bg-[#8B261D] text-white text-[11px] uppercase tracking-widest px-2.5 py-1 font-mono">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} - ${product.categoryName}`}
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
                        <span className="text-[12px] font-mono text-[#5e5e5e]">
                          {product.categoryName}
                        </span>
                      </div>

                      <h3
                        onClick={() => setActiveProductModal(product)}
                        className="text-lg font-medium text-black cursor-pointer hover:underline decoration-1 underline-offset-4"
                      >
                        {product.name}
                      </h3>

                      <p className="mt-2 text-[13px] text-[#5e5e5e] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                      {/* Variant Selection if available */}
                      {product.variants && product.variants.length > 1 && (
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                          {product.variants.map((variant, idx) => (
                            <button
                              key={variant.name}
                              type="button"
                              onClick={() => handleVariantSelect(product.id, idx)}
                              className={`text-[11px] px-2.5 py-1 border transition-colors whitespace-nowrap font-mono ${
                                vIndex === idx
                                  ? 'border-black bg-black text-white'
                                  : 'border-[#E5E5E5] text-[#5e5e5e] hover:border-black'
                              }`}
                            >
                              {variant.name}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-medium text-black font-mono">
                            ₹{displayPrice}
                          </span>
                          {product.marketRate && (
                            <span className="text-[13px] text-[#747878] line-through font-mono">
                              ₹{product.marketRate}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product, currentVariant?.name, 1)}
                          className="h-10 px-5 bg-black text-white hover:bg-[#8B261D] text-[12px] uppercase tracking-widest font-medium transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          <span>Acquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom view all link */}
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => {
                setActiveView('catalogue');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-black border-b border-black pb-1 hover:text-[#8B261D] hover:border-[#8B261D] transition-colors"
            >
              <span>Explore All 16 Formulations In Catalogue</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
