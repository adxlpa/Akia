export type PaymentStatus = 'pending' | 'submitted' | 'verified' | 'failed';
export type OrderStatus = 'new' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  name: string;
  price: number;
  weight: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  marketRate?: number;
  weight: string;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  inci?: string;
  directions?: string;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentScreenshotUrl?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  businessName: string;
  businessPhone: string;
  whatsappNumber: string;
  upiId: string;
  upiMerchantName: string;
  businessAddress: string;
  deliveryCharge: number;
  freeShippingThreshold: number;
}
