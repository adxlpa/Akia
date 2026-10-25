import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const CatalogueView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    addToCart,
    setActiveProductModal,
    setActiveView,
  } = useStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'savings'>('featured');

  // Filter only active categories and active products for customer view (PDF Section 18)
  const activeCategories = useMemo(
    () => categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter((p) => {
        if (!selectedCategoryFilter) return true;
        return p.categoryId === selectedCategoryFilter;
      })
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.inci && p.inci.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'savings') {
          const savingsA = (a.marketRate || a.price) - a.price;
          const savingsB = (b.marketRate || b.price) - b.price;
          return savingsB - savingsA;
        }
        return 0; // featured/default order
      });
  }, [products, selectedCategoryFilter, search, sortBy]);

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20">
        {/* Breadcrumb & Section Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-8 pt-4">
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-2 text-xs text-[#5e5e5e] font-mono uppercase">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-black transition-colors"
                >
                  Home
                </button>
              </li>
              <li>/</li>
              <li className="text-black font-semibold" aria-current="page">
                Formulations Catalogue
              </li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl text-black font-normal tracking-tight">
                All Formulations Index
              </h1>
              <p className="text-[14px] text-[#5e5e5e] mt-1 max-w-xl">
                Small-batch cold-pressed soaps, therapeutic botanical face washes, pure herbal gels, and clean domestic formulas.
              </p>
            </div>
            <span className="text-xs font-mono text-[#5e5e5e] uppercase tracking-widest">
              Showing {filteredProducts.length} Formulations
            </span>
          </div>
        </div>

        {/* Filter Bar & Search Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter(null)}
              className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap border ${
                selectedCategoryFilter === null
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#5e5e5e] border-[#E5E5E5] hover:border-black hover:text-black'
              }`}
            >
              All Formulations ({products.filter((p) => p.isActive).length})
            </button>
            {activeCategories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id && p.isActive).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap border ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-[#5e5e5e] border-[#E5E5E5] hover:border-black hover:text-black'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#747878]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredients, names..."
                className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#E5E5E5] focus:outline-none focus:border-black rounded-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-[#5e5e5e] hover:text-black"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 text-xs bg-white border border-[#E5E5E5] focus:outline-none focus:border-black uppercase font-mono tracking-wider cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="savings">Greatest Savings</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-16 text-center">
            <span className="material-symbols-outlined text-[#747878] text-[48px] mb-3">
              filter_list_off
            </span>
            <h3 className="text-xl font-medium text-black mb-1">No formulations match your criteria</h3>
            <p className="text-sm text-[#5e5e5e] mb-6">
              Try adjusting your search terms or category selection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategoryFilter(null);
              }}
              className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => setActiveProductModal(product)}
                onAddToCart={() => {
                  if (product.variants && product.variants.length > 1) {
                    setActiveProductModal(product);
                  } else {
                    addToCart(product, undefined, 1);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const savings = product.marketRate && product.marketRate > product.price ? product.marketRate - product.price : 0;
  const hasMultipleVariants = product.variants && product.variants.length > 1;

  return (
    <div className="group flex flex-col bg-white border border-[#E5E5E5] hover:border-black transition-colors duration-200">
      {/* Product Image Frame */}
      <div
        onClick={onSelect}
        className="relative w-full aspect-square overflow-hidden bg-[#F5F4F2] flex items-center justify-center p-6 cursor-pointer"
      >
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] uppercase tracking-widest px-2 py-0.5 font-mono">
            {product.badge}
          </span>
        )}

        {savings > 0 && !product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#C9A227] text-white text-[10px] uppercase tracking-widest px-2 py-0.5 font-mono font-semibold">
            Save ₹{savings}
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 font-mono">
            Out of Stock
          </span>
        )}

        <img
          src={product.imageUrl}
          alt={`${product.name} - Handcrafted Ayurvedic ${product.categoryName}`}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${
            isOutOfStock ? 'opacity-50 grayscale' : ''
          }`}
        />
      </div>

      {/* Info & Buy Content */}
      <div className="p-5 flex flex-col flex-grow justify-between border-t border-[#E5E5E5]">
        <div>
          <div className="flex items-center justify-between mb-1 text-[11px] text-[#5e5e5e] font-mono">
            <span className="uppercase">{product.categoryName}</span>
            <span>{hasMultipleVariants ? `${product.variants!.length} Sizes Available` : product.weight}</span>
          </div>

          <h3
            onClick={onSelect}
            className="text-[15px] font-medium text-black mb-1 cursor-pointer hover:underline line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-[12px] text-[#5e5e5e] mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {hasMultipleVariants && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.variants!.map((v) => (
                <span
                  key={v.name}
                  onClick={onSelect}
                  className="cursor-pointer text-[10px] font-mono bg-[#f9f9f9] hover:bg-neutral-200 border border-[#E5E5E5] px-1.5 py-0.5 text-[#5e5e5e]"
                >
                  {v.weight || v.name}: ₹{v.price}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-[16px] font-semibold text-black font-mono">
                  {hasMultipleVariants ? `From ₹${Math.min(...product.variants!.map(v => v.price))}` : `₹${product.price.toLocaleString('en-IN')}`}
                </span>
                {product.marketRate && (
                  <span className="text-[11px] text-[#747878] line-through font-mono">
                    ₹{product.marketRate}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#5e5e5e] font-mono">
                {isOutOfStock ? (
                  <span className="text-red-600 font-medium">Temporarily Unavailable</span>
                ) : (
                  <span>Available: {product.stock} units</span>
                )}
              </span>
            </div>

            {product.rating && (
              <div className="flex items-center text-[#C9A227] text-[11px]">
                ★ <span className="text-[#5e5e5e] ml-0.5">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className={`w-full h-9 text-[11px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isOutOfStock ? 'block' : (hasMultipleVariants ? 'tune' : 'add')}
            </span>
            <span>{isOutOfStock ? 'Out of Stock' : (hasMultipleVariants ? 'Select Size / Add' : 'Add to Bag')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
