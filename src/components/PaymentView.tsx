import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { QRCodeDisplay } from './QRCodeDisplay';

export const PaymentView: React.FC = () => {
  const { activeOrderForPayment, settings, submitPaymentScreenshot, setActiveView } = useStore();

  const [copiedUPI, setCopiedUPI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeOrderForPayment) {
    return (
      <div className="w-full min-h-[60vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-4">
        <span className="material-symbols-outlined text-[48px] text-[#747878] mb-3">
          receipt_long
        </span>
        <h2 className="text-2xl font-medium text-black mb-2">No Active Order</h2>
        <p className="text-sm text-[#5e5e5e] mb-6">
          Please place an order from your bag to proceed to payment.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('catalogue')}
          className="h-11 px-8 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  const order = activeOrderForPayment;

  // Standard UPI URI format
  const upiPaymentUri = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(
    settings.upiMerchantName
  )}&am=${order.totalAmount}&cu=INR&tn=Order%20${order.orderNumber}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2500);
  };

  const handleContinueAfterPaying = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitPaymentScreenshot(order.id, 'Sent via WhatsApp');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[1040px] mx-auto px-5 lg:px-8">
        {/* Step Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-8 pt-4">
          <div className="flex items-center gap-2 text-xs text-[#5e5e5e] font-mono uppercase mb-2">
            <span>Checkout</span>
            <span>/</span>
            <span>Order {order.orderNumber}</span>
            <span>/</span>
            <span className="text-black font-semibold">2. UPI Payment</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl text-black font-normal tracking-tight">
                UPI Merchant Payment
              </h1>
              <p className="text-xs text-[#5e5e5e] mt-1 font-mono">
                Scan the dynamic QR or click the button below to pay with any UPI app.
              </p>
            </div>
            <div className="bg-black text-white px-5 py-2.5 font-mono text-right shadow-xs">
              <span className="text-[10px] uppercase tracking-widest text-white/70 block">
                Total for Products
              </span>
              <span className="text-2xl font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-amber-300 block font-mono mt-0.5">
                + Delivery fee extra via WhatsApp
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: QR Code & UPI Remittance */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#E5E5E5] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-4">
                <span className="text-xs font-mono font-semibold uppercase text-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  Pay with UPI
                </span>
                <span className="text-[11px] font-mono text-[#5e5e5e]">{order.orderNumber}</span>
              </div>

              {/* Dynamic QR Display */}
              <div className="flex flex-col items-center justify-center p-5 bg-[#F5F4F2] border border-[#E5E5E5] mb-5">
                <QRCodeDisplay data={upiPaymentUri} size={210} />
                <p className="text-xs text-[#5e5e5e] font-mono mt-3 text-center">
                  Scan using Google Pay, PhonePe, Paytm, or BHIM
                </p>
              </div>

              {/* Mobile Deep-link Button */}
              <div className="space-y-3">
                <a
                  href={upiPaymentUri}
                  className="w-full h-12 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>Pay ₹{order.totalAmount} via UPI App</span>
                </a>

                {/* Merchant UPI ID & Copy button */}
                <div className="p-3 bg-[#f9f9f9] border border-[#E5E5E5] flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-[10px] text-[#747878] font-mono block uppercase">
                      Merchant UPI ID
                    </span>
                    <span className="text-xs font-mono font-medium text-black select-all">
                      {settings.upiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="px-3 py-1.5 bg-white border border-[#E5E5E5] hover:border-black text-[11px] uppercase font-mono tracking-wider transition-colors whitespace-nowrap"
                  >
                    {copiedUPI ? '✓ Copied' : 'Copy ID'}
                  </button>
                </div>
              </div>
            </div>

            {/* Merchant Identity Note */}
            <div className="pt-4 border-t border-[#E5E5E5] text-[11px] text-[#5e5e5e] font-mono space-y-1">
              <div>Merchant: <strong className="text-black">{settings.upiMerchantName}</strong></div>
              <div>Account: Google Pay for Business / Verified Merchant UPI</div>
            </div>
          </div>

          {/* Right Column: Screenshot Instructions & Continue Button */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#E5E5E5] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="border-b border-[#E5E5E5] pb-3">
                <span className="text-xs font-mono font-semibold uppercase text-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                  Payment Instructions & Screenshot Reminder
                </span>
                <p className="text-xs text-[#5e5e5e] mt-1 font-sans">
                  Follow these steps to complete your order smoothly.
                </p>
              </div>

              {/* Delivery Fee Notice Banner */}
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                  <span className="material-symbols-outlined text-[18px] text-amber-700">local_shipping</span>
                  <span>Delivery Fee is Extra (Location-Based)</span>
                </div>
                <p className="text-xs font-sans leading-relaxed text-amber-900">
                  The payment above covers your <strong>handcrafted products only</strong>. Delivery charges depend on your delivery location and parcel weight. Once your parcel is packed and ready, our team will calculate the exact courier/postal charge and inform you via WhatsApp.
                </p>
              </div>

              {/* Crucial Screenshot Notice Banner */}
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-950 space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                  <span className="material-symbols-outlined text-[18px] text-blue-700">photo_camera</span>
                  <span>Take a Screenshot of Payment</span>
                </div>
                <p className="text-xs font-sans leading-relaxed text-blue-900">
                  After paying in your UPI app, please <strong>take a screenshot of the completed payment receipt</strong>. On the next page, you will confirm your order and send your details and screenshot to our WhatsApp with <strong>1 single click</strong>.
                </p>
              </div>

              {/* Instructions Steps Box */}
              <div className="bg-[#fcfcfc] border border-[#E5E5E5] p-5 space-y-3 font-mono text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] flex items-center justify-center shrink-0 font-bold">
                    1
                  </span>
                  <div>
                    <strong className="text-black block uppercase text-[11px]">Pay ₹{order.totalAmount}</strong>
                    <span className="text-[#5e5e5e] text-[11px] font-sans">
                      Scan the QR code or click the button on the left using your UPI app.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] flex items-center justify-center shrink-0 font-bold">
                    2
                  </span>
                  <div>
                    <strong className="text-black block uppercase text-[11px]">Capture Payment Screenshot</strong>
                    <span className="text-[#5e5e5e] text-[11px] font-sans">
                      Save a screenshot showing the transaction ID or success screen.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#25D366] text-white text-[11px] flex items-center justify-center shrink-0 font-bold">
                    3
                  </span>
                  <div>
                    <strong className="text-black block uppercase text-[11px]">Send Order to WhatsApp to Complete</strong>
                    <span className="text-[#5e5e5e] text-[11px] font-sans">
                      Next, tap the 1-click WhatsApp button. Your order will only be completed and dispatched once received on WhatsApp!
                    </span>
                  </div>
                </div>
              </div>

              {/* The "Continue After Paying" Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleContinueAfterPaying}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.571 4.181 1.564 5.929l-1.659 6.061 6.223-1.632c1.701.928 3.655 1.455 5.733 1.455 6.627 0 12-5.373 12-12 0-6.628-5.373-12-11.861-12z" />
                  </svg>
                  <span>{isSubmitting ? 'Proceeding...' : 'I Have Paid → Complete on WhatsApp'}</span>
                </button>
                <p className="text-[11px] text-amber-700 font-mono mt-2 text-center font-medium">
                  ⚠️ Action Required: Next, tap Send to WhatsApp to complete your order.
                </p>
              </div>
            </div>

            {/* Assistance Note */}
            <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex justify-between items-center text-xs text-[#5e5e5e] font-mono">
              <span>Order Ref: {order.orderNumber}</span>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hi AKIA, I have a question regarding Order ${order.orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black underline text-[11px] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px] text-[#25D366]">chat</span>
                <span>Need help? Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
