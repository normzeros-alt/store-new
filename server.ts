import express from 'express';
import path from 'path';
import { gzipSync } from 'node:zlib';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByPhone,
  updateOrderStatus,
  deleteOrder,
  deleteFinishedOrders,
  getStats,
  getStoreSettings,
  updateStoreSettings,
  getAllWilayas,
  updateWilayaPrice,
  bulkUpdateWilayas,
  getAllCategories,
  createCategory,
  renameCategory,
  deleteCategory
} from './server/db.ts';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = 'demo360';
const productResponseCache = new Map<string, { expires: number; data: unknown }>();
const clearProductCache = () => productResponseCache.clear();
const ADMIN_TOKEN = 'demo360_session_authorized';

// Middlewares
app.use(express.json({ limit: '25mb' }));
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    const acceptsGzip = String(req.headers['accept-encoding'] || '').includes('gzip');
    if (!acceptsGzip) return originalJson(body);
    const payload = gzipSync(Buffer.from(JSON.stringify(body)));
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Vary', 'Accept-Encoding');
    return res.end(payload);
  }) as typeof res.json;
  next();
});

process.on('uncaughtException', (error) => console.error('[server] uncaught exception', error));
process.on('unhandledRejection', (error) => console.error('[server] unhandled rejection', error));

// Helper: Admin authentication middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: 'غير مصرح بالوصول: يتطلب تسجيل الدخول كمسؤول' });
  }
  next();
}

// ==========================================
// Public API Endpoints
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Store Settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = getStoreSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب الإعدادات' });
  }
});

// Categories
app.get('/api/categories', (req, res) => {
  try { res.json(getAllCategories()); }
  catch (err: any) { res.status(500).json({ error: err.message || 'خطأ في جلب التصنيفات' }); }
});

// Wilayas List (Public for checkout delivery selection)
app.get('/api/wilayas', (req, res) => {
  try {
    const wilayas = getAllWilayas();
    res.json(wilayas);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب قائمة الولايات' });
  }
});

// Products List
app.get('/api/products', (req, res) => {
  try {
    const { category, search, sort } = req.query as { category?: string; search?: string; sort?: string };
    const cacheKey = JSON.stringify({ category: category || '', search: search || '', sort: sort || '' });
    const cached = productResponseCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return res.json(cached.data);
    const products = getAllProducts({ category, search, sort }, false);
    productResponseCache.set(cacheKey, { expires: Date.now() + 5000, data: products });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب المنتجات' });
  }
});

// Product Details
app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'معرف المنتج غير صالح' });
    }
    const product = getProductById(id) as any;
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }

    // Include similar products from same category
    const similar = getAllProducts({ category: product.category }, false)
      .filter((p: any) => p.id !== product.id)
      .slice(0, 4);

    res.json({ ...product, similar });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب تفاصيل المنتج' });
  }
});

// Create Order (Checkout - Cash on Delivery COD)
app.post('/api/orders', (req, res) => {
  try {
    const { customer, items } = req.body;
    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.wilaya_code) {
      return res.status(400).json({ error: 'الرجاء إدخال بيانات العميل كاملة (الاسم، رقم الهاتف، الولاية، العنوان)' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'سلة المشتريات فارغة' });
    }

    const order = createOrder({ customer, items });
    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'تعذر إتمام الطلب' });
  }
});

// Track Order by Phone Number
app.get('/api/track', (req, res) => {
  try {
    const phone = req.query.phone as string;
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ error: 'يرجى إدخال رقم هاتف صحيح للبحث عن طلباتك' });
    }
    const orders = getOrdersByPhone(phone);
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ أثناء البحث عن الطلبات' });
  }
});

// ==========================================
// Admin API Endpoints
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || String(password).trim() !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
  }
  res.json({
    success: true,
    token: ADMIN_TOKEN,
    message: 'تم تسجيل الدخول بنجاح'
  });
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب الإحصائيات' });
  }
});

// Admin Orders List
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب الطلبات' });
  }
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const valid = ['جديد', 'قيد التجهيز', 'تم الشحن', 'مكتمل', 'ملغي'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'حالة الطلب غير صالحة' });
    }
    const order = updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في تحديث حالة الطلب' });
  }
});

// Admin Delete Specific Order
app.delete('/api/admin/orders/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ok = deleteOrder(id);
    if (!ok) {
      return res.status(404).json({ error: 'الطلب غير موجود أو تم حذفه مسبقاً' });
    }
    res.json({ success: true, message: 'تم حذف الطلب بنجاح' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في حذف الطلب' });
  }
});

// Admin Delete All Finished Orders (مكتمل / ملغي)
app.post('/api/admin/orders/delete-finished', requireAdmin, (req, res) => {
  try {
    const count = deleteFinishedOrders();
    res.json({ success: true, count, message: `تم حذف ${count} طلب منتهي بنجاح` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في حذف الطلبات المنتهية' });
  }
});

// Admin Wilayas Management
app.get('/api/admin/wilayas', requireAdmin, (req, res) => {
  try {
    const wilayas = getAllWilayas();
    res.json(wilayas);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في جلب الولايات' });
  }
});

app.put('/api/admin/wilayas/:code', requireAdmin, (req, res) => {
  try {
    const code = parseInt(req.params.code, 10);
    const { home_price, office_price, is_active } = req.body;
    const updated = updateWilayaPrice(code, home_price, office_price, is_active);
    res.json({ success: true, wilaya: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في تحديث سعر الولاية' });
  }
});

app.put('/api/admin/wilayas-bulk', requireAdmin, (req, res) => {
  try {
    const { wilayas } = req.body;
    if (!Array.isArray(wilayas)) {
      return res.status(400).json({ error: 'بيانات الولايات غير صالحة' });
    }
    const result = bulkUpdateWilayas(wilayas);
    res.json({ success: true, wilayas: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في الحفظ الجماعي لأسعار الولايات' });
  }
});

// Admin Categories
app.post('/api/admin/categories', requireAdmin, (req, res) => {
  try {
    const category = createCategory(req.body?.name);
    res.status(201).json({ success: true, category });
  } catch (err: any) { res.status(400).json({ error: err.message || 'خطأ في إضافة التصنيف' }); }
});

app.patch('/api/admin/categories/:name', requireAdmin, (req, res) => {
  try {
    const category = renameCategory(decodeURIComponent(req.params.name), req.body?.name);
    res.json({ success: true, category });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'خطأ في تعديل التصنيف' });
  }
});

app.delete('/api/admin/categories/:name', requireAdmin, (req, res) => {
  try {
    const deleted = deleteCategory(decodeURIComponent(req.params.name));
    res.json({ success: deleted, message: deleted ? 'تم حذف التصنيف' : 'التصنيف غير موجود' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'خطأ في حذف التصنيف' });
  }
});

// Admin Add Product (supports image data URLs)
app.post('/api/admin/products', requireAdmin, (req, res) => {
  try {
    const { name, price, description, category, images, image, badge, discountPrice, discountEnabled, discountStart, discountEnd } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'اسم المنتج وسعره مطلوبان' });
    }
    const finalCategory = String(category || 'الكؤوس').trim() || 'الكؤوس';
    let finalImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      finalImages = images.filter((value: unknown) => typeof value === 'string' && (value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://'))).slice(0, 6);
    } else if (typeof image === 'string' && image) {
      finalImages = [image];
    }

    const product = createProduct({
      name,
      price: Number(price),
      description: description || '',
      category: finalCategory,
      images: finalImages,
      badge: badge || '',
      discountPrice: Number(discountPrice || 0),
      discountEnabled: Boolean(discountEnabled),
      discountStart: discountStart || '',
      discountEnd: discountEnd || ''
    });
    clearProductCache();
    res.status(201).json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في إضافة المنتج' });
  }
});

// Admin Update Product
app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = updateProduct(id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }
    clearProductCache();
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في تحديث المنتج' });
  }
});

// Admin Delete Product
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ok = deleteProduct(id);
    if (!ok) {
      return res.status(404).json({ error: 'المنتج غير موجود أو تم حذفه مسبقاً' });
    }
    clearProductCache();
    res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في حذف المنتج' });
  }
});

// Admin Reset Products (Wipe and recreate fresh catalog)
app.post('/api/admin/products/reset', requireAdmin, (req, res) => {
  try {
    const products = resetProducts();
    res.json({ success: true, products, message: 'تم مسح وإعادة إنشاء قائمة المنتجات بنجاح' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في إعادة تعيين المنتجات' });
  }
});

// Admin Update Store Settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updated = updateStoreSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'خطأ في حفظ الإعدادات' });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[server] request error', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ success: false, error: 'حدث خطأ داخلي في الخادم' });
});

// ==========================================
// Vite Middleware / Static Serving
// ==========================================

export async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

export { app };

if (process.env.NETLIFY !== 'true') {
  start();
}
