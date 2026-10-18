import React, { useState } from 'react';

export const NewsletterBand: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="w-full bg-[#1A1C1C] text-white py-16 lg:py-20 border-t border-[#E5E5E5]">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] block mb-2 font-mono">
          The AKIA Botanical Circle
        </span>
        <h2 className="text-3xl lg:text-4xl font-normal mb-3 text-white tracking-tight font-serif">
          Join our botanical dispatch list
        </h2>
        <p className="text-[14px] text-white/70 mb-8 max-w-lg mx-auto leading-relaxed">
          Receive notification whenever fresh small batches of our handmade soaps and herbal hair oils are cured and ready.
        </p>

        {subscribed ? (
          <div className="bg-neutral-900 border border-neutral-700 p-4 max-w-md mx-auto text-[13px] text-white">
            ✓ Thank you. You have been placed on the AKIA notification roster for fresh cured batches.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="h-12 px-4 bg-neutral-900 border border-neutral-700 text-white text-[14px] placeholder:text-neutral-500 focus:outline-none focus:border-white flex-grow rounded-none"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-white text-black text-[12px] uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
