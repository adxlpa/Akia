import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, products, setActiveProductModal } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.inci && p.inci.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  if (!searchModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 px-4"
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        className="bg-white max-w-2xl w-full border border-[#E5E5E5] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#747878]">search</span>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search active botanicals, oils, soaps, shampoos, INCI..."
            className="flex-grow text-sm focus:outline-none placeholder:text-[#747878]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-[#5e5e5e] hover:text-black"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchModalOpen(false)}
            className="text-xs uppercase font-mono tracking-widest text-[#5e5e5e] hover:text-black ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {!searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-[#5e5e5e] font-mono">
              <p className="uppercase tracking-widest mb-2 font-semibold text-black">
                Suggested Dispatches:
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {['Revive Amber Serum', 'Charcoal & Olive Oil', 'Bhringraj Shampoo', 'Aloevera Gel', 'Kajal', 'Thulasi'].map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSearchTerm(s)}
                      className="px-2.5 py-1 bg-[#F5F4F2] border border-[#E5E5E5] hover:border-black text-[#1a1c1c] text-xs transition-colors"
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#5e5e5e] font-mono">
              No botanical formulations found for "{searchTerm}".
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setActiveProductModal(product);
                  setSearchModalOpen(false);
                }}
                className="flex items-center justify-between p-3 hover:bg-[#F5F4F2] cursor-pointer transition-colors border border-transparent hover:border-[#E5E5E5]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white border border-[#E5E5E5] flex items-center justify-center p-1 flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5e5e5e] font-mono uppercase block">
                      {product.categoryName} • {product.weight}
                    </span>
                    <h4 className="text-sm font-medium text-black">{product.name}</h4>
                    {product.inci && (
                      <p className="text-[11px] text-[#747878] truncate max-w-xs sm:max-w-md">
                        INCI: {product.inci}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right font-mono flex-shrink-0 ml-3">
                  <span className="text-sm font-semibold text-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.marketRate && (
                    <span className="text-[10px] text-[#747878] block line-through">
                      ₹{product.marketRate}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
