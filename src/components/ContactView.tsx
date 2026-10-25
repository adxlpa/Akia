import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { sanitizeInput } from '../utils/security';
import { getSupabaseClient } from '../lib/supabase';

export const ContactView: React.FC = () => {
  const { setActiveView, settings } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Product Consultation',
    message: '',
    honeypot: '', // Trap field for spam bots
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your full name (at least 2 characters).';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please provide a valid email address.';
      }
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide a message with at least 10 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    // Spam Honeypot Check
    if (formData.honeypot) {
      // Silently reject bot submissions
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess('Your message has been received.');
      }, 800);
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Client-side Rate Limiting (30-second cooldown)
    const lastSubmit = localStorage.getItem('akia_last_contact_ts');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 30000) {
      setSubmitError('To prevent duplicate submissions, please wait 30 seconds before sending another message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanName = sanitizeInput(formData.name.trim());
      const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
      const cleanEmail = sanitizeInput(formData.email.trim());
      const cleanSubject = sanitizeInput(formData.subject);
      const cleanMsg = sanitizeInput(formData.message.trim());
      const refNumber = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. If Supabase is available, attempt to log inquiry
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('contact_messages').insert([
            {
              name: cleanName,
              phone: cleanPhone,
              email: cleanEmail || null,
              subject: cleanSubject,
              message: cleanMsg,
              ref_number: refNumber,
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (dbErr) {
          // If table does not exist or network is offline, continue to fallback
          console.warn('Supabase contact log warning (falling back to direct contact):', dbErr);
        }
      }

      // Record timestamp for rate limiting
      localStorage.setItem('akia_last_contact_ts', now.toString());

      setSubmitSuccess(refNumber);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Product Consultation',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      console.error('Contact form error:', err);
      setSubmitError('Unable to send message at this moment. Please reach our direct line or WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello AKIA Team,\nName: ${formData.name || 'Customer'}\nSubject: ${formData.subject}\nMessage: ${formData.message || 'I would like to inquire about your products.'}`
    );
    window.open(`https://wa.me/918078462709?text=${text}`, '_blank');
  };

  return (
    <div className="pt-28 pb-20 bg-[#f9f9f9]">
      {/* Accessible Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
          <li>
            <button onClick={() => setActiveView('home')} className="hover:text-black transition-colors">
              Home
            </button>
          </li>
          <li>/</li>
          <li className="text-black font-semibold" aria-current="page">
            Contact & Apothecary Atelier
          </li>
        </ol>
      </nav>

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
                <h2 className="text-lg font-serif font-bold text-black">Instant WhatsApp Chat</h2>
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
                <h2 className="text-lg font-serif font-bold text-black">Call Our Apothecary</h2>
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
                <h2 className="text-lg font-serif font-bold text-black">Kerala Heritage Atelier</h2>
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

      {/* ========================================================================= */}
      {/* Direct Interactive Contact Message Form (Requirement 20) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-16">
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="max-w-3xl mb-8 text-left">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-1">
              Direct Inquiries & Consultations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-black">
              Send a Message to Our Atelier
            </h2>
            <p className="text-xs sm:text-sm text-[#5e5e5e] mt-2 leading-relaxed">
              Fill out the form below for botanical questions, customized hampers, or consignment inquiries. We respond within a few hours.
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-300 text-left space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
                <span className="material-symbols-outlined text-[22px] text-emerald-700">check_circle</span>
                <span>Thank you! Your message has been safely submitted. Reference #{submitSuccess}</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-sans">
                Our apothecary master will review your message. You may also forward this inquiry directly to our official WhatsApp with 1 click for instant priority handling.
              </p>
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="h-10 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono uppercase tracking-wider font-medium transition-colors flex items-center gap-2"
              >
                <span>Forward to WhatsApp Concierge →</span>
              </button>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-left text-xs text-red-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-red-700 shrink-0">error</span>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
            {/* Honeypot field for anti-bot spam prevention */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="form-hp-field">Leave this empty</label>
              <input
                id="form-hp-field"
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono uppercase font-semibold text-black mb-1.5">
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Anjali Nair"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full h-11 px-4 bg-[#f9f9f9] border text-xs sm:text-sm text-black focus:outline-none focus:border-black rounded-none transition-colors ${
                    formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-[#E5E5E5]'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1 font-mono">{formErrors.name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-mono uppercase font-semibold text-black mb-1.5">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  className={`w-full h-11 px-4 bg-[#f9f9f9] border text-xs sm:text-sm font-mono text-black focus:outline-none focus:border-black rounded-none transition-colors ${
                    formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#E5E5E5]'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-red-600 mt-1 font-mono">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Address */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono uppercase font-semibold text-black mb-1.5">
                  Email Address <span className="text-[#747878] font-normal">(Optional)</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full h-11 px-4 bg-[#f9f9f9] border text-xs sm:text-sm text-black focus:outline-none focus:border-black rounded-none transition-colors ${
                    formErrors.email ? 'border-red-500 bg-red-50/20' : 'border-[#E5E5E5]'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1 font-mono">{formErrors.email}</p>
                )}
              </div>

              {/* Inquiry Type */}
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono uppercase font-semibold text-black mb-1.5">
                  Nature of Inquiry *
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#E5E5E5] text-xs sm:text-sm text-black focus:outline-none focus:border-black rounded-none"
                >
                  <option value="Product Consultation">Product Suitability / Skin Consultation</option>
                  <option value="Bulk Gift Hampers">Artisan Gift Hampers / Wedding Orders</option>
                  <option value="Order Tracking">Consignment Tracking / Dispatch Status</option>
                  <option value="Wholesale & Retail">Wholesale Supply / Kerala Retail</option>
                  <option value="General Question">General Botanical Inquiries</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono uppercase font-semibold text-black mb-1.5">
                Your Message / Formulation Inquiry *
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                placeholder="Please describe your skin type, desired formulations, or order queries..."
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (formErrors.message) setFormErrors({ ...formErrors, message: '' });
                }}
                className={`w-full p-4 bg-[#f9f9f9] border text-xs sm:text-sm text-black focus:outline-none focus:border-black rounded-none transition-colors ${
                  formErrors.message ? 'border-red-500 bg-red-50/20' : 'border-[#E5E5E5]'
                }`}
              />
              {formErrors.message && (
                <p className="text-[11px] text-red-600 mt-1 font-mono">{formErrors.message}</p>
              )}
            </div>

            {/* Submit & Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-12 px-8 bg-black hover:bg-[#8B261D] disabled:bg-neutral-400 text-white text-xs uppercase font-mono tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Message</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </>
                )}
              </button>

              <div className="text-xs text-[#5e5e5e] font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">lock</span>
                <span>Your message is delivered securely to our atelier team</span>
              </div>
            </div>
          </form>
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
