import { Product, Order, CustomerData, StoreSettings, AdminStats, Wilaya } from '../types';

export function request<T>(endpoint: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const method = (options.method || 'GET').toUpperCase();
    xhr.open(method, endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    if (options.headers) {
      for (const [key, val] of Object.entries(options.headers)) {
        xhr.setRequestHeader(key, val);
      }
    }

    xhr.timeout = 15000;
    xhr.ontimeout = () => reject(new Error('انتهت مهلة استجابة الخادم'));
    xhr.onerror = () => reject(new Error('تعذر الاتصال بالخادم، يرجى التحقق من الشبكة'));

    xhr.onload = () => {
      const status = xhr.status;
      const contentType = xhr.getResponseHeader('content-type') || '';
      const text = xhr.responseText;

      if (contentType.includes('application/json')) {
        try {
          const data = JSON.parse(text);
          if (status >= 200 && status < 300) {
            resolve(data as T);
          } else {
            reject(new Error(data.error || `خطأ في الطلب: ${status}`));
          }
        } catch {
          if (status >= 200 && status < 300) {
            resolve(text as unknown as T);
          } else {
            reject(new Error(`خطأ في معالجة البيانات (${status})`));
          }
        }
      } else {
        if (status >= 200 && status < 300) {
          resolve(text as unknown as T);
        } else {
          reject(new Error(`خطأ في استجابة الخادم (${status})`));
        }
      }
    };

    try {
      if (options.body) {
        xhr.send(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      } else {
        xhr.send();
      }
    } catch (e: any) {
      reject(e);
    }
  });
}

export const api = {
  getProducts: (params?: { category?: string; search?: string; sort?: string }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.sort) q.set('sort', params.sort);
    const qs = q.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  getProduct: (id: number) => {
    return request<Product & { similar?: Product[] }>(`/api/products/${id}`);
  },

  getSettings: () => {
    return request<StoreSettings>('/api/settings');
  },

  getWilayas: () => {
    return request<Wilaya[]>('/api/wilayas');
  },

  createOrder: (customer: CustomerData, items: { productId: number; quantity: number }[]) => {
    return request<{ success: boolean; order: Order }>('/api/orders', {
      method: 'POST',
      body: { customer, items }
    });
  },

  trackOrders: (phone: string) => {
    return request<{ success: boolean; orders: Order[] }>(`/api/track?phone=${encodeURIComponent(phone)}`);
  },

  adminLogin: (password: string) => {
    return request<{ success: boolean; token: string; message: string }>('/api/admin/login', {
      method: 'POST',
      body: { password }
    });
  },

  getAdminStats: (token: string) => {
    return request<AdminStats>('/api/admin/stats', {
      headers: { 'x-admin-token': token }
    });
  },

  getAdminOrders: (token: string) => {
    return request<Order[]>('/api/admin/orders', {
      headers: { 'x-admin-token': token }
    });
  },

  updateOrderStatus: (orderId: number, status: string, token: string) => {
    return request<{ success: boolean; order: Order }>(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'x-admin-token': token },
      body: { status }
    });
  },

  getAdminWilayas: (token: string) => {
    return request<Wilaya[]>('/api/admin/wilayas', {
      headers: { 'x-admin-token': token }
    });
  },

  updateWilaya: (code: number, data: { home_price: number; office_price: number; is_active?: boolean | number }, token: string) => {
    return request<{ success: boolean; wilaya: Wilaya }>(`/api/admin/wilayas/${code}`, {
      method: 'PUT',
      headers: { 'x-admin-token': token },
      body: data
    });
  },

  bulkUpdateWilayas: (wilayas: Array<{ code: number; home_price: number; office_price: number; is_active?: number }>, token: string) => {
    return request<{ success: boolean; wilayas: Wilaya[] }>('/api/admin/wilayas-bulk', {
      method: 'PUT',
      headers: { 'x-admin-token': token },
      body: { wilayas }
    });
  },

  createProduct: (data: Partial<Product>, token: string) => {
    return request<{ success: boolean; product: Product }>('/api/admin/products', {
      method: 'POST',
      headers: { 'x-admin-token': token },
      body: data
    });
  },

  updateProduct: (id: number, data: Partial<Product>, token: string) => {
    return request<{ success: boolean; product: Product }>(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'x-admin-token': token },
      body: data
    });
  },

  deleteProduct: (id: number, token: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    });
  },

  resetProducts: (token: string) => {
    return request<{ success: boolean; products: Product[]; message: string }>('/api/admin/products/reset', {
      method: 'POST',
      headers: { 'x-admin-token': token }
    });
  },

  deleteOrder: (id: number, token: string) => {
    return request<{ success: boolean; message: string }>(`/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    });
  },

  deleteFinishedOrders: (token: string) => {
    return request<{ success: boolean; count: number; message: string }>('/api/admin/orders/delete-finished', {
      method: 'POST',
      headers: { 'x-admin-token': token }
    });
  },

  updateSettings: (settings: Partial<StoreSettings>, token: string) => {
    return request<{ success: boolean; settings: StoreSettings }>('/api/admin/settings', {
      method: 'PUT',
      headers: { 'x-admin-token': token },
      body: settings
    });
  }
};
