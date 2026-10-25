import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, Order, BusinessSettings, SecurityAuditLog } from '../types';

// Environment variables or localStorage override for dynamic Admin UI config
const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const STORAGE_KEY_SUPABASE_URL = 'akia_supabase_url_v1';
const STORAGE_KEY_SUPABASE_ANON_KEY = 'akia_supabase_anon_key_v1';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  try {
    const url = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || ENV_SUPABASE_URL;
    const anonKey = localStorage.getItem(STORAGE_KEY_SUPABASE_ANON_KEY) || ENV_SUPABASE_ANON_KEY;
    return { url: url.trim(), anonKey: anonKey.trim() };
  } catch {
    return { url: ENV_SUPABASE_URL, anonKey: ENV_SUPABASE_ANON_KEY };
  }
}

export function saveStoredSupabaseConfig(url: string, anonKey: string): void {
  try {
    if (url) localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_SUPABASE_ANON_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_SUPABASE_ANON_KEY);

    // Reset cached client
    cachedClient = null;
  } catch (e) {
    console.error('Failed to save Supabase config in localStorage', e);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig: { url: string; anonKey: string } | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (
    cachedClient &&
    lastUsedConfig &&
    lastUsedConfig.url === config.url &&
    lastUsedConfig.anonKey === config.anonKey
  ) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    lastUsedConfig = config;
    return cachedClient;
  } catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const config = getStoredSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing. Please configure them in your .env or Admin Settings.',
    };
  }

  try {
    const { error } = await client.from('categories').select('id').limit(1);
    if (error) {
      console.error('Supabase query error:', error);
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but the "categories" table does not exist yet. Please run the supabase_schema.sql script.',
        };
      }
      return {
        success: false,
        message: 'Database query failed. Please verify table permissions in Supabase.',
      };
    }
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    console.error('Supabase connection error:', err);
    return { success: false, message: 'Connection to Supabase failed. Please check network connectivity and credentials.' };
  }
}

// -------------------------------------------------------------
// Mapping Helpers (Snake_case Supabase Table Rows <-> CamelCase TypeScript)
// -------------------------------------------------------------

export function mapCategoryFromSupabase(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    imageUrl: row.image_url || '',
    isActive: row.is_active ?? true,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapCategoryToSupabase(cat: Category): any {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    image_url: cat.imageUrl,
    is_active: cat.isActive,
    display_order: cat.displayOrder,
    created_at: cat.createdAt,
    updated_at: cat.updatedAt,
  };
}

export function mapProductFromSupabase(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
    categoryName: row.category_name,
    description: row.description || '',
    price: Number(row.price),
    marketRate: row.market_rate ? Number(row.market_rate) : undefined,
    weight: row.weight || '100g',
    stock: Number(row.stock ?? 0),
    isActive: row.is_active ?? true,
    imageUrl: row.image_url || '',
    badge: row.badge || undefined,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count ? Number(row.review_count) : 0,
    inci: row.inci || '',
    directions: row.directions || '',
    variants: row.variants || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapProductToSupabase(prod: Product): any {
  return {
    id: prod.id,
    name: prod.name,
    category_id: prod.categoryId,
    category_name: prod.categoryName,
    description: prod.description,
    price: prod.price,
    market_rate: prod.marketRate,
    weight: prod.weight,
    stock: prod.stock,
    is_active: prod.isActive,
    image_url: prod.imageUrl,
    badge: prod.badge,
    rating: prod.rating,
    review_count: prod.reviewCount,
    inci: prod.inci,
    directions: prod.directions,
    variants: prod.variants || [],
    created_at: prod.createdAt,
    updated_at: prod.updatedAt,
  };
}

export function mapOrderFromSupabase(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email || '',
    address: row.address,
    city: row.city,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    deliveryInstructions: row.delivery_instructions,
    subtotal: Number(row.subtotal),
    deliveryCharge: Number(row.delivery_charge),
    totalAmount: Number(row.total_amount),
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    paymentScreenshotUrl: row.payment_screenshot_url,
    items: row.items || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapOrderToSupabase(order: Order): any {
  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_name: order.customerName,
    phone: order.phone,
    email: order.email,
    address: order.address,
    city: order.city,
    district: order.district,
    state: order.state,
    pincode: order.pincode,
    delivery_instructions: order.deliveryInstructions,
    subtotal: order.subtotal,
    delivery_charge: order.deliveryCharge,
    total_amount: order.totalAmount,
    payment_status: order.paymentStatus,
    order_status: order.orderStatus,
    payment_screenshot_url: order.paymentScreenshotUrl,
    items: order.items,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

export function mapSettingsFromSupabase(row: any): BusinessSettings {
  return {
    businessName: row.business_name,
    businessPhone: row.business_phone,
    whatsappNumber: row.whatsapp_number,
    upiId: row.upi_id,
    upiMerchantName: row.upi_merchant_name,
    businessAddress: row.business_address,
    deliveryCharge: Number(row.delivery_charge),
    freeShippingThreshold: Number(row.free_shipping_threshold),
  };
}

export function mapSettingsToSupabase(settings: BusinessSettings): any {
  return {
    id: 'default',
    business_name: settings.businessName,
    business_phone: settings.businessPhone,
    whatsapp_number: settings.whatsappNumber,
    upi_id: settings.upiId,
    upi_merchant_name: settings.upiMerchantName,
    business_address: settings.businessAddress,
    delivery_charge: settings.deliveryCharge,
    free_shipping_threshold: settings.freeShippingThreshold,
    updated_at: new Date().toISOString(),
  };
}

export function mapAuditLogFromSupabase(row: any): SecurityAuditLog {
  return {
    id: row.id,
    timestamp: row.timestamp || row.created_at,
    event: row.event,
    username: row.username,
    ipOrDevice: row.ip_or_device,
    details: row.details,
  };
}

export function mapAuditLogToSupabase(log: SecurityAuditLog): any {
  return {
    id: log.id,
    timestamp: log.timestamp,
    event: log.event,
    username: log.username,
    ip_or_device: log.ipOrDevice || '',
    details: log.details,
  };
}

// -------------------------------------------------------------
// Supabase Storage: Product & Category Image Upload
// -------------------------------------------------------------

export async function uploadImageToSupabase(
  file: File,
  folder: 'products' | 'categories' | 'general' = 'products'
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase is not configured. Please enter your Supabase URL & Anon Key in the "Supabase Cloud" tab.',
    };
  }

  // Strict MIME type & extension whitelist (blocking SVG, HTML, and executables)
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_MIME_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(fileExt)) {
    return {
      success: false,
      error: 'Security restriction: Only raster images (JPEG, PNG, WebP, GIF, AVIF) are permitted. SVG and non-image files are blocked to prevent XSS.',
    };
  }

  // 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: 'File size exceeds 10MB limit. Please choose a smaller image.' };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);
    const uniquePath = `${folder}/${Date.now()}_${cleanBase}.${fileExt}`;
    const bucketName = 'product-images';

    let uploadRes = await client.storage
      .from(bucketName)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    // If bucket doesn't exist, try creating it automatically on the fly
    if (
      uploadRes.error &&
      (uploadRes.error.message.toLowerCase().includes('bucket not found') ||
       uploadRes.error.message.toLowerCase().includes('not found'))
    ) {
      try {
        await client.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760,
        });

        // Retry upload after bucket creation attempt
        uploadRes = await client.storage
          .from(bucketName)
          .upload(uniquePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type,
          });
      } catch {
        // Fall through to standard error handling
      }
    }

    if (uploadRes.error) {
      if (
        uploadRes.error.message.toLowerCase().includes('bucket not found') ||
        uploadRes.error.message.toLowerCase().includes('not found')
      ) {
        return {
          success: false,
          error: `Storage bucket "${bucketName}" does not exist in your Supabase project. In Supabase Dashboard -> Storage -> Click "New Bucket" -> Name it "${bucketName}" and toggle "Public bucket" ON.`,
        };
      }
      return { success: false, error: uploadRes.error.message };
    }

    const { data: publicUrlData } = client.storage
      .from(bucketName)
      .getPublicUrl(uniquePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return { success: false, error: 'Could not generate public URL for uploaded image.' };
    }

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error('Storage upload error:', err);
    return {
      success: false,
      error: 'Unexpected error occurred during image upload. Please verify the image file format and size.',
    };
  }
}

export async function createStorageBucketIfMissing(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase credentials not configured.' };
  }
  try {
    const { error } = await client.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 10485760,
    });
    if (error) {
      console.error('Storage bucket create error:', error);
      return { success: false, message: 'Failed to create storage bucket. Please check permissions.' };
    }
    return { success: true, message: 'Bucket "product-images" created successfully!' };
  } catch (err: any) {
    console.error('Bucket creation error:', err);
    return { success: false, message: 'Unable to initialize storage bucket.' };
  }
}

export async function testSupabaseStorage(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase credentials not configured.' };
  }
  try {
    const { data, error } = await client.storage.getBucket('product-images');
    if (error) {
      console.error('Storage bucket lookup error:', error);
      return {
        success: false,
        message: 'Bucket "product-images" is not accessible. Please check storage setup in Supabase.',
      };
    }
    return {
      success: true,
      message: `Storage bucket 'product-images' is ready! Public access: ${data.public ? 'YES (Active)' : 'NO (Private - please make public)'}`,
    };
  } catch (err: any) {
    console.error('Storage check error:', err);
    return { success: false, message: 'Storage verification encountered an unexpected error.' };
  }
}

