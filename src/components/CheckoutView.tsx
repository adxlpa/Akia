import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
];

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    isShippingFree,
    calculatedDeliveryCharge,
    settings,
    createOrder,
    setActiveView,
    setActiveOrderForPayment,
  } = useStore();


  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    houseBuilding: '',
    streetArea: '',
    city: '',
    district: '',
    state: 'Kerala',
    pincode: '',
    deliveryInstructions: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[60vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-4">
        <span className="material-symbols-outlined text-[48px] text-[#747878] mb-4">
          shopping_bag
        </span>
        <h2 className="text-2xl font-medium text-black mb-2">Your Bag is Empty</h2>
        <p className="text-sm text-[#5e5e5e] mb-6 max-w-md">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('catalogue')}
          className="h-11 px-8 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          Browse Formulations
        </button>
      </div>
    );
  }

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\D/g, '').slice(-10))) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.houseBuilding.trim()) errs.houseBuilding = 'House / Building is required';
    if (!formData.streetArea.trim()) errs.streetArea = 'Street / Area is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.district.trim()) errs.district = 'District is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'PIN Code is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newOrder = createOrder({
        customerName: formData.fullName.trim(),
        phone: formData.mobileNumber.trim(),
        email: formData.email.trim(),
        address: `${formData.houseBuilding.trim()}, ${formData.streetArea.trim()}`,
        city: formData.city.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        deliveryInstructions: formData.deliveryInstructions.trim() || undefined,
      });

      if (newOrder) {
        setActiveOrderForPayment(newOrder);
        setActiveView('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      alert(err.message || 'Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };


  const totalPayable = cartSubtotal + calculatedDeliveryCharge;

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-12">
        {/* Step Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-8 pt-4">
          <div className="flex items-center gap-2 text-xs text-[#5e5e5e] font-mono uppercase mb-2">
            <span>Checkout</span>
            <span>/</span>
            <span className="text-black">1. Delivery Address & Information</span>
          </div>
          <h1 className="text-3xl text-black font-normal tracking-tight">
            Consignment Dispatch Details
          </h1>
          <p className="text-xs text-[#5e5e5e] mt-1 font-mono">
            No account required. Your phone number will be used for delivery coordination and payment verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 border border-[#E5E5E5]">
            <h2 className="text-lg font-medium text-black uppercase tracking-wider text-xs border-b border-[#E5E5E5] pb-3 font-mono">
              Recipient & Delivery Destination
            </h2>

            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Rahul Kumar"
                className={`w-full h-11 px-3.5 bg-[#f9f9f9] border text-sm focus:outline-none focus:border-black rounded-none ${
                  errors.fullName ? 'border-red-500' : 'border-[#E5E5E5]'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#5e5e5e] font-mono">+91</span>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full h-11 pl-12 pr-3.5 bg-[#f9f9f9] border text-sm font-mono focus:outline-none focus:border-black rounded-none ${
                      errors.mobileNumber ? 'border-red-500' : 'border-[#E5E5E5]'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                  Email Address <span className="text-[#747878] lowercase">(optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full h-11 px-3.5 bg-[#f9f9f9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black rounded-none"
                />
              </div>
            </div>

            {/* House / Building */}
            <div>
              <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                House / Flat / Building Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.houseBuilding}
                onChange={(e) => setFormData({ ...formData, houseBuilding: e.target.value })}
                placeholder="e.g. House No. 12, Tea Gardens Road"
                className={`w-full h-11 px-3.5 bg-[#f9f9f9] border text-sm focus:outline-none focus:border-black rounded-none ${
                  errors.houseBuilding ? 'border-red-500' : 'border-[#E5E5E5]'
                }`}
              />
              {errors.houseBuilding && (
                <p className="text-[11px] text-red-500 mt-1">{errors.houseBuilding}</p>
              )}
            </div>

            {/* Street / Area */}
            <div>
              <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                Street / Area / Landmark <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.streetArea}
                onChange={(e) => setFormData({ ...formData, streetArea: e.target.value })}
                placeholder="e.g. Near St. Thomas Church"
                className={`w-full h-11 px-3.5 bg-[#f9f9f9] border text-sm focus:outline-none focus:border-black rounded-none ${
                  errors.streetArea ? 'border-red-500' : 'border-[#E5E5E5]'
                }`}
              />
              {errors.streetArea && <p className="text-[11px] text-red-500 mt-1">{errors.streetArea}</p>}
            </div>

            {/* City & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Munnar"
                  className={`w-full h-11 px-3.5 bg-[#f9f9f9] border text-sm focus:outline-none focus:border-black rounded-none ${
                    errors.city ? 'border-red-500' : 'border-[#E5E5E5]'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Idukki"
                  className={`w-full h-11 px-3.5 bg-[#f9f9f9] border text-sm focus:outline-none focus:border-black rounded-none ${
                    errors.district ? 'border-red-500' : 'border-[#E5E5E5]'
                  }`}
                />
                {errors.district && <p className="text-[11px] text-red-500 mt-1">{errors.district}</p>}
              </div>
            </div>

            {/* State & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full h-11 px-3.5 bg-[#f9f9f9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black rounded-none cursor-pointer"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g. 685612"
                  maxLength={6}
                  className={`w-full h-11 px-3.5 bg-[#f9f9f9] border text-sm font-mono focus:outline-none focus:border-black rounded-none ${
                    errors.pincode ? 'border-red-500' : 'border-[#E5E5E5]'
                  }`}
                />
                {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-xs uppercase font-mono text-black font-medium mb-1.5">
                Delivery Instructions <span className="text-[#747878] lowercase">(optional)</span>
              </label>
              <textarea
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                placeholder="e.g. Please leave with building security, or call before arriving."
                rows={2}
                className="w-full p-3 bg-[#f9f9f9] border border-[#E5E5E5] text-sm focus:outline-none focus:border-black rounded-none resize-none"
              />
            </div>
          </div>

          {/* Right Column: Order Items Summary & Checkout Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-[#E5E5E5]">
              <h2 className="text-xs uppercase font-mono text-black font-semibold border-b border-[#E5E5E5] pb-3 mb-4">
                Consignment Items ({cart.length})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 border-b border-[#E5E5E5] pb-4 mb-4">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantName}`}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F5F4F2] border border-[#E5E5E5] flex items-center justify-center p-0.5 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-black line-clamp-1">{item.productName}</p>
                        <p className="text-[11px] text-[#5e5e5e] font-mono">
                          {item.variantName} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-black">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#5e5e5e]">
                  <span>Items Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#5e5e5e] items-center">
                  <span>Delivery Charge</span>
                  <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 border border-amber-200">
                    Extra (Calculated by Location)
                  </span>
                </div>
                <div className="p-2.5 bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] font-sans leading-relaxed">
                  <strong>📦 Delivery Fee Notice:</strong> Delivery charge depends on your delivery address and parcel weight. It is not included in this checkout and will be notified via WhatsApp once your parcel is packed and ready.
                </div>
                <div className="flex justify-between text-base font-semibold text-black border-t border-[#E5E5E5] pt-3">
                  <span>Total for Products</span>
                  <span className="text-xl">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 h-12 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Generating Order...' : 'Place Order & Proceed to UPI'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setActiveView('catalogue')}
                  className="text-xs text-[#5e5e5e] hover:text-black uppercase tracking-wider"
                >
                  ← Return to Formulations
                </button>
              </div>
            </div>

            {/* Trust Callout */}
            <div className="bg-[#F5F4F2] p-4 border border-[#E5E5E5] text-xs text-[#5e5e5e] space-y-1.5 font-mono">
              <p className="text-black font-semibold uppercase">Verification Protocol:</p>
              <p>• You will receive a direct UPI payment link & scan QR code on the next screen.</p>
              <p>• After paying, upload your payment screenshot to verify your order submission.</p>
              <p>• Full WhatsApp notifications and tracking details will be generated instantly.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
