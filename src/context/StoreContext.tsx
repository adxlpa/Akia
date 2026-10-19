import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Category,
  Product,
  Order,
  CartItem,
  BusinessSettings,
  PaymentStatus,
  OrderStatus,
  AdminSession,
  SecurityAuditLog,
  AdminCredentials,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_ADMIN_CREDENTIALS,
} from '../data/initialData';
import {
  verifyPassword,
  hashPassword,
  generateSecureToken,
  sanitizeInput,
  validatePasswordStrength,
  computeSessionSignature,
  verifySessionSignature,
  sanitizeUrl,
} from '../utils/security';

import {
  getSupabaseClient,
  isSupabaseConfigured,
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  testSupabaseConnection,
  mapCategoryFromSupabase,
  mapCategoryToSupabase,
  mapProductFromSupabase,
  mapProductToSupabase,
  mapOrderFromSupabase,
  mapOrderToSupabase,
  mapSettingsFromSupabase,
  mapSettingsToSupabase,
  mapAuditLogFromSupabase,
  mapAuditLogToSupabase,
} from '../lib/supabase';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: BusinessSettings;
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  activeView: 'home' | 'catalogue' | 'about' | 'reviews' | 'contact' | 'checkout' | 'payment' | 'order-confirmation' | 'admin' | 'order-track';
  setActiveView: (view: 'home' | 'catalogue' | 'about' | 'reviews' | 'contact' | 'checkout' | 'payment' | 'order-confirmation' | 'admin' | 'order-track') => void;
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

  // Admin Authentication & Security
  isAdminAuthenticated: boolean;
  adminSession: AdminSession | null;
  securityAuditLogs: SecurityAuditLog[];
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminCredentials: (
    currentPass: string,
    newPass: string,
    newUsername?: string
  ) => Promise<{ success: boolean; error?: string }>;
  clearAuditLogs: () => void;

  // Supabase Backend Sync Operations
  isSupabaseEnabled: boolean;
  supabaseStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  supabaseMessage: string;
  supabaseConfig: { url: string; anonKey: string };
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
  pushLocalDataToSupabase: () => Promise<{ success: boolean; message: string }>;
  updateSupabaseCredentials: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'akia_products_v2',
  CATEGORIES: 'akia_categories_v2',
  ORDERS: 'akia_orders_v2',
  SETTINGS: 'akia_settings_v2',
  CART: 'akia_cart_v2',
  ADMIN_CREDS: 'akia_admin_creds_v2',
  ADMIN_SESSION: 'akia_admin_session_v2',
  AUDIT_LOGS: 'akia_audit_logs_v2',
  LOCKOUT: 'akia_lockout_v2',
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes inactivity timeout

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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Credentials & Security States
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_CREDS);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_CREDENTIALS;
    } catch {
      return INITIAL_ADMIN_CREDENTIALS;
    }
  });

  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (!saved) return null;
      const session: AdminSession = JSON.parse(saved);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  });

  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'log-init',
          timestamp: new Date().toISOString(),
          event: 'LOGIN_SUCCESS',
          username: 'system',
          details: 'AKIA Secure Gateway protection initialized with SHA-256.',
        },
      ];
    } catch {
      return [];
    }
  });

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCKOUT);
      if (!saved) return 0;
      const parsed = JSON.parse(saved);
      return parsed.failedAttempts || 0;
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCKOUT);
      if (!saved) return 0;
      const parsed = JSON.parse(saved);
      return parsed.lockoutUntil || 0;
    } catch {
      return 0;
    }
  });

  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Supabase Backend States
  const [supabaseConfig, setSupabaseConfig] = useState(getStoredSupabaseConfig());
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Supabase not configured');

  const [cartOpen, setCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'catalogue' | 'about' | 'reviews' | 'contact' | 'checkout' | 'payment' | 'order-confirmation' | 'admin' | 'order-track'>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeOrderForPayment, setActiveOrderForPayment] = useState<Order | null>(null);

  // Sync state to LocalStorage as resilient cache
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_CREDS, JSON.stringify(adminCredentials));
    } catch (e) {
      console.error(e);
    }
  }, [adminCredentials]);

  useEffect(() => {
    try {
      if (adminSession) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch (e) {
      console.error(e);
    }
  }, [adminSession]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(securityAuditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [securityAuditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.LOCKOUT,
        JSON.stringify({ failedAttempts, lockoutUntil })
      );
    } catch (e) {
      console.error(e);
    }
  }, [failedAttempts, lockoutUntil]);

  // Lockout Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        setLockoutRemainingSeconds(remaining);
      } else {
        setLockoutRemainingSeconds(0);
        if (lockoutUntil > 0 && failedAttempts >= MAX_FAILED_ATTEMPTS) {
          setFailedAttempts(0);
          setLockoutUntil(0);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil, failedAttempts]);

  // Session Inactivity Expiry Watcher
  useEffect(() => {
    if (!adminSession) return;

    const checkExpiry = () => {
      if (Date.now() > adminSession.expiresAt) {
        setAdminSession(null);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        addAuditLog({
          event: 'LOGOUT',
          username: adminSession.username,
          details: 'Session expired due to inactivity timeout.',
        });
      }
    };

    const interval = setInterval(checkExpiry, 5000);
    return () => clearInterval(interval);
  }, [adminSession]);

  // Session signature validation on load & tamper defense
  useEffect(() => {
    if (!adminSession) return;
    let isMounted = true;
    const validate = async () => {
      if (!adminSession.signature) {
        setAdminSession(null);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        return;
      }
      const isValid = await verifySessionSignature(
        adminSession,
        adminCredentials.passwordHash
      );
      if (!isValid && isMounted) {
        setAdminSession(null);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    };
    validate();
    return () => {
      isMounted = false;
    };
  }, [adminSession?.token, adminCredentials.passwordHash]);

  const lastRefreshRef = useRef<number>(Date.now());

  // Refresh session activity on user interaction when logged in (throttled to once a minute)
  const refreshSessionActivity = useCallback(() => {
    const now = Date.now();
    if (adminSession && now - lastRefreshRef.current > 60 * 1000) {
      lastRefreshRef.current = now;
      if (now < adminSession.expiresAt) {
        setAdminSession((prev) =>
          prev ? { ...prev, expiresAt: now + SESSION_DURATION_MS } : null
        );
      }
    }
  }, [adminSession]);

  useEffect(() => {
    if (!adminSession) return;
    const handleActivity = () => refreshSessionActivity();
    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [adminSession, refreshSessionActivity]);

  // ---------------------------------------------------------------------------
  // SUPABASE DATA SYNCHRONIZATION
  // ---------------------------------------------------------------------------
  const syncWithSupabase = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      setSupabaseStatus('disconnected');
      setSupabaseMessage('Supabase credentials not configured. Running in local storage mode.');
      return { success: false, message: 'Supabase credentials missing.' };
    }

    setSupabaseStatus('connecting');
    setSupabaseMessage('Synchronizing with Supabase database...');

    try {
      // 1. Fetch categories
      const { data: catData, error: catError } = await client
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catError) {
        throw new Error(`Categories sync error: ${catError.message}`);
      }

      if (catData && catData.length > 0) {
        setCategories(catData.map(mapCategoryFromSupabase));
      }

      // 2. Fetch products
      const { data: prodData, error: prodError } = await client
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (prodError) {
        throw new Error(`Products sync error: ${prodError.message}`);
      }

      if (prodData && prodData.length > 0) {
        setProducts(prodData.map(mapProductFromSupabase));
      }

      // 3. Fetch orders (Restricted to authenticated admin to protect customer privacy)
      const isAuth = Boolean(
        adminSession &&
        adminSession.signature &&
        Date.now() < adminSession.expiresAt
      );

      if (isAuth) {
        const { data: orderData, error: orderError } = await client
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (orderError) {
          console.warn(`Orders sync notice: ${orderError.message}`);
        } else if (orderData && orderData.length > 0) {
          setOrders(orderData.map(mapOrderFromSupabase));
        }

        // Fetch audit logs
        const { data: logData } = await client
          .from('security_audit_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (logData && logData.length > 0) {
          setSecurityAuditLogs(logData.map(mapAuditLogFromSupabase));
        }
      }

      // 4. Fetch business settings (public for store checkout)
      const { data: settingsData, error: settingsError } = await client
        .from('business_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (settingsError) {
        console.warn('Settings table fetch warning:', settingsError.message);
      } else if (settingsData) {
        setSettings(mapSettingsFromSupabase(settingsData));
      }

      setSupabaseStatus('connected');
      setSupabaseMessage('Connected & fully synchronized with Supabase.');
      return { success: true, message: 'Synchronized with Supabase successfully!' };
    } catch (err: any) {
      console.error('Supabase synchronization error:', err);
      setSupabaseStatus('error');
      setSupabaseMessage(`Sync failed: ${err.message || 'Network error'}. Fallback to local data.`);
      return { success: false, message: err.message || 'Sync failed.' };
    }
  }, []);

  // Initial Supabase connection check on load
  useEffect(() => {
    if (isSupabaseConfigured()) {
      syncWithSupabase();
    } else {
      setSupabaseStatus('disconnected');
      setSupabaseMessage('No Supabase credentials detected. Operating in local storage mode.');
    }
  }, [syncWithSupabase]);

  // One-click Push Local Seed Data to Supabase (Categories, Products, Settings)
  const pushLocalDataToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Please configure Supabase URL and Anon Key first.' };
    }

    try {
      setSupabaseStatus('connecting');

      // 1. Upsert Categories
      const supabaseCategories = categories.map(mapCategoryToSupabase);
      const { error: catErr } = await client.from('categories').upsert(supabaseCategories);
      if (catErr) throw new Error(`Failed to push categories: ${catErr.message}`);

      // 2. Upsert Products
      const supabaseProducts = products.map(mapProductToSupabase);
      const { error: prodErr } = await client.from('products').upsert(supabaseProducts);
      if (prodErr) throw new Error(`Failed to push products: ${prodErr.message}`);

      // 3. Upsert Settings
      const supabaseSettings = mapSettingsToSupabase(settings);
      const { error: setErr } = await client.from('business_settings').upsert(supabaseSettings);
      if (setErr) throw new Error(`Failed to push settings: ${setErr.message}`);

      setSupabaseStatus('connected');
      setSupabaseMessage('All 16 AKIA products, categories, and settings pushed to Supabase successfully!');
      return { success: true, message: 'Successfully populated Supabase database with all AKIA data!' };
    } catch (err: any) {
      setSupabaseStatus('error');
      setSupabaseMessage(`Push failed: ${err.message}`);
      return { success: false, message: err.message };
    }
  };

  const updateSupabaseCredentials = async (
    url: string,
    anonKey: string
  ): Promise<{ success: boolean; message: string }> => {
    saveStoredSupabaseConfig(url, anonKey);
    setSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });

    if (!url.trim() || !anonKey.trim()) {
      setSupabaseStatus('disconnected');
      setSupabaseMessage('Supabase credentials cleared. Using local persistence.');
      return { success: true, message: 'Switched to local persistence.' };
    }

    const testRes = await testSupabaseConnection();
    if (testRes.success) {
      await syncWithSupabase();
      return { success: true, message: 'Connected to Supabase successfully!' };
    } else {
      setSupabaseStatus('error');
      setSupabaseMessage(testRes.message);
      return { success: false, message: testRes.message };
    }
  };

  const addAuditLog = (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => {
    const newEntry: SecurityAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    setSecurityAuditLogs((prev) => [newEntry, ...prev].slice(0, 50));

    // Asynchronously insert into Supabase if connected
    const client = getSupabaseClient();
    if (client) {
      client.from('security_audit_logs').insert(mapAuditLogToSupabase(newEntry)).then();
    }
  };

  const isAdminAuthenticated = Boolean(
    adminSession && Date.now() < adminSession.expiresAt
  );

  const isLockedOut = lockoutRemainingSeconds > 0;

  // Administrative Login Function with Antihacking / Rate Limiting Controls
  const loginAdmin = async (
    rawUsername: string,
    rawPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isLockedOut) {
      return {
        success: false,
        error: `Security lockout active. Please wait ${lockoutRemainingSeconds}s before attempting again.`,
      };
    }

    await new Promise((r) => setTimeout(r, 750));

    const username = sanitizeInput(rawUsername);
    const password = rawPassword;

    const isUserValid = username.toLowerCase() === adminCredentials.username.toLowerCase();
    const isPassValid = isUserValid
      ? await verifyPassword(password, adminCredentials.passwordHash, adminCredentials.salt)
      : false;

    if (isUserValid && isPassValid) {
      const token = generateSecureToken();
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      const signature = await computeSessionSignature(
        token,
        adminCredentials.username,
        adminCredentials.passwordHash
      );
      const newSession: AdminSession = {
        token,
        expiresAt,
        username: adminCredentials.username,
        signature,
      };

      setAdminSession(newSession);
      setFailedAttempts(0);
      setLockoutUntil(0);
      setLockoutRemainingSeconds(0);

      addAuditLog({
        event: 'LOGIN_SUCCESS',
        username: adminCredentials.username,
        details: 'Admin verified successfully via cryptographic SHA-256 HMAC verification.',
      });

      return { success: true };
    } else {
      const newFails = failedAttempts + 1;
      setFailedAttempts(newFails);

      if (newFails >= MAX_FAILED_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockoutTime);
        setLockoutRemainingSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));

        addAuditLog({
          event: 'LOCKOUT',
          username: username || 'unknown',
          details: `5 failed login attempts detected. Lockout triggered for 5 minutes.`,
        });

        return {
          success: false,
          error: `Too many failed attempts. Security lockdown active for 5 minutes to prevent unauthorized access.`,
        };
      } else {
        const remaining = MAX_FAILED_ATTEMPTS - newFails;
        addAuditLog({
          event: 'LOGIN_FAILED',
          username: username || 'unknown',
          details: `Failed credentials check. ${remaining} attempt(s) remaining before security lockdown.`,
        });

        return {
          success: false,
          error: `Invalid credentials. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`,
        };
      }
    }
  };

  const logoutAdmin = () => {
    if (adminSession) {
      addAuditLog({
        event: 'LOGOUT',
        username: adminSession.username,
        details: 'Admin session terminated securely by user.',
      });
    }
    setAdminSession(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    setOrders([]); // Wipe orders cache from memory on logout to prevent guest access
    setActiveView('home');
  };

  const changeAdminCredentials = async (
    currentPass: string,
    newPass: string,
    newUsername?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const isCurrentValid = await verifyPassword(
      currentPass,
      adminCredentials.passwordHash,
      adminCredentials.salt
    );

    if (!isCurrentValid) {
      return { success: false, error: 'Current password verification failed.' };
    }

    const strengthCheck = validatePasswordStrength(newPass);
    if (!strengthCheck.valid) {
      return { success: false, error: strengthCheck.errors[0] };
    }

    const newHash = await hashPassword(newPass, adminCredentials.salt);
    const updatedUsername = newUsername ? sanitizeInput(newUsername) : adminCredentials.username;

    setAdminCredentials({
      username: updatedUsername,
      passwordHash: newHash,
      salt: adminCredentials.salt,
      lastChanged: new Date().toISOString(),
    });

    // Invalidate active session and orders in memory - admin must authenticate with new password
    setAdminSession(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    setOrders([]);

    addAuditLog({
      event: 'PASSWORD_CHANGED',
      username: updatedUsername,
      details: 'Administrator credentials updated securely. Active sessions revoked.',
    });

    return { success: true };
  };

  const clearAuditLogs = () => {
    setSecurityAuditLogs([]);
    const client = getSupabaseClient();
    if (client) {
      client.from('security_audit_logs').delete().neq('id', '').then();
    }
  };

  // Calculations (Delivery charge is location-based and notified via WhatsApp after packing)
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isShippingFree = false;
  const shippingRemaining = 0;
  const calculatedDeliveryCharge = 0;

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
      prevCart.filter(
        (item) => !(item.productId === productId && item.variantName === variantName)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Handlers
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
    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const sanitizedName = sanitizeInput(customerInfo.customerName || '').slice(0, 100);
    const sanitizedPhone = (customerInfo.phone || '').replace(/[^0-9+]/g, '').slice(0, 15);
    const sanitizedEmail = customerInfo.email ? sanitizeInput(customerInfo.email).slice(0, 100) : '';
    const sanitizedAddress = sanitizeInput(customerInfo.address || '').slice(0, 300);
    const sanitizedCity = sanitizeInput(customerInfo.city || '').slice(0, 100);
    const sanitizedDistrict = sanitizeInput(customerInfo.district || '').slice(0, 100);
    const sanitizedState = sanitizeInput(customerInfo.state || '').slice(0, 100);
    const sanitizedPincode = (customerInfo.pincode || '').replace(/[^0-9]/g, '').slice(0, 10);
    const sanitizedInstructions = customerInfo.deliveryInstructions
      ? sanitizeInput(customerInfo.deliveryInstructions).slice(0, 300)
      : undefined;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: sanitizedName,
      phone: sanitizedPhone,
      email: sanitizedEmail,
      address: sanitizedAddress,
      city: sanitizedCity,
      district: sanitizedDistrict,
      state: sanitizedState,
      pincode: sanitizedPincode,
      deliveryInstructions: sanitizedInstructions,
      subtotal: Math.max(0, cartSubtotal),
      deliveryCharge: Math.max(0, calculatedDeliveryCharge),
      totalAmount: Math.max(0, cartSubtotal + calculatedDeliveryCharge),
      paymentStatus: 'pending',
      orderStatus: 'new',
      items: cart.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        orderId: `ord-${Date.now()}`,
        productId: item.productId,
        productName: sanitizeInput(item.productName),
        variantName: sanitizeInput(item.variantName),
        quantity: Math.max(1, Math.min(item.quantity, 99)),
        unitPrice: Math.max(0, item.unitPrice),
        totalPrice: Math.max(0, item.unitPrice * item.quantity),
        imageUrl: sanitizeUrl(item.imageUrl),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderForPayment(newOrder);
    setActiveView('payment');

    // Deduct stock locally
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((c) => c.productId === prod.id);
      if (cartItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartItem.quantity),
          updatedAt: new Date().toISOString(),
        };
      }
      return prod;
    });
    setProducts(updatedProducts);

    // Sync to Supabase
    const client = getSupabaseClient();
    if (client) {
      client.from('orders').insert(mapOrderToSupabase(newOrder)).then();
      // Update stock for purchased products in Supabase
      cart.forEach((cartItem) => {
        const prod = products.find((p) => p.id === cartItem.productId);
        if (prod) {
          const newStock = Math.max(0, prod.stock - cartItem.quantity);
          client.from('products').update({ stock: newStock }).eq('id', prod.id).then();
        }
      });
    }

    clearCart();
    return newOrder;
  };

  const submitPaymentScreenshot = (orderId: string, screenshotUrl: string) => {
    const proof = screenshotUrl || 'WhatsApp Submitted';
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            paymentScreenshotUrl: proof,
            paymentStatus: 'submitted' as PaymentStatus,
            updatedAt: new Date().toISOString(),
          };
          setActiveOrderForPayment(updated);
          return updated;
        }
        return order;
      })
    );

    const client = getSupabaseClient();
    if (client) {
      client
        .from('orders')
        .update({
          payment_screenshot_url: proof,
          payment_status: 'submitted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .then();
    }

    setActiveView('order-confirmation');
  };


  const updateOrderPaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            paymentStatus: status,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    const client = getSupabaseClient();
    if (client) {
      client
        .from('orders')
        .update({
          payment_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .then();
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: status,
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    const client = getSupabaseClient();
    if (client) {
      client
        .from('orders')
        .update({
          order_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .then();
    }
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

    const client = getSupabaseClient();
    if (client) {
      client.from('products').insert(mapProductToSupabase(newProduct)).then();
    }
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    let updatedProduct: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          updatedProduct = { ...p, ...updates, updatedAt: new Date().toISOString() };
          return updatedProduct;
        }
        return p;
      })
    );

    const client = getSupabaseClient();
    if (client && updatedProduct) {
      client.from('products').update(mapProductToSupabase(updatedProduct)).eq('id', productId).then();
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    const client = getSupabaseClient();
    if (client) {
      client.from('products').delete().eq('id', productId).then();
    }
  };

  // Category CRUD
  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);

    const client = getSupabaseClient();
    if (client) {
      client.from('categories').insert(mapCategoryToSupabase(newCategory)).then();
    }
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    let updatedCategory: Category | undefined;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          updatedCategory = { ...c, ...updates, updatedAt: new Date().toISOString() };
          return updatedCategory;
        }
        return c;
      })
    );

    const client = getSupabaseClient();
    if (client && updatedCategory) {
      client.from('categories').update(mapCategoryToSupabase(updatedCategory)).eq('id', categoryId).then();
    }
  };

  const deleteCategory = (categoryId: string): { success: boolean; error?: string } => {
    const associatedProducts = products.filter((p) => p.categoryId === categoryId);
    if (associatedProducts.length > 0) {
      return {
        success: false,
        error: `Cannot delete category. There are ${associatedProducts.length} product(s) assigned to it.`,
      };
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));

    const client = getSupabaseClient();
    if (client) {
      client.from('categories').delete().eq('id', categoryId).then();
    }
    return { success: true };
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    const client = getSupabaseClient();
    if (client) {
      client.from('business_settings').upsert(mapSettingsToSupabase(updated)).then();
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setAdminCredentials(INITIAL_ADMIN_CREDENTIALS);
    setFailedAttempts(0);
    setLockoutUntil(0);
    setLockoutRemainingSeconds(0);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_CREDS);
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT);
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
        isAdminAuthenticated,
        adminSession,
        securityAuditLogs,
        failedAttempts,
        isLockedOut,
        lockoutRemainingSeconds,
        loginAdmin,
        logoutAdmin,
        changeAdminCredentials,
        clearAuditLogs,
        isSupabaseEnabled: isSupabaseConfigured(),
        supabaseStatus,
        supabaseMessage,
        supabaseConfig,
        syncWithSupabase,
        pushLocalDataToSupabase,
        updateSupabaseCredentials,
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
