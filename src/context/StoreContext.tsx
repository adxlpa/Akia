import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Product, Order, CartItem, BusinessSettings, PaymentStatus, OrderStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: BusinessSettings;
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  activeView: 'home' | 'catalogue' | 'checkout' | 'payment' | 'order-confirmation' | 'admin' | 'order-track';
  setActiveView: (view: 'home' | 'catalogue' | 'checkout' | 'payment' | 'order-confirmation' | 'admin' | 'order-track') => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (catId: string | null) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  activeOrderForPayment: Order | null;
  setActiveOrderForPayment: (ord: Order | null) => void;
  
  // Cart operations
  addToCart: (product: Product, variantName?: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, variantName: string, delta: number) => void;
  removeFromCart: (productId: string, variantName: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  shippingRemaining: number;
  isShippingFree: boolean;
  calculatedDeliveryCharge: number;

  // Order operations
  createOrder: (customerInfo: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    deliveryInstructions?: string;
  }) => Order;
  submitPaymentScreenshot: (orderId: string, screenshotUrl: string) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Admin Product & Category operations
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => { success: boolean; error?: string };
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'akira_products_v1',
  CATEGORIES: 'akira_categories_v1',
  ORDERS: 'akira_orders_v1',
  SETTINGS: 'akira_settings_v1',
  CART: 'akira_cart_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [
        {
          productId: 'prod-revive-serum',
          productName: 'Revive Amber Facial Serum',
          variantName: '30ml / Flacon',
          unitPrice: 1850,
          quantity: 1,
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg5Q7pn22JT02k3WeaxAhL5sAVymtcSJggOHrn3-IFLUBFeOrycgciFeJGG1Mue4tSPyV0aM8faXCM0dPyBcG0mJnadRHhdXki2PRXyUNANLJd5azB4NBXlGt7EPHCmycpIGVwWZr6KdFDw1XiwetgAN9cCjRg21yijs-0pvTtnmbOVZo6TyAVXBP9NoCscjL66v7huMgtG5EaM30MrBv0muvKt2TPC_uFA_i4aEswgfDWnl5gTuGH',
          weight: '30ml',
        }
      ];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'catalogue' | 'checkout' | 'payment' | 'order-confirmation' | 'admin' | 'order-track'>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeOrderForPayment, setActiveOrderForPayment] = useState<Order | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isShippingFree = cartSubtotal >= settings.freeShippingThreshold;
  const shippingRemaining = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const calculatedDeliveryCharge = cartSubtotal === 0 ? 0 : (isShippingFree ? 0 : settings.deliveryCharge);

  // Cart Handlers
  const addToCart = (product: Product, variantName?: string, quantity = 1) => {
    if (product.stock <= 0) {
      alert(`${product.name} is currently out of stock.`);
      return;
    }

    const selectedVariant = product.variants?.find((v) => v.name === variantName);
    const chosenVariantName = selectedVariant ? selectedVariant.name : (product.variants?.[0]?.name || product.weight);
    const chosenPrice = selectedVariant ? selectedVariant.price : product.price;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.variantName === chosenVariantName
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          updated[existingIndex].quantity = product.stock;
        } else {
          updated[existingIndex].quantity = newQty;
        }
        return updated;
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            productName: product.name,
            variantName: chosenVariantName,
            unitPrice: chosenPrice,
            quantity: Math.min(quantity, product.stock),
            imageUrl: product.imageUrl,
            weight: selectedVariant ? selectedVariant.weight : product.weight,
          },
        ];
      }
    });

    setCartOpen(true);
  };

  const updateCartQuantity = (productId: string, variantName: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId && item.variantName === variantName) {
            const product = products.find((p) => p.id === productId);
            const stockMax = product ? product.stock : 999;
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > stockMax) {
              alert(`Only ${stockMax} units available in stock.`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string, variantName: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.productId === productId && item.variantName === variantName))
    );
  };

  const clearCart = () => setCart([]);

  // Create Order - recalculates totals reliably from backend/state rules (as in PDF Requirement 6)
  const createOrder = (customerInfo: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    deliveryInstructions?: string;
  }): Order => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Snapshot items and calculate subtotal securely
    let calculatedSubtotal = 0;
    const orderItems = cart.map((item, idx) => {
      const liveProduct = products.find((p) => p.id === item.productId);
      const unitPrice = item.unitPrice; // Snapshot item unit price
      const totalPrice = unitPrice * item.quantity;
      calculatedSubtotal += totalPrice;

      // Update product inventory stock
      if (liveProduct) {
        const newStock = Math.max(0, liveProduct.stock - item.quantity);
        updateProduct(liveProduct.id, { stock: newStock });
      }

      return {
        id: `item-${Date.now()}-${idx}`,
        orderId: '',
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        imageUrl: item.imageUrl,
      };
    });

    const deliveryFee = calculatedSubtotal >= settings.freeShippingThreshold ? 0 : settings.deliveryCharge;
    const finalTotal = calculatedSubtotal + deliveryFee;

    const nextOrderNum = `#${1024 + orders.length + 1}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNum,
      customerName: customerInfo.customerName,
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      city: customerInfo.city,
      district: customerInfo.district,
      state: customerInfo.state,
      pincode: customerInfo.pincode,
      deliveryInstructions: customerInfo.deliveryInstructions,
      subtotal: calculatedSubtotal,
      deliveryCharge: deliveryFee,
      totalAmount: finalTotal,
      paymentStatus: 'pending',
      orderStatus: 'new',
      items: orderItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newOrder.items.forEach((item) => (item.orderId = newOrder.id));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCartOpen(false);
    setActiveOrderForPayment(newOrder);
    setActiveView('payment');

    return newOrder;
  };

  const submitPaymentScreenshot = (orderId: string, screenshotUrl: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            paymentScreenshotUrl: screenshotUrl,
            paymentStatus: 'submitted' as PaymentStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    setActiveOrderForPayment((prev) => {
      if (prev && prev.id === orderId) {
        return {
          ...prev,
          paymentScreenshotUrl: screenshotUrl,
          paymentStatus: 'submitted',
          updatedAt: new Date().toISOString(),
        };
      }
      return prev;
    });

    setActiveView('order-confirmation');
  };

  const updateOrderPaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o))
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Category CRUD with Rule 18 validation: Prevent deleting category that contains products
  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteCategory = (categoryId: string): { success: boolean; error?: string } => {
    const hasProducts = products.some((p) => p.categoryId === categoryId);
    if (hasProducts) {
      return {
        success: false,
        error: 'Cannot delete a category that still contains products. Please reassign or delete the products first, or disable this category.',
      };
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    return { success: true };
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        cart,
        cartOpen,
        setCartOpen,
        activeView,
        setActiveView,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchModalOpen,
        setSearchModalOpen,
        searchQuery,
        setSearchQuery,
        activeProductModal,
        setActiveProductModal,
        activeOrderForPayment,
        setActiveOrderForPayment,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        shippingRemaining,
        isShippingFree,
        calculatedDeliveryCharge,
        createOrder,
        submitPaymentScreenshot,
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
