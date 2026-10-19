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
          Thank you for choosing AKIA Premium Hand Made.
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

  // Format Items List
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.productName} (${item.variantName}) × ${item.quantity} — ₹${item.totalPrice}`
    )
    .join('\n');

  // Complete Order Data Formatted for 1-Click WhatsApp Submission
  const rawWhatsAppMessage = `*AKIA ORDER & PAYMENT CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━
*Order Number:* ${order.orderNumber}
*Date:* ${new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })}

*CUSTOMER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* +91 ${order.phone}
${order.email ? `• *Email:* ${order.email}\n` : ''}
*DELIVERY ADDRESS:*
${order.address}
${order.city}, ${order.district}, ${order.state}
*PIN Code:* ${order.pincode}
${order.deliveryInstructions ? `*Delivery Notes:* ${order.deliveryInstructions}\n` : ''}
*ORDERED ITEMS:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
*Subtotal (Products):* ₹${order.subtotal}
*Delivery Charge:* Extra (Location-based — to be calculated)
*TOTAL AMOUNT PAID (PRODUCTS):* ₹${order.totalAmount}
*Payment Method:* UPI
*Payment Status:* Paid / Submitted

📦 *DELIVERY FEE NOTE:* I understand that delivery charges depend on my location and will be informed via WhatsApp once my order is packed and ready for dispatch.
📸 *PAYMENT SCREENSHOT:* (Attaching screenshot with this message)
Please verify payment and confirm dispatch!`;

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
      <div className="max-w-[880px] mx-auto px-5 lg:px-8">
        {/* Banner: Order Confirmed & Order Number */}
        <div className="bg-white border border-[#E5E5E5] p-8 sm:p-10 mb-8 shadow-xs text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <span className="material-symbols-outlined text-[36px]">check</span>
          </div>

          <span className="text-xs uppercase font-mono tracking-widest text-[#5e5e5e] block mb-1">
            Order Confirmation
          </span>
          <h1 className="text-3xl sm:text-4xl text-black font-semibold tracking-tight mb-2 font-mono">
            Order {order.orderNumber} Confirmed
          </h1>
          <p className="text-sm text-[#5e5e5e] max-w-lg mx-auto leading-relaxed">
            Thank you for supporting small-batch herbal craftsmanship. Your order request has been registered.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            <span className="px-3.5 py-1.5 bg-[#F5F4F2] border border-[#E5E5E5] text-black">
              Order Ref: <strong className="text-[#8B261D]">{order.orderNumber}</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800">
              Total Products Paid: <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#F5F4F2] border border-[#E5E5E5] text-black">
              Status: <strong>READY FOR DISPATCH</strong>
            </span>
          </div>
        </div>

        {/* Delivery Fee Notice Alert Box */}
        <div className="bg-amber-50 border-2 border-amber-400 p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-amber-950 font-mono uppercase tracking-wide">
                Delivery Fee Notice: Charges are Extra Based on Location
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 font-sans leading-relaxed">
                The amount paid above covers your <strong>handcrafted products only</strong>. Because shipping rates depend on your exact delivery location (PIN code) and package weight, the <strong>delivery fee will be extra</strong> and our team will notify you directly via WhatsApp once your order is prepared, weighed, and ready for dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Complete Order Manifest & Customer Address */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <h3 className="text-xs font-mono font-semibold uppercase text-black flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Consignment Manifest & Delivery Address</span>
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
            {/* Customer & Address Details */}
            <div className="p-4 bg-[#fafafa] border border-[#E5E5E5] space-y-1.5">
              <p className="font-semibold text-black uppercase font-mono text-[11px] mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                <span>Delivery Address:</span>
              </p>
              <p className="font-bold text-black text-sm">{order.customerName}</p>
              <p className="text-[#333]">{order.address}</p>
              <p className="text-[#333]">
                {order.city}, {order.district}, {order.state}
              </p>
              <p className="text-black font-mono font-semibold">PIN Code: {order.pincode}</p>
              <p className="text-[#333] pt-1 font-mono">
                Phone: <strong className="text-black">+91 {order.phone}</strong>
              </p>
              {order.email && <p className="text-[#5e5e5e] font-mono">Email: {order.email}</p>}
              {order.deliveryInstructions && (
                <p className="text-[#5e5e5e] text-[11px] italic pt-1">
                  Notes: {order.deliveryInstructions}
                </p>
              )}
            </div>

            {/* Merchant Payment Details */}
            <div className="p-4 bg-[#fafafa] border border-[#E5E5E5] space-y-1.5">
              <p className="font-semibold text-black uppercase font-mono text-[11px] mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                <span>Remittance Details:</span>
              </p>
              <p className="text-[#333]">
                Merchant: <strong className="text-black">{settings.upiMerchantName}</strong>
              </p>
              <p className="text-[#333] font-mono">UPI ID: {settings.upiId}</p>
              <p className="text-[#333] font-mono">Payment Mode: Direct UPI</p>
              <p className="text-emerald-800 font-mono font-semibold pt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                <span>Payment Completed</span>
              </p>
            </div>
          </div>

          {/* Ordered Line Items Table */}
          <div className="border-t border-[#E5E5E5] pt-4">
            <p className="font-semibold text-black uppercase font-mono text-[11px] mb-3">
              Allocated Herbal Formulations:
            </p>
            <div className="space-y-2.5 font-mono text-xs">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between py-1.5 border-b border-[#f3f3f3]">
                  <span>
                    <strong className="text-black">{it.productName}</strong>{' '}
                    <span className="text-[#5e5e5e]">({it.variantName})</span> × {it.quantity}
                  </span>
                  <span className="font-semibold text-black">
                    ₹{it.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E5E5] space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[#5e5e5e]">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-[#5e5e5e] gap-1">
                <span>Delivery Charge</span>
                <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 border border-amber-200 inline-block self-start sm:self-auto">
                  Extra • Informed via WhatsApp after packing
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-[#E5E5E5]">
                <span>Total Amount Paid (Products)</span>
                <span className="text-[#8B261D]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FINAL CALL-TO-ACTION: SINGLE CLICK WHATSAPP SUBMISSION */}
        {/* ========================================================================= */}
        <div className="bg-emerald-50 border-2 border-[#25D366] p-6 sm:p-8 text-center space-y-4 shadow-sm mb-8">
          <div className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.571 4.181 1.564 5.929l-1.659 6.061 6.223-1.632c1.701.928 3.655 1.455 5.733 1.455 6.627 0 12-5.373 12-12 0-6.628-5.373-12-11.861-12z" />
            </svg>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-800 font-bold block mb-1">
              Final Step • 1-Click WhatsApp Submission
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-black font-mono">
              Send Name, Address & Order to WhatsApp
            </h2>
            <p className="text-xs text-[#5e5e5e] max-w-lg mx-auto mt-1 font-sans leading-relaxed">
              Click the green button below to immediately open WhatsApp with your <strong>Order Number ({order.orderNumber})</strong>, <strong>Customer Name</strong>, <strong>Full Delivery Address</strong>, and items pre-filled, and attach your payment screenshot!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* The 1-Click WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.571 4.181 1.564 5.929l-1.659 6.061 6.223-1.632c1.701.928 3.655 1.455 5.733 1.455 6.627 0 12-5.373 12-12 0-6.628-5.373-12-11.861-12z" />
              </svg>
              <span>Send All Data & Screenshot on WhatsApp</span>
            </a>

            {/* Copy Message Alternative */}
            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full sm:w-auto px-5 h-14 bg-white border border-emerald-300 hover:border-black text-black text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>{copiedMessage ? '✓ Copied All Data' : 'Copy All Text'}</span>
            </button>
          </div>

          <p className="text-[11px] font-mono text-[#5e5e5e] pt-1">
            Receiving Line: <strong>+{settings.whatsappNumber}</strong> (AKIA Botanical Atelier)
          </p>
        </div>

        {/* Secondary Return Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => setActiveView('catalogue')}
            className="w-full sm:w-auto h-11 px-8 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs uppercase tracking-widest font-semibold font-mono"
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
