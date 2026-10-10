import React from 'react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartItemCount,
    isShippingFree,
    shippingRemaining,
    settings,
    calculatedDeliveryCharge,
    setActiveView,
  } = useStore();

  if (!cartOpen) return null;

  const threshold = settings.freeShippingThreshold;
  const progressPct = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <aside className="relative w-full sm:w-[440px] h-full bg-white shadow-2xl border-l border-[#E5E5E5] flex flex-col z-[101] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-black uppercase tracking-tight">
              Your Bag
            </span>
            <span className="text-xs text-[#5e5e5e] font-mono">({cartItemCount})</span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            type="button"
            className="p-1 text-black hover:text-[#5e5e5e] transition-colors"
            aria-label="Close cart drawer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Free Shipping Progress Track */}
        <div className="p-4 bg-[#F5F4F2] border-b border-[#E5E5E5]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-black font-medium tracking-wide">
              {isShippingFree
                ? 'Complimentary shipping unlocked!'
                : `You are ₹${shippingRemaining.toLocaleString('en-IN')} away from free shipping`}
            </span>
            <span className="font-mono text-[#5e5e5e]">₹{threshold.toLocaleString('en-IN')} threshold</span>
          </div>
          <div className="w-full h-1 bg-[#E5E5E5]">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Line Items Scroll List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-5">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[#747878] text-[40px] mb-2">
                shopping_bag
              </span>
              <p className="text-lg font-medium text-black mb-1">Your bag is empty</p>
              <p className="text-sm text-[#5e5e5e] mb-4">
                Discover our cold-pressed small-batch batches.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  setActiveView('catalogue');
                }}
                className="h-10 px-5 border border-black text-black text-[12px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Browse Formulations
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.variantName}`}
                className="flex gap-4 border-b border-[#E5E5E5] pb-5"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-[#F5F4F2] flex-shrink-0 border border-[#E5E5E5] overflow-hidden p-1 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-[14px] font-medium text-black leading-tight">
                        {item.productName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.variantName)}
                        className="text-[#5e5e5e] hover:text-black ml-2"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                    <p className="text-[12px] text-[#5e5e5e] mt-0.5 font-mono">
                      {item.variantName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E5E5E5] bg-white">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.variantName, -1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5e5e5e] hover:text-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-xs font-mono text-black font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.variantName, 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5e5e5e] hover:text-black transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-[14px] font-mono text-black font-semibold">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Sticky Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#E5E5E5] bg-white space-y-3">
            <div className="space-y-1.5 text-sm text-[#5e5e5e]">
              <div className="flex justify-between items-baseline">
                <span>Subtotal</span>
                <span className="text-xl text-black font-semibold font-mono">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Standard Dispatch</span>
                <span className="text-black uppercase tracking-wider font-mono font-medium">
                  {calculatedDeliveryCharge === 0 ? 'Free' : `₹${calculatedDeliveryCharge}`}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#747878] text-center py-1">
              Taxes calculated at checkout • Recyclable apothecary packing
            </p>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full h-12 bg-black text-white text-[12px] uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-[11px] uppercase tracking-widest text-[#5e5e5e] hover:text-black py-1"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
