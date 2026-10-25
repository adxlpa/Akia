import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, Product, Category, PaymentStatus, OrderStatus } from '../types';
import { AdminImageUploader } from './AdminImageUploader';
import { testSupabaseStorage } from '../lib/supabase';
import { sanitizeUrl, sanitizeInput } from '../utils/security';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    categories,
    settings,
    updateOrderPaymentStatus,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    resetToDefaults,
    setActiveView,
    logoutAdmin,
    changeAdminCredentials,
    securityAuditLogs,
    clearAuditLogs,
    adminSession,
    isSupabaseEnabled,
    supabaseStatus,
    supabaseMessage,
    supabaseConfig,
    syncWithSupabase,
    pushLocalDataToSupabase,
    updateSupabaseCredentials,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'settings' | 'security' | 'database'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);

  // Supabase Configuration Form State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(supabaseConfig.anonKey);
  const [supabaseActionMsg, setSupabaseActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmittingSupabase, setIsSubmittingSupabase] = useState(false);
  const [isPushingData, setIsPushingData] = useState(false);
  const [isTestingStorage, setIsTestingStorage] = useState(false);
  const [storageTestResult, setStorageTestResult] = useState<{ text: string; type: 'success' | 'error' } | null>(null);


  // Security Credentials Form State
  const [credCurrentPass, setCredCurrentPass] = useState('');
  const [credNewUser, setCredNewUser] = useState('');
  const [credNewPass, setCredNewPass] = useState('');
  const [credConfirmPass, setCredConfirmPass] = useState('');
  const [credMsg, setCredMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [credSubmitting, setCredSubmitting] = useState(false);

  // Category Management Form State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catFormData, setCatFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 1,
  });
  const [categoryActionError, setCategoryActionError] = useState<string | null>(null);

  // Product Management Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodFormData, setProdFormData] = useState<{
    name: string;
    categoryId: string;
    description: string;
    price: number;
    marketRate: number;
    weight: string;
    stock: number;
    imageUrl: string;
    isActive: boolean;
    badge: string;
    inci: string;
    variants: Array<{ name: string; price: number; weight: string }>;
  }>({
    name: '',
    categoryId: categories[0]?.id || '',
    description: '',
    price: 100,
    marketRate: 150,
    weight: '100 gm',
    stock: 20,
    imageUrl: '',
    isActive: true,
    badge: '',
    inci: '',
    variants: [],
  });

  // Settings Form State
  const [settingsFormData, setSettingsFormData] = useState(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Orders Filter
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Stats calculation
  const totalOrders = orders.length;
  const paymentSubmitted = orders.filter((o) => o.paymentStatus === 'submitted').length;
  const processingCount = orders.filter((o) => o.orderStatus === 'processing').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'verified' || o.paymentStatus === 'submitted')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderPaymentFilter !== 'all' && o.paymentStatus !== orderPaymentFilter) return false;
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    return true;
  });

  // Handlers for Category CRUD
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryActionError(null);
    if (!catFormData.name.trim()) return;

    const slug = catFormData.slug.trim() || catFormData.name.toLowerCase().replace(/\s+/g, '-');
    const rawImage = catFormData.imageUrl.trim();
    const image = rawImage
      ? sanitizeUrl(rawImage)
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh9bS9yVt6WbeI4tn-yrRZGHFyHDkXAJl_YJ4Eq0m1K1pcHwMaeT5zko0g_8nViSWtJm8TFJq7LWwnt--D_JVZIBUGSK_di3IKVTouZNHEFrDpS2n2brelHxCq5r45ihW0b1eZg_QVmlcVVU_T44SHwixeOohNuW2iEVAs2JDw-MD4QOSGKSPMIrf3_4ruJPcqChxByGoPlF2xkTE5iiUO82aZoOyxvoNdzK4s8ipD1wX8UpVXb8Fj';

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: sanitizeInput(catFormData.name),
        slug: sanitizeInput(slug),
        description: sanitizeInput(catFormData.description),
        imageUrl: image,
        isActive: catFormData.isActive,
        displayOrder: Math.max(1, Number(catFormData.displayOrder) || 1),
      });
      setEditingCategory(null);
    } else {
      addCategory({
        name: sanitizeInput(catFormData.name),
        slug: sanitizeInput(slug),
        description: sanitizeInput(catFormData.description),
        imageUrl: image,
        isActive: catFormData.isActive,
        displayOrder: Math.max(1, Number(catFormData.displayOrder) || 1),
      });
      setIsAddingCategory(false);
    }

    setCatFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
      displayOrder: categories.length + 1,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryActionError(null);
    const result = deleteCategory(categoryId);
    if (!result.success && result.error) {
      setCategoryActionError(result.error);
    }
  };

  // Handlers for Product CRUD
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFormData.name.trim()) return;

    const chosenCategory = categories.find((c) => c.id === prodFormData.categoryId);
    const categoryName = chosenCategory ? chosenCategory.name : 'Apothecary';
    const rawImage = prodFormData.imageUrl.trim();
    const image = rawImage
      ? sanitizeUrl(rawImage)
      : (chosenCategory?.imageUrl ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDh9bS9yVt6WbeI4tn-yrRZGHFyHDkXAJl_YJ4Eq0m1K1pcHwMaeT5zko0g_8nViSWtJm8TFJq7LWwnt--D_JVZIBUGSK_di3IKVTouZNHEFrDpS2n2brelHxCq5r45ihW0b1eZg_QVmlcVVU_T44SHwixeOohNuW2iEVAs2JDw-MD4QOSGKSPMIrf3_4ruJPcqChxByGoPlF2xkTE5iiUO82aZoOyxvoNdzK4s8ipD1wX8UpVXb8Fj');

    const cleanPrice = Math.max(0, Number(prodFormData.price) || 0);
    const cleanMarketRate = prodFormData.marketRate ? Math.max(0, Number(prodFormData.marketRate) || 0) : undefined;
    const cleanStock = Math.max(0, Math.floor(Number(prodFormData.stock) || 0));

    const cleanVariants = prodFormData.variants
      .filter((v) => v.name.trim() !== '')
      .map((v) => ({
        name: sanitizeInput(v.name.trim()),
        price: Math.max(0, Number(v.price) || 0),
        weight: sanitizeInput(v.weight.trim() || prodFormData.weight),
      }));

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: sanitizeInput(prodFormData.name),
        categoryId: prodFormData.categoryId,
        categoryName,
        description: sanitizeInput(prodFormData.description),
        price: cleanPrice,
        marketRate: cleanMarketRate,
        weight: sanitizeInput(prodFormData.weight),
        stock: cleanStock,
        imageUrl: image,
        isActive: prodFormData.isActive,
        badge: prodFormData.badge ? sanitizeInput(prodFormData.badge) : undefined,
        inci: prodFormData.inci ? sanitizeInput(prodFormData.inci) : undefined,
        variants: cleanVariants.length > 0 ? cleanVariants : undefined,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: sanitizeInput(prodFormData.name),
        categoryId: prodFormData.categoryId,
        categoryName,
        description: sanitizeInput(prodFormData.description),
        price: cleanPrice,
        marketRate: cleanMarketRate,
        weight: sanitizeInput(prodFormData.weight),
        stock: cleanStock,
        imageUrl: image,
        isActive: prodFormData.isActive,
        badge: prodFormData.badge ? sanitizeInput(prodFormData.badge) : undefined,
        inci: prodFormData.inci ? sanitizeInput(prodFormData.inci) : undefined,
        variants: cleanVariants.length > 0 ? cleanVariants : undefined,
      });
      setIsAddingProduct(false);
    }

    setProdFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      price: 100,
      marketRate: 150,
      weight: '100 gm',
      stock: 20,
      imageUrl: '',
      isActive: true,
      badge: '',
      inci: '',
      variants: [],
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsFormData);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredMsg(null);
    if (!credCurrentPass) {
      setCredMsg({ text: 'Please enter your current password.', type: 'error' });
      return;
    }
    if (credNewPass !== credConfirmPass) {
      setCredMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    setCredSubmitting(true);
    try {
      const res = await changeAdminCredentials(credCurrentPass, credNewPass, credNewUser || undefined);
      if (res.success) {
        setCredMsg({ text: 'Admin security credentials updated successfully.', type: 'success' });
        setCredCurrentPass('');
        setCredNewPass('');
        setCredConfirmPass('');
      } else {
        setCredMsg({ text: res.error || 'Failed to update credentials.', type: 'error' });
      }
    } catch {
      setCredMsg({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setCredSubmitting(false);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSupabase(true);
    setSupabaseActionMsg(null);
    try {
      const res = await updateSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
      setSupabaseActionMsg({
        text: res.message,
        type: res.success ? 'success' : 'error',
      });
    } catch (err: any) {
      console.error('Supabase config error:', err);
      setSupabaseActionMsg({
        text: 'Failed to update configuration. Please verify credentials.',
        type: 'error',
      });
    } finally {
      setIsSubmittingSupabase(false);
    }
  };

  const handlePushDataToSupabase = async () => {
    if (!confirm('Push all 16 AKIA products, categories, and settings to Supabase? Existing records will be upserted.')) {
      return;
    }
    setIsPushingData(true);
    setSupabaseActionMsg(null);
    try {
      const res = await pushLocalDataToSupabase();
      setSupabaseActionMsg({
        text: res.message,
        type: res.success ? 'success' : 'error',
      });
    } catch (err: any) {
      console.error('Supabase push error:', err);
      setSupabaseActionMsg({
        text: 'Failed to push data to cloud storage. Please check connection.',
        type: 'error',
      });
    } finally {
      setIsPushingData(false);
    }
  };

  const handleTestStorage = async () => {
    setIsTestingStorage(true);
    setStorageTestResult(null);
    try {
      const res = await testSupabaseStorage();
      setStorageTestResult({
        text: res.message,
        type: res.success ? 'success' : 'error',
      });
    } catch (err: any) {
      console.error('Storage test error:', err);
      setStorageTestResult({
        text: 'Storage bucket verification failed. Please verify storage permissions.',
        type: 'error',
      });
    } finally {
      setIsTestingStorage(false);
    }
  };


  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
        {/* Top Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src="/images/logo.png"
              alt="AKIA Seal"
              className="w-14 h-14 object-contain rounded-full border border-[#004080]/30 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-[#5e5e5e] font-mono uppercase mb-1 flex-wrap">
                <span className="w-2 h-2 bg-[#8B261D]"></span>
                <span className="text-[#8B261D] font-bold">AKIA Botanical Laboratory</span>
                <span>/</span>
                <span className="text-black font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Admin Session
                </span>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('database')}
                  className={`px-2 py-0.5 text-[10px] uppercase font-mono font-bold flex items-center gap-1 border transition-colors ${
                    supabaseStatus === 'connected'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : supabaseStatus === 'connecting'
                      ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                      : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                  title={supabaseMessage}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                  <span>{supabaseStatus === 'connected' ? 'Supabase: Connected' : 'Supabase: Local / Offline'}</span>
                </button>
              </div>
              <h1 className="text-3xl text-black font-serif font-normal tracking-tight">
                {settings.businessName} Control Center
              </h1>
              {adminSession && (
                <p className="text-[11px] font-mono text-[#5e5e5e] mt-0.5">
                  Logged in as <span className="text-black font-semibold">{adminSession.username}</span> • Active Staff Session
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="h-10 px-4 bg-white border border-[#E5E5E5] hover:border-black text-black text-xs uppercase tracking-widest font-mono transition-colors"
            >
              ← View Storefront
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="h-10 px-4 bg-[#8B261D] hover:bg-neutral-900 text-white text-xs uppercase tracking-widest font-mono transition-colors flex items-center gap-1.5 shadow-xs"
              title="Terminate admin session and revoke access"
            >
              <span className="material-symbols-outlined text-[15px]">logout</span>
              <span>Secure Logout</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset store data back to initial seed catalog?')) {
                  resetToDefaults();
                }
              }}
              className="h-10 px-3 border border-red-200 text-red-600 hover:bg-red-50 text-xs uppercase tracking-widest font-mono transition-colors"
              title="Reset mock database to initial defaults"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: 'dashboard' },
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'receipt_long' },
            { id: 'products', label: `Products (${products.length})`, icon: 'inventory_2' },
            { id: 'categories', label: `Categories (${categories.length})`, icon: 'category' },
            { id: 'settings', label: 'Business & UPI Settings', icon: 'settings' },
            { id: 'security', label: 'Security & Auth Gate', icon: 'shield' },
            { id: 'database', label: 'Supabase Cloud DB', icon: 'cloud_sync' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs uppercase font-mono tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-black text-black font-bold bg-white'
                  : 'border-transparent text-[#5e5e5e] hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Stat Cards (Matching PDF Page 7 spec) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
              <div className="bg-white p-5 border border-[#E5E5E5]">
                <span className="text-[11px] text-[#5e5e5e] uppercase block mb-1">Total Orders</span>
                <span className="text-3xl font-semibold text-black">{totalOrders}</span>
              </div>
              <div className="bg-white p-5 border border-[#E5E5E5]">
                <span className="text-[11px] text-blue-700 uppercase block mb-1">
                  Payment Submitted
                </span>
                <span className="text-3xl font-semibold text-blue-800">{paymentSubmitted}</span>
              </div>
              <div className="bg-white p-5 border border-[#E5E5E5]">
                <span className="text-[11px] text-amber-700 uppercase block mb-1">Processing</span>
                <span className="text-3xl font-semibold text-amber-800">{processingCount}</span>
              </div>
              <div className="bg-white p-5 border border-[#E5E5E5]">
                <span className="text-[11px] text-purple-700 uppercase block mb-1">Shipped</span>
                <span className="text-3xl font-semibold text-purple-800">{shippedCount}</span>
              </div>
              <div className="bg-white p-5 border border-[#E5E5E5]">
                <span className="text-[11px] text-emerald-700 uppercase block mb-1">Delivered</span>
                <span className="text-3xl font-semibold text-emerald-800">{deliveredCount}</span>
              </div>
              <div className="bg-white p-5 border border-[#E5E5E5]">
                <span className="text-[11px] text-black uppercase block mb-1">Total Remittance</span>
                <span className="text-2xl font-semibold text-black">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Recent Orders Quick Inspection */}
            <div className="bg-white border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4 mb-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-black">
                  Recent Consignment Requests (Awaiting Verification)
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-black underline font-mono hover:text-[#5e5e5e]"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] text-[#5e5e5e] uppercase">
                      <th className="py-2.5">Order Ref</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Items</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Payment</th>
                      <th className="py-2.5">Fulfillment</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f3]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F5F4F2]">
                        <td className="py-3 font-semibold text-black">{ord.orderNumber}</td>
                        <td className="py-3">
                          <div>{ord.customerName}</div>
                          <div className="text-[10px] text-[#5e5e5e]">+91 {ord.phone}</div>
                        </td>
                        <td className="py-3 text-[11px]">
                          {ord.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-3 font-semibold">₹{ord.totalAmount}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                              ord.paymentStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.paymentStatus === 'submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 uppercase text-[10px] font-semibold">{ord.orderStatus}</td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[11px] uppercase tracking-wider"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-[#E5E5E5]">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <label className="text-[10px] uppercase text-[#5e5e5e] block mb-1">
                    Payment Status:
                  </label>
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                    className="h-9 px-2 bg-[#f9f9f9] border border-[#E5E5E5] text-xs font-mono uppercase focus:outline-none"
                  >
                    <option value="all">All Payment States</option>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted (Screenshot Uploaded)</option>
                    <option value="verified">Verified</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#5e5e5e] block mb-1">
                    Order Status:
                  </label>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="h-9 px-2 bg-[#f9f9f9] border border-[#E5E5E5] text-xs font-mono uppercase focus:outline-none"
                  >
                    <option value="all">All Order States</option>
                    <option value="new">New</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <span className="text-xs font-mono text-[#5e5e5e]">
                Displaying {filteredOrders.length} of {orders.length} Consignments
              </span>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#E5E5E5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#E5E5E5] bg-[#F5F4F2] text-[#5e5e5e] uppercase">
                      <th className="p-3">Order</th>
                      <th className="p-3">Customer & Location</th>
                      <th className="p-3">Items Summary</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment Proof</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#f9f9f9]">
                        <td className="p-3 font-semibold text-black">{ord.orderNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-black">{ord.customerName}</div>
                          <div className="text-[11px] text-[#5e5e5e]">
                            {ord.city}, {ord.state} • +91 {ord.phone}
                          </div>
                        </td>
                        <td className="p-3 text-[11px] max-w-xs">
                          {ord.items.map((i) => `${i.productName} (${i.variantName} × ${i.quantity})`).join(', ')}
                        </td>
                        <td className="p-3 font-semibold text-black">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          {ord.paymentScreenshotUrl && (ord.paymentScreenshotUrl.startsWith('http') || ord.paymentScreenshotUrl.startsWith('data:')) ? (
                            <button
                              type="button"
                              onClick={() => setScreenshotModalUrl(ord.paymentScreenshotUrl || null)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] hover:bg-emerald-100"
                            >
                              <span className="material-symbols-outlined text-[14px]">image</span>
                              <span>View Proof</span>
                            </button>
                          ) : (
                            <a
                              href={`https://wa.me/${ord.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] hover:bg-emerald-100"
                            >
                              <span className="material-symbols-outlined text-[13px] text-[#25D366]">chat</span>
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </td>

                        <td className="p-3">
                          <select
                            value={ord.paymentStatus}
                            onChange={(e) => updateOrderPaymentStatus(ord.id, e.target.value as PaymentStatus)}
                            className={`h-7 px-2 text-[10px] uppercase font-semibold border ${
                              ord.paymentStatus === 'verified'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : ord.paymentStatus === 'submitted'
                                ? 'bg-blue-50 border-blue-300 text-blue-800'
                                : 'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="submitted">Submitted</option>
                            <option value="verified">Verified</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="h-7 px-2 text-[10px] uppercase font-semibold bg-[#F5F4F2] border border-[#E5E5E5] text-black"
                          >
                            <option value="new">New</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1 bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-wider"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DYNAMIC PRODUCT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 border border-[#E5E5E5]">
              <div>
                <h2 className="text-sm font-semibold uppercase font-mono text-black">
                  Product Inventory Management
                </h2>
                <p className="text-xs text-[#5e5e5e] font-mono">
                  Modify pricing, batch stock levels, images, or add new formulations dynamically.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProdFormData({
                    name: '',
                    categoryId: categories[0]?.id || '',
                    description: '',
                    price: 100,
                    marketRate: 150,
                    weight: '100 gm',
                    stock: 20,
                    imageUrl: '',
                    isActive: true,
                    badge: '',
                    inci: '',
                    variants: [],
                  });
                  setIsAddingProduct(true);
                }}
                className="h-10 px-4 bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add New Product</span>
              </button>
            </div>

            {/* Product List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white border border-[#E5E5E5] p-4 flex flex-col justify-between">
                  <div className="flex gap-4 mb-3">
                    <div className="w-16 h-16 bg-[#F5F4F2] border border-[#E5E5E5] flex items-center justify-center p-1 flex-shrink-0">
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#5e5e5e] uppercase">
                        <span>{prod.categoryName}</span>
                        <span className={prod.isActive ? 'text-emerald-700' : 'text-neutral-400'}>
                          {prod.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-black line-clamp-1">{prod.name}</h4>
                      <p className="text-xs font-mono font-semibold text-black mt-1">
                        Our Price: ₹{prod.price}{' '}
                        {prod.marketRate && <span className="text-[10px] text-[#747878] line-through">(Mkt: ₹{prod.marketRate})</span>}
                      </p>
                      <p className="text-[11px] font-mono text-[#5e5e5e]">
                        Stock: {prod.stock > 0 ? `${prod.stock} units` : <span className="text-red-600 font-semibold">OUT OF STOCK</span>} • {prod.weight}
                      </p>
                      {prod.variants && prod.variants.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {prod.variants.map((v) => (
                            <span key={v.name} className="inline-block text-[9px] font-mono bg-[#F5F4F2] border border-[#E5E5E5] px-1.5 py-0.5 text-[#5e5e5e]">
                              {v.weight || v.name}: ₹{v.price}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5] font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => updateProduct(prod.id, { isActive: !prod.isActive })}
                      className="text-[11px] text-[#5e5e5e] hover:text-black underline"
                    >
                      {prod.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(prod);
                          setProdFormData({
                            name: prod.name,
                            categoryId: prod.categoryId,
                            description: prod.description,
                            price: prod.price,
                            marketRate: prod.marketRate || 0,
                            weight: prod.weight,
                            stock: prod.stock,
                            imageUrl: prod.imageUrl,
                            isActive: prod.isActive,
                            badge: prod.badge || '',
                            inci: prod.inci || '',
                            variants: prod.variants ? prod.variants.map((v) => ({ ...v })) : [],
                          });
                          setIsAddingProduct(true);
                        }}
                        className="px-2.5 py-1 border border-[#E5E5E5] hover:border-black text-[11px] uppercase tracking-wider"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete ${prod.name}?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="px-2.5 py-1 border border-red-200 text-red-600 hover:bg-red-50 text-[11px] uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for Add / Edit Product */}
            {isAddingProduct && (
              <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
                onClick={() => setIsAddingProduct(false)}
              >
                <div
                  className="bg-white max-w-2xl w-full border border-[#E5E5E5] p-6 sm:p-8 shadow-2xl relative my-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-6">
                    <h3 className="text-lg font-medium text-black font-mono">
                      {editingProduct ? 'Edit Formulation Record' : 'Add New Formulation'}
                    </h3>
                    <button type="button" onClick={() => setIsAddingProduct(false)}>
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
                    <div>
                      <label className="block uppercase text-black font-medium mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={prodFormData.name}
                        onChange={(e) => setProdFormData({ ...prodFormData, name: e.target.value })}
                        placeholder="e.g. Herbal Shampoo"
                        className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Category *
                        </label>
                        <select
                          value={prodFormData.categoryId}
                          onChange={(e) => setProdFormData({ ...prodFormData, categoryId: e.target.value })}
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Weight / Volume / Size *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodFormData.weight}
                          onChange={(e) => setProdFormData({ ...prodFormData, weight: e.target.value })}
                          placeholder="e.g. 100 gm or 200 ml"
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Our Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={prodFormData.price}
                          onChange={(e) => setProdFormData({ ...prodFormData, price: Number(e.target.value) })}
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Market Rate (₹)
                        </label>
                        <input
                          type="number"
                          value={prodFormData.marketRate}
                          onChange={(e) => setProdFormData({ ...prodFormData, marketRate: Number(e.target.value) })}
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Available Stock *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={prodFormData.stock}
                          onChange={(e) => setProdFormData({ ...prodFormData, stock: Number(e.target.value) })}
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase text-black font-medium mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={prodFormData.description}
                        onChange={(e) => setProdFormData({ ...prodFormData, description: e.target.value })}
                        placeholder="Botanical components, processing method, benefits..."
                        className="w-full p-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-black font-medium mb-1">
                        INCI Ingredients Disclosure
                      </label>
                      <input
                        type="text"
                        value={prodFormData.inci}
                        onChange={(e) => setProdFormData({ ...prodFormData, inci: e.target.value })}
                        placeholder="Full botanical chemical names (e.g. Saponified Cocos Nucifera, Tocopherol)"
                        className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Size & Quantity Variants Section */}
                    <div className="p-4 bg-[#fcfcfc] border border-[#E5E5E5] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="block uppercase text-black font-semibold text-xs tracking-wider">
                            Different Quantities & Sizes (Optional Variants)
                          </label>
                          <p className="text-[11px] text-[#5e5e5e] font-sans">
                            Configure multiple sizes or packs (e.g. 50g, 100g, 200g or 100 ml, 200 ml) with custom prices. Customers can select their preferred quantity on the storefront.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setProdFormData({
                              ...prodFormData,
                              variants: [
                                ...prodFormData.variants,
                                {
                                  name: '',
                                  weight: prodFormData.weight || '',
                                  price: prodFormData.price || 100,
                                },
                              ],
                            });
                          }}
                          className="h-8 px-3 bg-black text-white text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1 hover:bg-neutral-800 flex-shrink-0"
                        >
                          <span className="material-symbols-outlined text-[15px]">add</span>
                          <span>Add Quantity / Size</span>
                        </button>
                      </div>

                      {prodFormData.variants.length === 0 ? (
                        <div className="p-3 bg-white border border-dashed border-[#E5E5E5] text-center text-[#747878] text-[11px]">
                          No custom quantity variants added. Product will sell as a single size ({prodFormData.weight || 'Default'}) at ₹{prodFormData.price}. Click &quot;Add Quantity / Size&quot; above to create multiple options.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {prodFormData.variants.map((v, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2.5 border border-[#E5E5E5]">
                              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[10px] uppercase text-[#747878] mb-0.5">
                                    Option Label *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={v.name}
                                    placeholder="e.g. 100 ml Flacon"
                                    onChange={(e) => {
                                      const newVariants = [...prodFormData.variants];
                                      newVariants[idx] = { ...newVariants[idx], name: e.target.value };
                                      setProdFormData({ ...prodFormData, variants: newVariants });
                                    }}
                                    className="w-full h-8 px-2 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase text-[#747878] mb-0.5">
                                    Quantity / Weight *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={v.weight}
                                    placeholder="e.g. 100 ml or 200g"
                                    onChange={(e) => {
                                      const newVariants = [...prodFormData.variants];
                                      newVariants[idx] = { ...newVariants[idx], weight: e.target.value };
                                      setProdFormData({ ...prodFormData, variants: newVariants });
                                    }}
                                    className="w-full h-8 px-2 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase text-[#747878] mb-0.5">
                                    Price (₹) *
                                  </label>
                                  <input
                                    type="number"
                                    required
                                    min={1}
                                    value={v.price}
                                    onChange={(e) => {
                                      const newVariants = [...prodFormData.variants];
                                      newVariants[idx] = { ...newVariants[idx], price: Number(e.target.value) };
                                      setProdFormData({ ...prodFormData, variants: newVariants });
                                    }}
                                    className="w-full h-8 px-2 bg-[#f9f9f9] border border-[#E5E5E5] text-xs font-semibold focus:outline-none focus:border-black"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                title="Remove Variant"
                                onClick={() => {
                                  const newVariants = prodFormData.variants.filter((_, i) => i !== idx);
                                  setProdFormData({ ...prodFormData, variants: newVariants });
                                }}
                                className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 self-end"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Admin Image Uploader with Supabase Storage Integration */}
                    <AdminImageUploader
                      label="Product Photo"
                      value={prodFormData.imageUrl}
                      onChange={(url) => setProdFormData({ ...prodFormData, imageUrl: url })}
                      folder="products"
                      hint="Upload a photo from your computer or phone. Uploaded images are hosted on Supabase CDN and reflect globally on everybody's website."
                    />

                    <div>
                      <label className="block uppercase text-black font-medium mb-1">
                        Badge (Optional)
                      </label>
                      <input
                        type="text"
                        value={prodFormData.badge}
                        onChange={(e) => setProdFormData({ ...prodFormData, badge: e.target.value })}
                        placeholder="e.g. Best Seller, New Launch, Anti-Acne"
                        className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                      />
                    </div>


                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="prod-is-active"
                        checked={prodFormData.isActive}
                        onChange={(e) => setProdFormData({ ...prodFormData, isActive: e.target.checked })}
                        className="w-4 h-4 accent-black"
                      />
                      <label htmlFor="prod-is-active" className="text-xs text-black font-mono">
                        Active on Customer Storefront
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
                      <button
                        type="button"
                        onClick={() => setIsAddingProduct(false)}
                        className="h-10 px-5 border border-[#E5E5E5] text-[#5e5e5e] hover:text-black uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-10 px-6 bg-black text-white uppercase tracking-widest font-semibold hover:bg-neutral-800"
                      >
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DYNAMIC CATEGORY MANAGEMENT (Enforcing PDF Section 15 & 18) */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 border border-[#E5E5E5]">
              <div>
                <h2 className="text-sm font-semibold uppercase font-mono text-black">
                  Dynamic Category Classification
                </h2>
                <p className="text-xs text-[#5e5e5e] font-mono">
                  Categories configured here dynamically update the customer catalogue and product forms.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCatFormData({
                    name: '',
                    slug: '',
                    description: '',
                    imageUrl: '',
                    isActive: true,
                    displayOrder: categories.length + 1,
                  });
                  setIsAddingCategory(true);
                }}
                className="h-10 px-4 bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add New Category</span>
              </button>
            </div>

            {categoryActionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 font-mono">
                {categoryActionError}
              </div>
            )}

            {/* Categories Table */}
            <div className="bg-white border border-[#E5E5E5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#F5F4F2] text-[#5e5e5e] uppercase">
                    <th className="p-3">Order</th>
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Products Assigned</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {categories.map((cat) => {
                    const assignedProducts = products.filter((p) => p.categoryId === cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-[#f9f9f9]">
                        <td className="p-3 text-black font-semibold">{cat.displayOrder}</td>
                        <td className="p-3 font-semibold text-black">{cat.name}</td>
                        <td className="p-3 text-[#5e5e5e]">{cat.slug}</td>
                        <td className="p-3">
                          <span className="font-semibold text-black">{assignedProducts.length}</span>{' '}
                          formulations
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                            className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                              cat.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setCatFormData({
                                name: cat.name,
                                slug: cat.slug,
                                description: cat.description,
                                imageUrl: cat.imageUrl,
                                isActive: cat.isActive,
                                displayOrder: cat.displayOrder,
                              });
                              setIsAddingCategory(true);
                            }}
                            className="px-2.5 py-1 border border-[#E5E5E5] hover:border-black uppercase text-[10px]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-2.5 py-1 border border-red-200 text-red-600 hover:bg-red-50 uppercase text-[10px]"
                            title={
                              assignedProducts.length > 0
                                ? 'Cannot delete category with assigned products'
                                : 'Delete empty category'
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>

            {/* Modal for Add / Edit Category */}
            {isAddingCategory && (
              <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
                onClick={() => setIsAddingCategory(false)}
              >
                <div
                  className="bg-white max-w-lg w-full border border-[#E5E5E5] p-6 shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                    <h3 className="text-base font-semibold text-black font-mono uppercase">
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button type="button" onClick={() => setIsAddingCategory(false)}>
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-mono">
                    <div>
                      <label className="block uppercase text-black font-medium mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={catFormData.name}
                        onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                        placeholder="e.g. Hair Care or Lip Care"
                        className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-black font-medium mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={catFormData.description}
                        onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                        placeholder="Natural hair-care and scalp herbal formulations"
                        className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                      />
                    </div>

                    <AdminImageUploader
                      label="Category Banner / Icon"
                      value={catFormData.imageUrl}
                      onChange={(url) => setCatFormData({ ...catFormData, imageUrl: url })}
                      folder="categories"
                      hint="Upload a collection photo. Hosted on Supabase Storage."
                    />


                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={catFormData.displayOrder}
                          onChange={(e) =>
                            setCatFormData({ ...catFormData, displayOrder: Number(e.target.value) })
                          }
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Status
                        </label>
                        <select
                          value={catFormData.isActive ? 'true' : 'false'}
                          onChange={(e) =>
                            setCatFormData({ ...catFormData, isActive: e.target.value === 'true' })
                          }
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                        >
                          <option value="true">Active (Public)</option>
                          <option value="false">Disabled (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(false)}
                        className="h-10 px-4 border border-[#E5E5E5] text-[#5e5e5e] uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-10 px-6 bg-black text-white uppercase font-semibold"
                      >
                        {editingCategory ? 'Update Category' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 border border-[#E5E5E5]">
            <h2 className="text-sm font-semibold uppercase font-mono text-black border-b border-[#E5E5E5] pb-3 mb-6">
              Laboratory & UPI Merchant Setup
            </h2>

            {settingsSavedMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 font-mono mb-4">
                ✓ Business and UPI settings updated successfully.
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-black font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={settingsFormData.businessName}
                  onChange={(e) =>
                    setSettingsFormData({ ...settingsFormData, businessName: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-black font-medium mb-1">
                    Business Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsFormData.businessPhone}
                    onChange={(e) =>
                      setSettingsFormData({ ...settingsFormData, businessPhone: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block uppercase text-black font-medium mb-1">
                    WhatsApp Number (Digits with Country Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsFormData.whatsappNumber}
                    onChange={(e) =>
                      setSettingsFormData({ ...settingsFormData, whatsappNumber: e.target.value })
                    }
                    placeholder="919876543210"
                    className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-black font-medium mb-1">
                    Business UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsFormData.upiId}
                    onChange={(e) =>
                      setSettingsFormData({ ...settingsFormData, upiId: e.target.value })
                    }
                    placeholder="8078462709@upi"
                    className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block uppercase text-black font-medium mb-1">
                    UPI Merchant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsFormData.upiMerchantName}
                    onChange={(e) =>
                      setSettingsFormData({ ...settingsFormData, upiMerchantName: e.target.value })
                    }
                    placeholder="AKIA Hand Made"
                    className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-black font-medium mb-1">
                  Business Atelier Address
                </label>
                <textarea
                  rows={2}
                  value={settingsFormData.businessAddress}
                  onChange={(e) =>
                    setSettingsFormData({ ...settingsFormData, businessAddress: e.target.value })
                  }
                  className="w-full p-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-black font-medium mb-1">
                    Delivery Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsFormData.deliveryCharge}
                    onChange={(e) =>
                      setSettingsFormData({
                        ...settingsFormData,
                        deliveryCharge: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block uppercase text-black font-medium mb-1">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsFormData.freeShippingThreshold}
                    onChange={(e) =>
                      setSettingsFormData({
                        ...settingsFormData,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5]">
                <button
                  type="submit"
                  className="h-11 px-8 bg-black text-white uppercase tracking-widest font-semibold hover:bg-neutral-800"
                >
                  Save Business Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SECURITY & AUTH GATE */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-8 font-mono">
            {/* Security Architecture Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 border border-emerald-200 bg-emerald-50/30">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase mb-1">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Password Encryption</span>
                </div>
                <p className="text-[12px] text-[#5e5e5e] font-sans">
                  High-grade one-way encryption protects all administrative credentials.
                </p>
                <span className="inline-block mt-3 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="bg-white p-5 border border-blue-200 bg-blue-50/30">
                <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold uppercase mb-1">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                  <span>Account Lockout Shield</span>
                </div>
                <p className="text-[12px] text-[#5e5e5e] font-sans">
                  Temporary 5-minute cooldown automatically activated after 5 failed login attempts.
                </p>
                <span className="inline-block mt-3 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="bg-white p-5 border border-purple-200 bg-purple-50/30">
                <div className="flex items-center gap-2 text-purple-800 text-xs font-semibold uppercase mb-1">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Inactivity Guard</span>
                </div>
                <p className="text-[12px] text-[#5e5e5e] font-sans">
                  Session automatically terminates after 30 minutes of idle time to prevent session hijacking.
                </p>
                <span className="inline-block mt-3 text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 font-mono">
                  ACTIVE
                </span>
              </div>

              <div className="bg-white p-5 border border-amber-200 bg-amber-50/30">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase mb-1">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Input Sanitization</span>
                </div>
                <p className="text-[12px] text-[#5e5e5e] font-sans">
                  Strict entity escaping applied to all admin inputs to neutralize injection & XSS attempts.
                </p>
                <span className="inline-block mt-3 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 font-mono">
                  ACTIVE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Change Credentials Form */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#E5E5E5]">
                <h2 className="text-sm font-semibold uppercase font-mono text-black border-b border-[#E5E5E5] pb-3 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span>Update Admin Credentials</span>
                </h2>

                {credMsg && (
                  <div
                    className={`p-3 text-xs font-mono mb-4 border ${
                      credMsg.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {credMsg.text}
                  </div>
                )}

                <form onSubmit={handleChangeCredentials} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block uppercase text-black font-medium mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={credCurrentPass}
                      onChange={(e) => setCredCurrentPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-black font-medium mb-1">
                      New Username (Optional)
                    </label>
                    <input
                      type="text"
                      value={credNewUser}
                      onChange={(e) => setCredNewUser(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-black font-medium mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={credNewPass}
                      onChange={(e) => setCredNewPass(e.target.value)}
                      placeholder="Min 8 chars, uppercase, symbol, number"
                      className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-black font-medium mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={credConfirmPass}
                      onChange={(e) => setCredConfirmPass(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="bg-[#F5F4F2] p-3 text-[11px] text-[#5e5e5e] space-y-1">
                    <p className="font-semibold text-black uppercase">Password Policy Enforcement:</p>
                    <p>• At least 8 characters long</p>
                    <p>• At least 1 uppercase & 1 lowercase letter</p>
                    <p>• At least 1 number & 1 special symbol (!@#$%^&*)</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={credSubmitting}
                      className="w-full h-11 bg-black text-white uppercase tracking-widest font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
                    >
                      {credSubmitting ? 'Encrypting & Saving...' : 'Save New Credentials'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Audit Trail Table */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#E5E5E5]">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 mb-6">
                  <h2 className="text-sm font-semibold uppercase font-mono text-black flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    <span>Security & Access Audit Trail</span>
                  </h2>
                  {securityAuditLogs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Clear security audit trail?')) {
                          clearAuditLogs();
                        }
                      }}
                      className="text-[11px] text-[#5e5e5e] hover:text-red-600 underline"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {securityAuditLogs.length === 0 ? (
                  <p className="text-xs text-[#5e5e5e] py-8 text-center">No security logs recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E5E5E5] text-[#5e5e5e] uppercase text-[10px]">
                          <th className="py-2 px-2">Time</th>
                          <th className="py-2 px-2">Event</th>
                          <th className="py-2 px-2">User</th>
                          <th className="py-2 px-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {securityAuditLogs.map((log) => {
                          const badgeColor =
                            log.event === 'LOGIN_SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.event === 'LOCKOUT'
                              ? 'bg-red-100 text-red-800 font-bold'
                              : log.event === 'LOGIN_FAILED'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-neutral-800';

                          return (
                            <tr key={log.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa]">
                              <td className="py-2.5 px-2 text-[#5e5e5e] whitespace-nowrap text-[11px]">
                                {new Date(log.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </td>
                              <td className="py-2.5 px-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-none font-semibold ${badgeColor}`}>
                                  {log.event}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 font-semibold text-black">{log.username}</td>
                              <td className="py-2.5 px-2 text-[#5e5e5e] text-[11px] font-sans">
                                {log.details}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SUPABASE CLOUD DATABASE */}
        {/* ========================================================================= */}
        {activeTab === 'database' && (
          <div className="space-y-8 font-mono">
            {/* Status Banner */}
            <div
              className={`p-6 border ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : supabaseStatus === 'connecting'
                  ? 'bg-blue-50/60 border-blue-300 text-blue-950'
                  : 'bg-amber-50/60 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`material-symbols-outlined text-[28px] mt-0.5 ${
                      supabaseStatus === 'connected'
                        ? 'text-emerald-700'
                        : supabaseStatus === 'connecting'
                        ? 'text-blue-700 animate-spin'
                        : 'text-amber-700'
                    }`}
                  >
                    {supabaseStatus === 'connected'
                      ? 'cloud_done'
                      : supabaseStatus === 'connecting'
                      ? 'progress_activity'
                      : 'cloud_off'}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Supabase Cloud Database:{' '}
                      {supabaseStatus === 'connected'
                        ? 'Connected & Operational'
                        : supabaseStatus === 'connecting'
                        ? 'Connecting...'
                        : 'Local Mode / Disconnected'}
                    </h3>
                    <p className="text-xs text-[#5e5e5e] font-sans mt-1">
                      {supabaseMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={syncWithSupabase}
                    disabled={supabaseStatus === 'connecting'}
                    className="h-9 px-4 bg-white border border-[#E5E5E5] hover:border-black text-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors font-mono"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Sync Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePushDataToSupabase}
                    disabled={isPushingData || supabaseStatus !== 'connected'}
                    className="h-9 px-4 bg-[#8B261D] hover:bg-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors font-mono disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    title="Upload local seed catalog to Supabase PostgreSQL"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>{isPushingData ? 'Pushing Data...' : 'Push Seed Data'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#E5E5E5]">
                <h2 className="text-sm font-semibold uppercase font-mono text-black border-b border-[#E5E5E5] pb-3 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
                  <span>Supabase Credentials Setup</span>
                </h2>

                {supabaseActionMsg && (
                  <div
                    className={`p-3 text-xs font-mono mb-4 border ${
                      supabaseActionMsg.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {supabaseActionMsg.text}
                  </div>
                )}

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block uppercase text-black font-medium mb-1">
                      Project URL (VITE_SUPABASE_URL) *
                    </label>
                    <input
                      type="url"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://xyzprojectid.supabase.co"
                      required
                      className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black font-sans text-xs"
                    />
                    <p className="text-[10px] text-[#747878] mt-1 font-sans">
                      Found in: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                    </p>
                  </div>

                  <div>
                    <label className="block uppercase text-black font-medium mb-1">
                      Project Anon Key (VITE_SUPABASE_ANON_KEY) *
                    </label>
                    <textarea
                      rows={3}
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      required
                      className="w-full p-3 bg-[#f9f9f9] border border-[#E5E5E5] focus:outline-none focus:border-black font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-[#747878] mt-1 font-sans">
                      Found in: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API Keys (anon / public)
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingSupabase}
                      className="h-11 px-6 bg-black text-white uppercase tracking-widest font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex-1"
                    >
                      {isSubmittingSupabase ? 'Connecting & Verifying...' : 'Save & Connect Supabase'}
                    </button>
                    {supabaseConfig.url && (
                      <button
                        type="button"
                        onClick={() => {
                          setSupabaseUrlInput('');
                          setSupabaseKeyInput('');
                          updateSupabaseCredentials('', '');
                        }}
                        className="h-11 px-4 border border-red-200 text-red-600 hover:bg-red-50 uppercase tracking-widest text-xs"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>

                  {supabaseStatus === 'connected' && (
                    <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-black font-semibold uppercase text-xs">
                          Product Images Storage (CDN)
                        </span>
                        <button
                          type="button"
                          disabled={isTestingStorage}
                          onClick={handleTestStorage}
                          className="px-3 py-1 bg-white border border-[#E5E5E5] hover:border-black text-[11px] font-mono uppercase tracking-wider text-black flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isTestingStorage ? 'progress_activity' : 'verified'}
                          </span>
                          {isTestingStorage ? 'Checking...' : 'Check Storage Bucket'}
                        </button>
                      </div>

                      {storageTestResult && (
                        <div
                          className={`p-3 border text-xs font-mono flex items-start gap-2 ${
                            storageTestResult.type === 'success'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                            {storageTestResult.type === 'success' ? 'check_circle' : 'warning'}
                          </span>
                          <span className="leading-snug">{storageTestResult.text}</span>
                        </div>
                      )}
                    </div>
                  )}
                </form>

                <div className="mt-8 pt-6 border-t border-[#E5E5E5] space-y-2 text-xs font-sans text-[#5e5e5e]">
                  <p className="font-mono font-semibold uppercase text-black text-[11px]">
                    Automatic Failover Guarantee:
                  </p>
                  <p className="leading-relaxed">
                    AKIA uses a hybrid resilience pattern. When Supabase is configured, all changes to products, orders, and categories are saved directly to PostgreSQL, and product photos upload to Supabase Storage CDN for global delivery.
                  </p>
                </div>
              </div>

              {/* Database Schema & Instructions Panel */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 border border-[#E5E5E5]">
                <h2 className="text-sm font-semibold uppercase font-mono text-black border-b border-[#E5E5E5] pb-3 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">schema</span>
                    <span>Database Schema Setup Guide</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5">
                    PostgreSQL 15+
                  </span>
                </h2>

                <div className="space-y-4 text-xs font-sans text-[#5e5e5e]">
                  <div className="bg-[#F5F4F2] p-4 border-l-2 border-[#8B261D] font-mono text-black space-y-2">
                    <p className="font-semibold text-xs uppercase">Quick 30-Second Setup in Supabase:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#444]">
                      <li>Create a new project at <strong>supabase.com</strong>.</li>
                      <li>Go to <strong>SQL Editor</strong> in the left sidebar.</li>
                      <li>Click <strong>New Query</strong>, copy & paste the contents of:</li>
                      <li className="font-bold text-[#8B261D] pl-4">supabase_schema.sql</li>
                      <li>Click <strong>RUN</strong> to create all tables, seed data & storage bucket!</li>
                    </ol>
                  </div>

                  <h4 className="font-mono text-black font-semibold uppercase text-xs pt-2">
                    Included Database Tables & Storage:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2.5 bg-[#f9f9f9] border border-[#E5E5E5]">
                      <span className="font-bold text-black block">categories</span>
                      <span className="text-[#747878]">5 AKIA Collections</span>
                    </div>
                    <div className="p-2.5 bg-[#f9f9f9] border border-[#E5E5E5]">
                      <span className="font-bold text-black block">products</span>
                      <span className="text-[#747878]">16 Herbal Formulations</span>
                    </div>
                    <div className="p-2.5 bg-[#f9f9f9] border border-[#E5E5E5]">
                      <span className="font-bold text-black block">orders</span>
                      <span className="text-[#747878]">UPI & WhatsApp Orders</span>
                    </div>
                    <div className="p-2.5 bg-[#f9f9f9] border border-[#E5E5E5]">
                      <span className="font-bold text-black block">business_settings</span>
                      <span className="text-[#747878]">UPI ID & Shipping Rates</span>
                    </div>
                    <div className="p-2.5 bg-[#f9f9f9] border border-[#E5E5E5] col-span-2">
                      <span className="font-bold text-black block">security_audit_logs</span>
                      <span className="text-[#747878]">Administrative security and activity audit logs</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 col-span-2">
                      <span className="font-bold text-emerald-900 block flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                        Storage: product-images (Public Bucket)
                      </span>
                      <span className="text-emerald-700">Public CDN bucket for all product & category photos</span>
                    </div>
                  </div>


                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <p className="text-[11px] text-[#747878]">
                      Note: Row Level Security (RLS) policies are automatically configured in the script allowing read/write operations with your public Anon Key.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ORDER DETAILS INSPECTION */}
        {/* ========================================================================= */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white max-w-3xl w-full border border-[#E5E5E5] p-6 sm:p-8 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] mb-6">
                <div>
                  <span className="text-[10px] text-[#5e5e5e] uppercase font-mono block">
                    Consignment Manifest
                  </span>
                  <h3 className="text-xl font-bold font-mono text-black">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button type="button" onClick={() => setSelectedOrder(null)}>
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              <div className="space-y-6 text-xs font-mono">
                {/* Status Update Control strip */}
                <div className="bg-[#F5F4F2] p-4 border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-[#5e5e5e] block mb-1">
                      Payment Verification:
                    </span>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => {
                        updateOrderPaymentStatus(selectedOrder.id, e.target.value as PaymentStatus);
                        setSelectedOrder({
                          ...selectedOrder,
                          paymentStatus: e.target.value as PaymentStatus,
                        });
                      }}
                      className="h-8 px-2 uppercase font-semibold bg-white border border-[#E5E5E5]"
                    >
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted (Screenshot Uploaded)</option>
                      <option value="verified">Verified (Bank Checked)</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#5e5e5e] block mb-1">
                      Fulfillment State:
                    </span>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus);
                        setSelectedOrder({
                          ...selectedOrder,
                          orderStatus: e.target.value as OrderStatus,
                        });
                      }}
                      className="h-8 px-2 uppercase font-semibold bg-white border border-[#E5E5E5]"
                    >
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <a
                    href={`https://wa.me/91${selectedOrder.phone}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.customerName}, regarding your AKIA order ${selectedOrder.orderNumber}: Your order status is now ${selectedOrder.orderStatus.toUpperCase()} and payment is ${selectedOrder.paymentStatus.toUpperCase()}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 bg-[#075E54] text-white flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>WhatsApp Customer</span>
                  </a>
                </div>

                {/* Recipient & Shipping Information */}
                <div className="grid grid-cols-2 gap-4 border-b border-[#E5E5E5] pb-4">
                  <div>
                    <p className="font-semibold text-black uppercase text-[11px] mb-1">Customer:</p>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                    <p>Phone: +91 {selectedOrder.phone}</p>
                    {selectedOrder.email && <p>Email: {selectedOrder.email}</p>}
                  </div>

                  <div>
                    <p className="font-semibold text-black uppercase text-[11px] mb-1">
                      Delivery Address:
                    </p>
                    <p>{selectedOrder.address}</p>
                    <p>
                      {selectedOrder.city}, {selectedOrder.district}, {selectedOrder.state} —{' '}
                      {selectedOrder.pincode}
                    </p>
                    {selectedOrder.deliveryInstructions && (
                      <p className="text-[#5e5e5e] italic mt-1">
                        "{selectedOrder.deliveryInstructions}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <p className="font-semibold text-black uppercase text-[11px] mb-2">
                    Order Items Snapshot:
                  </p>
                  <div className="space-y-1.5">
                    {selectedOrder.items.map((it) => (
                      <div key={it.id} className="flex justify-between py-1 border-b border-[#f3f3f3]">
                        <span>
                          {it.productName} ({it.variantName}) × {it.quantity}
                        </span>
                        <span className="font-semibold">₹{it.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 space-y-1 text-right">
                    <div className="text-[#5e5e5e]">Subtotal: ₹{selectedOrder.subtotal}</div>
                    <div className="text-[#5e5e5e]">Delivery: ₹{selectedOrder.deliveryCharge}</div>
                    <div className="text-sm font-semibold text-black border-t border-[#E5E5E5] pt-1 inline-block min-w-40">
                      Total Payable: ₹{selectedOrder.totalAmount}
                    </div>
                  </div>
                </div>

                {/* Attached Screenshot Inspection / WhatsApp Proof */}
                <div className="border-t border-[#E5E5E5] pt-4">
                  <p className="font-semibold text-black uppercase text-[11px] mb-2">
                    Payment Verification:
                  </p>
                  {selectedOrder.paymentScreenshotUrl && (selectedOrder.paymentScreenshotUrl.startsWith('http') || selectedOrder.paymentScreenshotUrl.startsWith('data:')) ? (
                    <div
                      onClick={() => setScreenshotModalUrl(selectedOrder.paymentScreenshotUrl || null)}
                      className="border border-[#E5E5E5] bg-[#F5F4F2] p-2 inline-block cursor-pointer hover:border-black transition-colors"
                    >
                      <img
                        src={selectedOrder.paymentScreenshotUrl}
                        alt="Payment proof"
                        className="max-h-48 object-contain"
                      />
                      <span className="text-[10px] text-[#5e5e5e] block text-center mt-1">
                        Click to enlarge proof
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-emerald-950 block">
                          Payment Screenshot Directed to WhatsApp
                        </span>
                        <span className="text-[11px] text-emerald-800 font-mono">
                          Customer WhatsApp: +91 {selectedOrder.phone}
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/${selectedOrder.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedOrder.customerName}, regarding your AKIA Order ${selectedOrder.orderNumber}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] uppercase tracking-wider font-semibold font-mono flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        <span>Open Customer WhatsApp Chat</span>
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* MODAL: SCREENSHOT FULL ZOOM */}
        {screenshotModalUrl && (
          <div
            className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setScreenshotModalUrl(null)}
          >
            <div className="relative max-w-3xl max-h-[90vh] bg-white p-2">
              <button
                type="button"
                onClick={() => setScreenshotModalUrl(null)}
                className="absolute top-4 right-4 bg-black text-white p-1"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
              <img
                src={screenshotModalUrl}
                alt="Enlarged Payment Screenshot"
                className="max-h-[85vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
