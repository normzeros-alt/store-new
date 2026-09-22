export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  image?: string; // fallback
  rating?: number;
  reviews_count?: number;
  badge?: string;
  discountPrice?: number;
  discountEnabled?: boolean;
  discountStart?: string;
  discountEnd?: string;
  salePrice?: number;
  created_at?: string;
  similar?: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_notes?: string;
  wilaya_id?: number;
  wilaya_code?: number;
  wilaya_name?: string;
  delivery_type: 'home' | 'office'; // توصيل للمنزل أو للمكتب
  delivery_price: number;
  subtotal: number;
  total_amount: number;
  status: 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'مكتمل' | 'ملغي';
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  wilaya_code: number;
  delivery_type: 'home' | 'office';
}

export interface StoreSettings {
  primaryColor: string;
  currency: string;
  announcement?: string;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
}

export interface Wilaya {
  id: number;
  code: number;
  name_ar: string;
  name_en: string;
  home_price: number;
  office_price: number;
  is_active: number | boolean;
}
