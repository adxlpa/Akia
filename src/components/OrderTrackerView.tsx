import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { getSupabaseClient, mapOrderFromSupabase } from '../lib/supabase';
import { sanitizeInput } from '../utils/security';

export const OrderTrackerView: React.FC = () => {
  const { orders, setActiveView } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearchedOrder(null);

    const cleanOrder = sanitizeInput(orderQuery).replace(/^#/, '').trim().toLowerCase();
    const cleanPhone = phoneQuery.replace(/\D/g, '').slice(-10);

    if (!cleanOrder) {
      setError('Please enter your 4-digit Order Number (e.g. 1024).');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setError('For your privacy and security, please enter your 10-digit registered phone number.');
      return;
    }

    setIsSearching(true);

    try {
      // 1. Check local session orders first
      const localMatch = orders.find((o) => {
        const orderMatch = o.orderNumber.replace(/^#/, '').toLowerCase() === cleanOrder;
        const phoneMatch = o.phone.replace(/\D/g, '').endsWith(cleanPhone);
        return orderMatch && phoneMatch;
      });

      if (localMatch) {
        setSearchedOrder(localMatch);
        setIsSearching(false);
        return;
      }

      // 2. Query Supabase securely by Order Number and verify Phone
      const client = getSupabaseClient();
      if (client) {
        const { data, error: dbError } = await client
          .from('orders')
          .select('*')
          .eq('order_number', `#${cleanOrder}`)
          .maybeSingle();

        if (data && !dbError) {
          const mapped = mapOrderFromSupabase(data);
          const phoneClean = mapped.phone.replace(/\D/g, '');
          if (phoneClean.endsWith(cleanPhone)) {
            setSearchedOrder(mapped);
            setIsSearching(false);
            return;
          }
        }
      }

      setError(
        `No consignment found matching Order #${cleanOrder} and phone ending with ${cleanPhone.slice(-4)}. Please check your details.`
      );
    } catch (err: any) {
      console.error('Order lookup error:', err);
      setError('Unable to retrieve consignment details at this time. Please check your information and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[900px] mx-auto px-5 lg:px-8">
        {/* Header */}
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
                Track Consignment
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl text-black font-normal tracking-tight">
            Order & Dispatch Lookup
          </h1>
          <p className="text-xs text-[#5e5e5e] mt-1 font-mono">
            Enter your order number and registered phone number to view live consignment tracking.
          </p>
        </div>

        {/* Secure Search Input Form */}
        <form onSubmit={handleSearch} className="mb-8 bg-white p-5 border border-[#E5E5E5] space-y-3 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase font-semibold text-black mb-1">
                Order Number *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#747878]">
                  tag
                </span>
                <input
                  type="text"
                  required
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. #1024 or 1024"
                  className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-semibold text-black mb-1">
                Registered Phone Number *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#747878]">
                  phone
                </span>
                <input
                  type="tel"
                  required
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#747878] font-mono">
              🔒 Verification required to protect your shipping privacy
            </span>
            <button
              type="submit"
              disabled={isSearching}
              className="h-10 px-6 bg-black text-white text-xs uppercase tracking-widest font-semibold font-mono hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Verifying...' : 'Track Status'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 mb-8 font-mono flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Display (Authenticated by Order Number + Phone match) */}
        {searchedOrder && (
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6 shadow-xs">
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
                Items in Consignment
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
                  <span>{searchedOrder.deliveryCharge === 0 ? 'Extra (Informed via WhatsApp)' : `₹${searchedOrder.deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-black pt-2 border-t border-[#E5E5E5]">
                  <span>Total Products Paid</span>
                  <span>₹{searchedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Privacy-Preserved Recipient Details */}
            <div className="border-t border-[#E5E5E5] pt-4 text-xs font-mono text-[#5e5e5e] space-y-1">
              <div>Recipient: <strong className="text-black">{searchedOrder.customerName}</strong></div>
              <div>
                Destination: {searchedOrder.city}, {searchedOrder.state} — {searchedOrder.pincode}
              </div>
              <div>
                Phone: +91 ******{searchedOrder.phone.slice(-4)}
              </div>
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
