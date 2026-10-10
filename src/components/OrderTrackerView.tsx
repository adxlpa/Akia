import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const OrderTrackerView: React.FC = () => {
  const { orders, setActiveView } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(orders[0] || null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === cleanQuery ||
        o.orderNumber.toLowerCase() === `#${cleanQuery}` ||
        o.phone.includes(cleanQuery) ||
        o.id.toLowerCase() === cleanQuery
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setError(`No consignment found matching "${query}". Please verify the Order Number (e.g. #1024) or phone number.`);
    }
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[900px] mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-8 pt-4">
          <div className="flex items-center gap-2 text-xs text-[#5e5e5e] font-mono uppercase mb-2">
            <span>Concierge</span>
            <span>/</span>
            <span className="text-black">Track Consignment</span>
          </div>
          <h1 className="text-3xl text-black font-normal tracking-tight">
            Order & Dispatch Lookup
          </h1>
          <p className="text-xs text-[#5e5e5e] mt-1 font-mono">
            Enter your 4-digit order number (e.g. #1024) or 10-digit registered phone number.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8 bg-white p-2 border border-[#E5E5E5]">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-[#747878]">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order #1024 or Phone 9876543210"
              className="w-full h-11 pl-10 pr-4 text-xs font-mono bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black rounded-none"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Track Status
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 mb-8 font-mono">
            {error}
          </div>
        )}

        {/* Order Details Display */}
        {searchedOrder && (
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-4 gap-3">
              <div>
                <span className="text-xs font-mono uppercase text-[#5e5e5e] block">
                  Consignment Identification
                </span>
                <h2 className="text-2xl font-mono text-black font-semibold">
                  {searchedOrder.orderNumber}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <span
                  className={`px-3 py-1 uppercase font-semibold ${
                    searchedOrder.paymentStatus === 'verified'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : searchedOrder.paymentStatus === 'submitted'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  Payment: {searchedOrder.paymentStatus}
                </span>

                <span
                  className={`px-3 py-1 uppercase font-semibold ${
                    searchedOrder.orderStatus === 'delivered'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : searchedOrder.orderStatus === 'shipped'
                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                      : 'bg-[#F5F4F2] text-black border border-[#E5E5E5]'
                  }`}
                >
                  Status: {searchedOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Timeline Stepper */}
            <div className="py-4">
              <span className="text-[11px] font-mono uppercase text-[#5e5e5e] block mb-4">
                Atelier Fulfillment Progress
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className={`p-2 border ${searchedOrder.orderStatus !== 'cancelled' ? 'border-black bg-neutral-900 text-white' : 'border-[#E5E5E5] text-[#747878]'}`}>
                  <div className="font-semibold">1. Created</div>
                  <div className="text-[10px] opacity-75">Order Logged</div>
                </div>
                <div className={`p-2 border ${['processing', 'packed', 'shipped', 'delivered'].includes(searchedOrder.orderStatus) ? 'border-black bg-neutral-900 text-white' : 'border-[#E5E5E5] text-[#747878]'}`}>
                  <div className="font-semibold">2. Processing</div>
                  <div className="text-[10px] opacity-75">Curing & Packing</div>
                </div>
                <div className={`p-2 border ${['shipped', 'delivered'].includes(searchedOrder.orderStatus) ? 'border-black bg-neutral-900 text-white' : 'border-[#E5E5E5] text-[#747878]'}`}>
                  <div className="font-semibold">3. Shipped</div>
                  <div className="text-[10px] opacity-75">In Transit</div>
                </div>
                <div className={`p-2 border ${searchedOrder.orderStatus === 'delivered' ? 'border-black bg-emerald-800 text-white' : 'border-[#E5E5E5] text-[#747878]'}`}>
                  <div className="font-semibold">4. Delivered</div>
                  <div className="text-[10px] opacity-75">Completed</div>
                </div>
              </div>
            </div>

            {/* Consignment Items */}
            <div className="border-t border-[#E5E5E5] pt-4">
              <span className="text-xs font-mono font-semibold uppercase text-black block mb-3">
                Items in Package
              </span>
              <div className="space-y-2 font-mono text-xs">
                {searchedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                    <span>
                      {it.productName} ({it.variantName}) × {it.quantity}
                    </span>
                    <span className="font-semibold text-black">
                      ₹{it.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-[#5e5e5e]">
                  <span>Subtotal</span>
                  <span>₹{searchedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#5e5e5e]">
                  <span>Delivery Charge</span>
                  <span>{searchedOrder.deliveryCharge === 0 ? 'FREE' : `₹${searchedOrder.deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-black pt-2 border-t border-[#E5E5E5]">
                  <span>Total Amount</span>
                  <span>₹{searchedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="border-t border-[#E5E5E5] pt-4 text-xs font-mono text-[#5e5e5e] space-y-1">
              <div>Recipient: <strong className="text-black">{searchedOrder.customerName}</strong></div>
              <div>Destination: {searchedOrder.address}, {searchedOrder.city}, {searchedOrder.state} — {searchedOrder.pincode}</div>
              <div>Phone Contact: +91 {searchedOrder.phone}</div>
              {searchedOrder.deliveryInstructions && (
                <div>Instructions: {searchedOrder.deliveryInstructions}</div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setActiveView('catalogue')}
            className="text-xs text-[#5e5e5e] hover:text-black uppercase tracking-wider font-mono underline"
          >
            ← Return to Formulations Catalogue
          </button>
        </div>
      </div>
    </div>
  );
};
