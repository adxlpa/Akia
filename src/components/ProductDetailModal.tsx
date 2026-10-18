import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { activeProductModal, setActiveProductModal, addToCart } = useStore();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'inci' | 'ritual' | 'provenance'>('inci');

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isOutOfStock = product.stock <= 0;
  const currentVariant = product.variants?.[selectedVariantIdx];
  const unitPrice = currentVariant ? currentVariant.price : product.price;
  const savings = product.marketRate && product.marketRate > unitPrice ? product.marketRate - unitPrice : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, currentVariant?.name, quantity);
    setActiveProductModal(null);
  };

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setActiveProductModal(null)}
    >
      <div
        className="bg-white max-w-4xl w-full border border-[#E5E5E5] shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 border border-[#E5E5E5] text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="bg-[#F5F4F2] p-8 sm:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E5E5E5] relative">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-black text-white text-[11px] uppercase tracking-widest px-3 py-1 font-mono">
                {product.badge}
              </span>
            )}
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`max-h-[380px] w-full object-contain ${
                isOutOfStock ? 'grayscale opacity-60' : ''
              }`}
            />
          </div>

          {/* Right: Product Info & Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#5e5e5e] font-mono uppercase mb-2">
                <span>{product.categoryName}</span>
                <span>{currentVariant ? currentVariant.weight : product.weight}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl text-black font-normal tracking-tight mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#C9A227] text-sm">
                  {'★'.repeat(Math.floor(product.rating || 5))}
                </div>
                <span className="text-xs text-[#5e5e5e] font-mono">
                  {product.rating || 4.9} ({product.reviewCount || 48} patron reviews)
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-[#E5E5E5]">
                <span className="text-2xl font-semibold text-black font-mono">
                  ₹{unitPrice.toLocaleString('en-IN')}
                </span>
                {product.marketRate && (
                  <span className="text-sm text-[#747878] line-through font-mono">
                    ₹{product.marketRate.toLocaleString('en-IN')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs bg-[#C9A227]/10 text-[#C9A227] px-2 py-0.5 font-semibold font-mono uppercase">
                    Save ₹{savings}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#5e5e5e] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variant selector if available */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-[11px] font-semibold uppercase text-black font-mono mb-2">
                    Select Formulation Volume
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariantIdx(i)}
                        className={`px-3 py-1.5 text-xs font-mono transition-colors border ${
                          selectedVariantIdx === i
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-[#5e5e5e] border-[#E5E5E5] hover:border-black'
                        }`}
                      >
                        {v.name} — ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status indicator */}
              <div className="flex items-center gap-2 mb-6 text-xs font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? 'bg-red-600' : 'bg-emerald-600 animate-pulse'
                  }`}
                />
                <span className={isOutOfStock ? 'text-red-600' : 'text-[#5e5e5e]'}>
                  {isOutOfStock
                    ? 'Currently Out of Stock (Next batch curing)'
                    : `In Stock: ${product.stock} units available in laboratory storage`}
                </span>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-[#E5E5E5] bg-white h-12">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-lg text-[#5e5e5e] hover:text-black disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={isOutOfStock || quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-full flex items-center justify-center text-lg text-[#5e5e5e] hover:text-black disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-grow h-12 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>{isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Bag — ₹${(unitPrice * quantity).toLocaleString('en-IN')}`}</span>
                </button>
              </div>
            </div>

            {/* Monograph Tabs: INCI, Ritual, Provenance */}
            <div className="border-t border-[#E5E5E5] pt-4">
              <div className="flex items-center gap-4 border-b border-[#E5E5E5] mb-3 pb-2 text-[11px] font-mono uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab('inci')}
                  className={`transition-colors ${
                    activeTab === 'inci'
                      ? 'text-black font-semibold border-b-2 border-black pb-2 -mb-2.5'
                      : 'text-[#5e5e5e] hover:text-black'
                  }`}
                >
                  INCI Disclosure
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ritual')}
                  className={`transition-colors ${
                    activeTab === 'ritual'
                      ? 'text-black font-semibold border-b-2 border-black pb-2 -mb-2.5'
                      : 'text-[#5e5e5e] hover:text-black'
                  }`}
                >
                  Usage Ritual
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('provenance')}
                  className={`transition-colors ${
                    activeTab === 'provenance'
                      ? 'text-black font-semibold border-b-2 border-black pb-2 -mb-2.5'
                      : 'text-[#5e5e5e] hover:text-black'
                  }`}
                >
                  Provenance
                </button>
              </div>

              <div className="text-xs text-[#5e5e5e] leading-relaxed">
                {activeTab === 'inci' && (
                  <p>
                    <span className="text-black font-semibold">100% Full Declaration: </span>
                    {product.inci ||
                      'Cold-pressed single-source vegetal oils, pure distilled botanical extractives, natural mineral matrix. Zero phthalates, parabens, synthetic fragrances, or silicones.'}
                  </p>
                )}
                {activeTab === 'ritual' && (
                  <p>
                    {product.directions ||
                      'Warm between hands to activate herbal lipids. Work onto skin or target surface with gentle circular pressure. For best efficacy, store away from direct sunlight.'}
                  </p>
                )}
                {activeTab === 'provenance' && (
                  <p>
                    Micro-distilled in batches under 200 units at our coastal atelier. Hand-labeled and poured into infinitely recyclable amber glass or virgin aluminum vessels.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
