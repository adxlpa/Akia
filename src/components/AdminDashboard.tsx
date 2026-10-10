import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, Product, Category, PaymentStatus, OrderStatus } from '../types';

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
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'settings'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);

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
  const [prodFormData, setProdFormData] = useState({
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
    const image =
      catFormData.imageUrl.trim() ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDh9bS9yVt6WbeI4tn-yrRZGHFyHDkXAJl_YJ4Eq0m1K1pcHwMaeT5zko0g_8nViSWtJm8TFJq7LWwnt--D_JVZIBUGSK_di3IKVTouZNHEFrDpS2n2brelHxCq5r45ihW0b1eZg_QVmlcVVU_T44SHwixeOohNuW2iEVAs2JDw-MD4QOSGKSPMIrf3_4ruJPcqChxByGoPlF2xkTE5iiUO82aZoOyxvoNdzK4s8ipD1wX8UpVXb8Fj';

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catFormData.name,
        slug,
        description: catFormData.description,
        imageUrl: image,
        isActive: catFormData.isActive,
        displayOrder: Number(catFormData.displayOrder),
      });
      setEditingCategory(null);
    } else {
      addCategory({
        name: catFormData.name,
        slug,
        description: catFormData.description,
        imageUrl: image,
        isActive: catFormData.isActive,
        displayOrder: Number(catFormData.displayOrder),
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
    const image =
      prodFormData.imageUrl.trim() ||
      chosenCategory?.imageUrl ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDh9bS9yVt6WbeI4tn-yrRZGHFyHDkXAJl_YJ4Eq0m1K1pcHwMaeT5zko0g_8nViSWtJm8TFJq7LWwnt--D_JVZIBUGSK_di3IKVTouZNHEFrDpS2n2brelHxCq5r45ihW0b1eZg_QVmlcVVU_T44SHwixeOohNuW2iEVAs2JDw-MD4QOSGKSPMIrf3_4ruJPcqChxByGoPlF2xkTE5iiUO82aZoOyxvoNdzK4s8ipD1wX8UpVXb8Fj';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodFormData.name,
        categoryId: prodFormData.categoryId,
        categoryName,
        description: prodFormData.description,
        price: Number(prodFormData.price),
        marketRate: Number(prodFormData.marketRate) || undefined,
        weight: prodFormData.weight,
        stock: Number(prodFormData.stock),
        imageUrl: image,
        isActive: prodFormData.isActive,
        badge: prodFormData.badge || undefined,
        inci: prodFormData.inci || undefined,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: prodFormData.name,
        categoryId: prodFormData.categoryId,
        categoryName,
        description: prodFormData.description,
        price: Number(prodFormData.price),
        marketRate: Number(prodFormData.marketRate) || undefined,
        weight: prodFormData.weight,
        stock: Number(prodFormData.stock),
        imageUrl: image,
        isActive: prodFormData.isActive,
        badge: prodFormData.badge || undefined,
        inci: prodFormData.inci || undefined,
        rating: 5.0,
        reviewCount: 1,
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
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsFormData);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
        {/* Top Header */}
        <div className="border-b border-[#E5E5E5] pb-6 mb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5e5e5e] font-mono uppercase mb-2">
              <span className="w-2 h-2 bg-black"></span>
              <span>Atelier Management Portal</span>
              <span>/</span>
              <span className="text-black font-semibold">Live Admin Console</span>
            </div>
            <h1 className="text-3xl text-black font-normal tracking-tight">
              {settings.businessName} Control Center
            </h1>
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
                          {ord.paymentScreenshotUrl ? (
                            <button
                              type="button"
                              onClick={() => setScreenshotModalUrl(ord.paymentScreenshotUrl || null)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] hover:bg-emerald-100"
                            >
                              <span className="material-symbols-outlined text-[14px]">image</span>
                              <span>View Proof</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#747878] italic">No proof</span>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={prodFormData.imageUrl}
                          onChange={(e) => setProdFormData({ ...prodFormData, imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-black font-medium mb-1">
                          Badge (Optional)
                        </label>
                        <input
                          type="text"
                          value={prodFormData.badge}
                          onChange={(e) => setProdFormData({ ...prodFormData, badge: e.target.value })}
                          placeholder="e.g. Best Seller, New Launch"
                          className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#E5E5E5] text-xs focus:outline-none focus:border-black"
                        />
                      </div>
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
                    placeholder="akiralab@okaxis"
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
                    placeholder="AKIRA Botanicals"
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
                      `Hello ${selectedOrder.customerName}, regarding your AKIRA order ${selectedOrder.orderNumber}: Your order status is now ${selectedOrder.orderStatus.toUpperCase()} and payment is ${selectedOrder.paymentStatus.toUpperCase()}.`
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

                {/* Attached Screenshot Inspection */}
                {selectedOrder.paymentScreenshotUrl && (
                  <div className="border-t border-[#E5E5E5] pt-4">
                    <p className="font-semibold text-black uppercase text-[11px] mb-2">
                      Customer Payment Screenshot Proof:
                    </p>
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
                  </div>
                )}
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
