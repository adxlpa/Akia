import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationView: React.FC = () => {
  const { activeOrderForPayment, settings, setActiveView } = useStore();
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!activeOrderForPayment) {
    return (
      <div className="w-full min-h-[60vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-4">
        <span className="material-symbols-outlined text-[48px] text-[#747878] mb-3">
          check_circle
        </span>
        <h2 className="text-2xl font-medium text-black mb-2">Order Confirmed</h2>
        <p className="text-sm text-[#5e5e5e] mb-6">
          Thank you for choosing AKIRA Botanical Laboratory.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('catalogue')}
          className="h-11 px-8 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800"
        >
          Explore More Formulations
        </button>
      </div>
    );
  }

  const order = activeOrderForPayment;

  // Format WhatsApp Message exactly as specified in PDF Section 9
  const itemsText = order.items
    .map((item) => `${item.productName} × ${item.quantity} — ₹${item.totalPrice}`)
    .join('\n');

  const paymentStatusDisplay =
    order.paymentStatus === 'submitted'
      ? 'Payment Submitted (Screenshot Uploaded)'
      : order.paymentStatus === 'verified'
      ? 'Payment Verified'
      : 'Payment Pending';

  const rawWhatsAppMessage = `*NEW ORDER*

*Order:* ${order.orderNumber}
*Customer:* ${order.customerName}
*Phone:* ${order.phone}

*Address:*
${order.address},
${order.city}, ${order.state}
*PIN:* ${order.pincode}
${order.deliveryInstructions ? `*Instructions:* ${order.deliveryInstructions}\n` : ''}
*Items:*
${itemsText}

*Subtotal:* ₹${order.subtotal}
*Delivery:* ${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
*TOTAL:* ₹${order.totalAmount}

*Payment Status:* ${paymentStatusDisplay}`;

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    rawWhatsAppMessage
  )}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(rawWhatsAppMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[860px] mx-auto px-5 lg:px-8">
        {/* Banner */}
        <div className="bg-white border border-[#E5E5E5] p-8 sm:p-10 mb-8 shadow-xs text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <span className="material-symbols-outlined text-[32px]">check</span>
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-[#5e5e5e] block mb-1">
            Dispatch Registry Ref: {order.orderNumber}
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-normal tracking-tight mb-2">
            Order Placed Successfully
          </h1>
          <p className="text-sm text-[#5e5e5e] max-w-lg mx-auto leading-relaxed">
            Thank you for supporting small-batch craftsmanship. We've received your consignment request and payment submission.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            <span className="px-3 py-1 bg-[#F5F4F2] border border-[#E5E5E5] text-black">
              Payment Status: <strong>{order.paymentStatus.toUpperCase()}</strong>
            </span>
            <span className="px-3 py-1 bg-[#F5F4F2] border border-[#E5E5E5] text-black">
              Order Status: <strong>{order.orderStatus.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        {/* WhatsApp Communication Strip (Core Requirement Section 9) */}
        <div className="bg-[#075E54] text-white p-6 sm:p-8 border border-emerald-900 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-200 font-semibold">
                  Official Communication Channel
                </span>
              </div>
              <h2 className="text-xl font-medium tracking-tight">
                Send Order Details via WhatsApp
              </h2>
              <p className="text-xs text-emerald-100 max-w-md leading-relaxed">
                Connect directly with our atelier team on WhatsApp to confirm your batch allocation and track dispatch updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 bg-white text-[#075E54] text-xs uppercase tracking-widest font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Send via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="h-11 px-4 bg-[#128C7E] text-white text-xs uppercase tracking-widest font-mono hover:bg-[#0e7468] transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedMessage ? '✓ Copied' : 'Copy Message'}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <h3 className="text-xs font-mono font-semibold uppercase text-black">
              Consignment Receipt Snapshot
            </h3>
            <span className="text-xs text-[#5e5e5e] font-mono">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div>
              <p className="font-semibold text-black uppercase font-mono text-[11px] mb-1">
                Recipient & Destination:
              </p>
              <p className="font-medium text-black">{order.customerName}</p>
              <p className="text-[#5e5e5e]">{order.address}</p>
              <p className="text-[#5e5e5e]">
                {order.city}, {order.district}, {order.state} — {order.pincode}
              </p>
              <p className="text-[#5e5e5e] mt-1 font-mono">Phone: +91 {order.phone}</p>
              {order.email && <p className="text-[#5e5e5e] font-mono">Email: {order.email}</p>}
            </div>

            <div>
              <p className="font-semibold text-black uppercase font-mono text-[11px] mb-1">
                Remittance & Verification:
              </p>
              <p className="text-[#5e5e5e]">
                Merchant: <span className="text-black font-medium">{settings.upiMerchantName}</span>
              </p>
              <p className="text-[#5e5e5e] font-mono">UPI ID: {settings.upiId}</p>
              <p className="text-[#5e5e5e] mt-1">
                Screenshot Status:{' '}
                {order.paymentScreenshotUrl ? (
                  <span className="text-emerald-700 font-semibold">Attached & Stored</span>
                ) : (
                  <span className="text-amber-700">Pending upload</span>
                )}
              </p>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="border-t border-[#E5E5E5] pt-4">
            <p className="font-semibold text-black uppercase font-mono text-[11px] mb-3">
              Allocated Batch Items:
            </p>
            <div className="space-y-2 font-mono text-xs">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between py-1 border-b border-[#f3f3f3]">
                  <span>
                    {it.productName} <span className="text-[#5e5e5e]">({it.variantName})</span> ×{' '}
                    {it.quantity}
                  </span>
                  <span className="font-semibold text-black">
                    ₹{it.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E5E5] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#5e5e5e]">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#5e5e5e]">
                <span>Delivery Charge</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-black pt-2 border-t border-[#E5E5E5]">
                <span>Total Amount</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveView('catalogue')}
            className="w-full sm:w-auto h-11 px-8 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs uppercase tracking-widest font-semibold"
          >
            ← Return to Formulations
          </button>

          <button
            type="button"
            onClick={() => setActiveView('order-track')}
            className="w-full sm:w-auto h-11 px-6 bg-[#F5F4F2] border border-[#E5E5E5] hover:border-black text-black text-xs uppercase tracking-widest font-mono"
          >
            Track Consignment Live →
          </button>
        </div>
      </div>
    </div>
  );
};
