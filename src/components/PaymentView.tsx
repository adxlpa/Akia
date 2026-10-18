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
                Total Amount Payable
              </span>
              <span className="text-2xl font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
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

              {/* Crucial Screenshot Notice Banner */}
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                  <span className="material-symbols-outlined text-[18px] text-amber-700">photo_camera</span>
                  <span>Take a Screenshot of Payment</span>
                </div>
                <p className="text-xs font-sans leading-relaxed text-amber-900">
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
                    <strong className="text-black block uppercase text-[11px]">Click "Continue After Paying"</strong>
                    <span className="text-[#5e5e5e] text-[11px] font-sans">
                      Next, view your confirmed order number and tap the single-click WhatsApp button to send your name, address, and screenshot.
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
                  className="w-full h-14 bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>{isSubmitting ? 'Proceeding to Confirmation...' : 'Continue After Paying →'}</span>
                </button>
                <p className="text-[11px] text-[#747878] font-mono mt-2 text-center">
                  Click here once you have paid to view your order confirmation and send details to WhatsApp.
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
