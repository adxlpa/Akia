import React from 'react';
import { useStore } from '../context/StoreContext';

export const PrivacyPolicyView: React.FC = () => {
  const { setActiveView } = useStore();

  const handleGoHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[1000px] mx-auto px-5 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-mono uppercase text-[#747878]">
            <li>
              <button onClick={handleGoHome} className="hover:text-black transition-colors">
                Home
              </button>
            </li>
            <li>/</li>
            <li className="text-black font-semibold" aria-current="page">
              Privacy Policy
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-10 pt-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8B261D] font-semibold block mb-2">
            Legal & Customer Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-black font-normal tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-xs sm:text-sm text-[#5e5e5e] font-mono mt-3">
            Last Updated: October 2026 • AKIA Hand Made & Herbal Botanicals (Kerala, India)
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 lg:p-12 space-y-10 text-left shadow-xs">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              1. Our Philosophy & Commitment
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              At AKIA, we treat your privacy with the same purity and respect that guides our cold-cured botanical formulations. This Privacy Policy details how we handle the personal information collected when you browse our website, inquire about custom formulations, place an order, or track a consignment.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              2. Information We Collect
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              We collect only the minimum information necessary to safely fulfill and dispatch your orders:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#5e5e5e] leading-relaxed">
              <li>
                <strong className="text-black">Customer Contact & Delivery Details:</strong> Full name, telephone/WhatsApp number, delivery address (house/building, street, city, district, state, PIN code), and optional delivery instructions.
              </li>
              <li>
                <strong className="text-black">Order & Payment Verification:</strong> Order numbers, item selections, variant choices, and payment screenshots/UTR references shared via WhatsApp to verify UPI remittance.
              </li>
              <li>
                <strong className="text-black">Technical & Device Telemetry:</strong> Anonymized metrics including browser type, operating system, and approximate geographic region collected via standard web server logs and privacy-configured analytics.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              3. Purpose & How Your Information Is Used
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              Your details are used exclusively for legitimate business and fulfillment purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#5e5e5e] leading-relaxed">
              <li>Preparing, hand-packaging, and dispatching physical botanical orders from our Kerala atelier.</li>
              <li>Calculating exact location-based shipping charges and communicating parcel status through our official WhatsApp concierge.</li>
              <li>Enabling self-service consignment lookup through our secure order tracking tool.</li>
              <li>Maintaining system security, fraud prevention, and administrative access logging.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              4. Cookies and Local Browser Storage
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              Our website uses modern browser local storage (<code className="bg-[#F5F4F2] px-1.5 py-0.5 text-black font-mono text-xs">localStorage</code>) to maintain your shopping cart between visits, remember active checkout steps, and safeguard administrative gates against brute-force attacks. We do not use intrusive cross-site advertising cookies. When Google Analytics 4 is enabled, standard first-party analytics cookies may be used to measure aggregated website traffic.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              5. Third-Party Service Providers
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              We partner with trusted third-party platforms to ensure seamless operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#5e5e5e] leading-relaxed">
              <li>
                <strong className="text-black">Supabase:</strong> Cloud database service providing encrypted data storage for catalog management and order logs.
              </li>
              <li>
                <strong className="text-black">WhatsApp (Meta Platforms, Inc.):</strong> Encrypted messaging conduit used for direct customer concierge, delivery coordination, and payment receipt confirmation.
              </li>
              <li>
                <strong className="text-black">UPI & Merchant Applications:</strong> Google Pay, PhonePe, Paytm, and BHIM for direct customer-to-merchant payment remittance. We never store or handle your credit/debit card numbers or bank PINs.
              </li>
              <li>
                <strong className="text-black">Logistics Carriers:</strong> India Post (Speed Post) and professional courier networks (DTDC) receive only your shipping name, address, and mobile number to effect delivery.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              6. Data Security & Storage Integrity
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              We employ strict industry-standard security measures including HTTPS/TLS 1.3 encryption on every route, strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS) with 2-year preload, cryptographic password hashing (SHA-256 with salting), and automated brute-force rate-limiting locks. We never sell, lease, or rent your personal information to third-party data brokers or marketing firms.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              7. Your Rights & Data Access
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              You retain full rights to request an update, verification, or deletion of your contact records from our database. To exercise your rights, simply message our customer concierge on WhatsApp or telephone our atelier.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-[#E5E5E5] pt-6">
            <h2 className="text-xl sm:text-2xl font-serif text-black font-medium">
              8. Contact & Concierge Information
            </h2>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              For any questions regarding this Privacy Policy or your data, please contact:
            </p>
            <div className="bg-[#F5F4F2] p-5 border border-[#E5E5E5] font-mono text-xs text-black space-y-1.5">
              <div><strong className="text-black">Organization:</strong> AKIA Hand Made & Herbal Care</div>
              <div><strong className="text-black">Atelier Location:</strong> Kerala, India</div>
              <div><strong className="text-black">Direct Customer Line:</strong> +91 8078462709</div>
              <div><strong className="text-black">Alternate Line:</strong> +91 9497802709</div>
              <div><strong className="text-black">Official WhatsApp:</strong> https://wa.me/918078462709</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
