import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { setActiveView, settings } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'Are all AKIA products genuinely 100% Sulphate and Paraben free?',
      a: 'Yes, absolutely. We do not use sodium lauryl sulfate (SLS), SLES, synthetic foaming agents, parabens, phthalates, or chemical preservatives. Our rich creamy lather is produced naturally through the cold saponification of pure Kerala coconut oil and botanical decoctions.',
    },
    {
      q: 'How long do the handmade soaps cure before being sold?',
      a: 'Every batch of AKIA soap cures naturally for 30 to 45 days in ambient conditions in Kerala. This long curing process evaporates excess moisture, resulting in a dense, long-lasting bar that retains naturally formed hydrating glycerin.',
    },
    {
      q: 'How are delivery charges and shipping handled?',
      a: 'Delivery charges depend directly on your destination PIN code, state, and parcel weight. Once you place an order, our atelier carefully packs and weighs your items, then informs you of the exact courier or Speed Post charge via WhatsApp before dispatch. Delivery within Kerala typically takes 1–2 business days; other Indian states take 3–5 business days.',
    },
    {
      q: 'How does payment and WhatsApp ordering work?',
      a: 'You can complete your order directly on this website with your shipping address. Once placed, you will see a UPI QR code and UPI ID (8078462709@upi). Pay using any app (Google Pay, PhonePe, Paytm), and then click the green button to confirm your order details directly to our WhatsApp with one click!',
    },
    {
      q: 'Can I request customized gift hampers or bulk wedding/event orders?',
      a: 'Yes! We frequently prepare artisan gift hampers, corporate hampers, and festive packs for weddings and ceremonies. Please message our WhatsApp at +91 8078462709 or call 9497802709 to discuss custom packaging and wholesale rates.',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#f9f9f9]">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
          <button onClick={() => setActiveView('home')} className="hover:text-black transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-black font-semibold">Contact & Apothecary Atelier</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="max-w-3xl text-left space-y-4">
          <span className="inline-block px-3 py-1 bg-[#FDF5EA] text-[#8B261D] border border-[#ECD9C6] text-[11px] font-mono uppercase tracking-widest font-semibold">
            Direct Customer Concierge & Atelier
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black leading-tight">
            We’re Here to Assist Your Botanical Journey.
          </h1>
          <p className="text-sm sm:text-base text-[#5e5e5e] leading-relaxed">
            Have questions regarding formulation suitability for specific skin types, order tracking, bulk gift hampers, or custom delivery requests? Connect directly with our Kerala team.
          </p>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Instant WhatsApp Ordering */}
          <div className="bg-white border-2 border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between text-left shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">chat</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                  Fastest Response
                </span>
                <h3 className="text-lg font-serif font-bold text-black">Instant WhatsApp Chat</h3>
              </div>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Connect directly with our master compounder. Send orders, inquiry messages, or payment screenshots directly to our dedicated business WhatsApp.
              </p>
              <div className="font-mono text-sm font-bold text-black">
                +91 8078462709
              </div>
            </div>
            <div className="pt-6">
              <a
                href="https://wa.me/918078462709?text=Hello%20AKIA%20Team,%20I%20have%20an%20inquiry%20regarding%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 2: Direct Phone Support */}
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between text-left shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FDF5EA] text-[#8B261D] flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">call</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B261D] font-bold block mb-1">
                  Telephonic Support
                </span>
                <h3 className="text-lg font-serif font-bold text-black">Call Our Apothecary</h3>
              </div>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Available Monday through Saturday, 9:00 AM – 7:30 PM IST. Call us directly for product consultations or consignment queries.
              </p>
              <div className="space-y-1 font-mono text-xs">
                <div className="text-black font-semibold">Helpline 1: +91 8078462709</div>
                <div className="text-black font-semibold">Helpline 2: +91 9497802709</div>
              </div>
            </div>
            <div className="pt-6 flex gap-2">
              <a
                href="tel:8078462709"
                className="flex-1 h-11 bg-[#F5F4F2] hover:bg-black hover:text-white text-black text-xs uppercase tracking-wider font-mono font-medium transition-colors flex items-center justify-center gap-1 border border-[#E5E5E5]"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Call Line 1</span>
              </a>
              <a
                href="tel:9497802709"
                className="flex-1 h-11 bg-[#F5F4F2] hover:bg-black hover:text-white text-black text-xs uppercase tracking-wider font-mono font-medium transition-colors flex items-center justify-center gap-1 border border-[#E5E5E5]"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Call Line 2</span>
              </a>
            </div>
          </div>

          {/* Card 3: Atelier Address & Delivery */}
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 flex flex-col justify-between text-left shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F5F4F2] text-black flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">location_on</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5e5e5e] font-bold block mb-1">
                  Atelier & Workshop
                </span>
                <h3 className="text-lg font-serif font-bold text-black">Kerala Heritage Atelier</h3>
              </div>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                AKIA Herbal & Hand Made Botanicals, Kerala, India.<br />
                All consignments are packed in protective eco-friendly packaging and shipped via Speed Post / DTDC.
              </p>
              <div className="bg-[#F5F4F2] p-3 border border-[#E5E5E5] space-y-1 font-mono text-[11px] text-black">
                <div className="text-black font-semibold">📦 Location-based shipping calculated via WhatsApp</div>
                <div className="text-[#5e5e5e]">UPI: {settings.upiId}</div>
              </div>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  setActiveView('catalogue');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-11 bg-black hover:bg-[#8B261D] text-white text-xs uppercase tracking-widest font-mono font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse Catalog</span>
                <span className="material-symbols-outlined text-[16px]">storefront</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16">
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 lg:p-12">
          <div className="max-w-2xl mb-8 text-left">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-1">
              Customer Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-black">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#E5E5E5]">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-5 text-left">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left font-serif text-base sm:text-lg text-black hover:text-[#8B261D] transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <span className="material-symbols-outlined text-[20px] shrink-0 text-[#747878]">
                    {openFaq === idx ? 'remove' : 'add'}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-[#5e5e5e] leading-relaxed pr-8 font-sans">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
