import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { ALGERIA_WILAYAS } from '../src/data/wilayas.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'store.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for high performance and durability
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wilayas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code INTEGER UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    home_price REAL NOT NULL,
    office_price REAL NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    images TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    rating REAL DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 28,
    badge TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_notes TEXT,
    wilaya_code INTEGER,
    wilaya_name TEXT,
    delivery_type TEXT NOT NULL DEFAULT 'home',
    delivery_price REAL NOT NULL DEFAULT 0,
    subtotal REAL NOT NULL DEFAULT 0,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'جديد',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
  );
`);

// Migration helper: If products or orders table already existed with old schema, ensure columns exist
try {
  // Check if images column exists in products
  const pragmaProd = db.prepare('PRAGMA table_info(products)').all() as any[];
  const hasImages = pragmaProd.some(col => col.name === 'images');
  if (!hasImages) {
    db.exec('ALTER TABLE products ADD COLUMN images TEXT NOT NULL DEFAULT "[]";');
  }

  // Check orders table columns
  const pragmaOrders = db.prepare('PRAGMA table_info(orders)').all() as any[];
  const hasWilayaCode = pragmaOrders.some(col => col.name === 'wilaya_code');
  if (!hasWilayaCode) {
    db.exec('ALTER TABLE orders ADD COLUMN wilaya_code INTEGER;');
    db.exec('ALTER TABLE orders ADD COLUMN wilaya_name TEXT;');
    db.exec('ALTER TABLE orders ADD COLUMN delivery_type TEXT NOT NULL DEFAULT "home";');
    db.exec('ALTER TABLE orders ADD COLUMN delivery_price REAL NOT NULL DEFAULT 0;');
    db.exec('ALTER TABLE orders ADD COLUMN subtotal REAL NOT NULL DEFAULT 0;');
  }
} catch (e) {
  console.log('Migration check info:', e);
}

// Seed default settings if not exists
const getSettingStmt = db.prepare('SELECT value FROM settings WHERE key = ?');
const setSettingStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

// Force store name to glassglow as strictly required
setSettingStmt.run('store_name', 'glassglow');
if (!getSettingStmt.get('primary_color')) {
  setSettingStmt.run('primary_color', '#059669');
}
// Force currency to Algerian Dinar as strictly required
setSettingStmt.run('currency', 'د.ج');
if (!getSettingStmt.get('announcement')) {
  setSettingStmt.run('announcement', 'توصيل متوفر لجميع الولايات الـ 58 والدفع عند الاستلام!');
}
if (!getSettingStmt.get('free_shipping_enabled')) {
  setSettingStmt.run('free_shipping_enabled', '1');
}
if (!getSettingStmt.get('free_shipping_threshold')) {
  setSettingStmt.run('free_shipping_threshold', '5000');
}

// Seed Wilayas if table is empty
const countWilayasStmt = db.prepare('SELECT COUNT(*) as count FROM wilayas');
const wilayaCount = (countWilayasStmt.get() as { count: number }).count;

if (wilayaCount === 0) {
  const insertWilaya = db.prepare(`
    INSERT INTO wilayas (code, name_ar, name_en, home_price, office_price, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  for (const w of ALGERIA_WILAYAS) {
    insertWilaya.run(w.code, w.name_ar, w.name_en, w.home_price, w.office_price);
  }
}

// Seed fresh products (Restricted strictly to 'الكؤوس' and 'البوكسات')
export const FRESH_PRODUCTS = [
  {
    name: 'كوب سيراميك يدوي فاخر بتصميم رخامي',
    price: 1800,
    description: 'كوب سيراميك مصنوع يدوياً بجودة عالية مع طلاء رخامي حراري أنيق ومقاوم لغسالات الأطباق والميكروويف، سعة 350 مل مثالي للقهوة الصباحية والشاي.',
    category: 'الكؤوس',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80'
    ]),
    stock: 25,
    rating: 4.9,
    reviews_count: 42,
    badge: 'الأكثر مبيعاً'
  },
  {
    name: 'كوب حراري مزدوج الجدار حافظ للحرارة والبرودة',
    price: 2400,
    description: 'كوب حراري من الفولاذ المقاوم للصدأ 304 مع غطاء مانع للتسرب يحفظ حرارة المشروبات حتى 8 ساعات وبرودتها حتى 12 ساعة، سعة 450 مل.',
    category: 'الكؤوس',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'
    ]),
    stock: 18,
    rating: 4.8,
    reviews_count: 36,
    badge: 'جديد'
  },
  {
    name: 'كوب زجاجي بروسيليكات مزدوج شفاف للقهوة المختصة',
    price: 1500,
    description: 'كوب زجاجي أنيق عازل للحرارة لا يحرق اليدين ومقاوم للصدمات الحرارية، سعة 300 مل لإبراز جمال طبقات اللاتيه والكابتشينو.',
    category: 'الكؤوس',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80'
    ]),
    stock: 30,
    rating: 4.9,
    reviews_count: 51,
    badge: ''
  },
  {
    name: 'كوب فخاري مات بتشطيب جبلي عتيق',
    price: 2100,
    description: 'كوب فخاري كلاسيكي بتشطيب جبلي رمادي غير لامع وملمس ترابي دافئ، متين ومريح في قبضة اليد مع عزل حراري طبيعي ممتاز.',
    category: 'الكؤوس',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80'
    ]),
    stock: 20,
    rating: 4.8,
    reviews_count: 27,
    badge: 'إصدار محدود'
  },
  {
    name: 'بوكس الذواقة الملكي (مجموعة 4 أكواب فخارية مع قاعدة خشبية)',
    price: 5200,
    description: 'بوكس هدايا فاخر يحتوي على تشكيلة من 4 أكواب قهوة فخارية يدوية الصنع بألوان متناغمة مع قواعد خيزران طبيعية وملعقة خشبية محفورة، مغلفة في صندوق هدايا مقوى ومبطن.',
    category: 'البوكسات',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80'
    ]),
    stock: 12,
    rating: 5.0,
    reviews_count: 64,
    badge: 'الأكثر طلباً'
  },
  {
    name: 'بوكس الأزواج الفاخر (كوبين سيراميك بتصميم رخامي أسود وأبيض)',
    price: 3800,
    description: 'بوكس أنيق مخصص كهدية للأزواج أو الأصدقاء، يضم كوبين من السيراميك المطفي مع أغطية خشبية محكمة وحلقات ذهبية فاخرة وصندوق هدايا مزين بشريط ساتان.',
    category: 'البوكسات',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'
    ]),
    stock: 15,
    rating: 4.9,
    reviews_count: 48,
    badge: 'هدية راقية'
  },
  {
    name: 'بوكس أكواب الإسبريسو الإيطالية (طقم 6 فناجين مع أطباقها)',
    price: 4600,
    description: 'مجموعة متكاملة من 6 فناجين إسبريسو بتصاميم مستوحاة من المقاهي الإيطالية العريقة مع أطباق سيراميك مطابقة وحامل معدني أنيق لتزيين ركن القهوة.',
    category: 'البوكسات',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'
    ]),
    stock: 10,
    rating: 4.8,
    reviews_count: 29,
    badge: 'طقم متكامل'
  },
  {
    name: 'بوكس السفر المتكامل (كوبين حراريين مع حافظة أنيقة)',
    price: 6400,
    description: 'بوكس هدايا استثنائي لعشاق الرحلات والتنقل، يتضمن كوبين حراريين فائقين العزل مع أغطية شفافة محكمة وصندوق هدايا مبطن فاخر.',
    category: 'البوكسات',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80'
    ]),
    stock: 8,
    rating: 4.9,
    reviews_count: 19,
    badge: 'جديد'
  }
];

export function resetProducts() {
  db.exec('BEGIN TRANSACTION;');
  try {
    db.prepare('DELETE FROM products').run();
    const insertProduct = db.prepare(`
      INSERT INTO products (name, price, description, category, images, stock, rating, reviews_count, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of FRESH_PRODUCTS) {
      insertProduct.run(
        p.name,
        p.price,
        p.description,
        p.category,
        p.images,
        p.stock,
        p.rating,
        p.reviews_count,
        p.badge
      );
    }
    db.exec('COMMIT;');
    setSettingStmt.run('products_reset_v2', 'true');
    return getAllProducts();
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

// Automatically wipe and recreate products if v2 reset hasn't run yet
const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
const currentCount = (countStmt.get() as { count: number }).count;
const resetCheck = getSettingStmt.get('products_reset_v2');

if (currentCount === 0 || !resetCheck) {
  resetProducts();
}

// -------------------------------------------------------------
// Database Query Helper Functions
// -------------------------------------------------------------

function formatProductRow(row: any) {
  if (!row) return null;
  let parsedImages: string[] = [];
  try {
    if (row.images) {
      parsedImages = JSON.parse(row.images);
    } else if (row.image) {
      parsedImages = [row.image];
    }
  } catch {
    parsedImages = row.images ? [row.images] : [];
  }
  if (!Array.isArray(parsedImages)) parsedImages = [];
  const primaryImage = parsedImages[0] || row.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80';

  return {
    ...row,
    images: parsedImages.length > 0 ? parsedImages : [primaryImage],
    image: primaryImage
  };
}

export function getAllProducts(filter: { category?: string; search?: string; sort?: string } = {}) {
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (filter.category && filter.category !== 'ALL') {
    sql += ' AND category = ?';
    params.push(filter.category);
  }

  if (filter.search && filter.search.trim()) {
    sql += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
    const term = `%${filter.search.trim()}%`;
    params.push(term, term, term);
  }

  if (filter.sort === 'price-asc') {
    sql += ' ORDER BY price ASC';
  } else if (filter.sort === 'price-desc') {
    sql += ' ORDER BY price DESC';
  } else if (filter.sort === 'name-asc') {
    sql += ' ORDER BY name ASC';
  } else if (filter.sort === 'rating') {
    sql += ' ORDER BY rating DESC';
  } else {
    sql += ' ORDER BY id DESC';
  }

  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as any[];
  return rows.map(formatProductRow);
}

export function getProductById(id: number) {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const row = stmt.get(id);
  return formatProductRow(row);
}

export function createProduct(data: {
  name: string;
  price: number;
  description: string;
  category: 'الكؤوس' | 'البوكسات';
  images: string[];
  stock: number;
  badge?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO products (name, price, description, category, images, stock, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const safeCategory = data.category === 'البوكسات' ? 'البوكسات' : 'الكؤوس';
  const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images.filter(Boolean) : []);

  const res = stmt.run(
    data.name.trim(),
    Math.max(0, Number(data.price)),
    data.description.trim(),
    safeCategory,
    imagesJson,
    Math.max(0, parseInt(String(data.stock), 10)),
    (data.badge || '').trim()
  );
  return getProductById(Number(res.lastInsertRowid));
}

export function updateProduct(id: number, data: Partial<{
  name: string;
  price: number;
  description: string;
  category: 'الكؤوس' | 'البوكسات';
  images: string[];
  stock: number;
  badge: string;
}>) {
  const existing = getProductById(id);
  if (!existing) return null;

  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const price = data.price !== undefined ? Math.max(0, Number(data.price)) : existing.price;
  const description = data.description !== undefined ? data.description.trim() : existing.description;
  const category = data.category !== undefined ? (data.category === 'البوكسات' ? 'البوكسات' : 'الكؤوس') : existing.category;
  const stock = data.stock !== undefined ? Math.max(0, parseInt(String(data.stock), 10)) : existing.stock;
  const badge = data.badge !== undefined ? data.badge.trim() : existing.badge;
  const images = data.images !== undefined ? JSON.stringify(data.images.filter(Boolean)) : JSON.stringify(existing.images);

  const stmt = db.prepare(`
    UPDATE products
    SET name = ?, price = ?, description = ?, category = ?, images = ?, stock = ?, badge = ?
    WHERE id = ?
  `);

  stmt.run(name, price, description, category, images, stock, badge, id);
  return getProductById(id);
}

export function deleteProduct(id: number) {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const res = stmt.run(id);
  return res.changes > 0;
}

// -------------------------------------------------------------
// Wilayas Management
// -------------------------------------------------------------

export function getAllWilayas() {
  const stmt = db.prepare('SELECT * FROM wilayas ORDER BY code ASC');
  return stmt.all();
}

export function getWilayaByCode(code: number) {
  const stmt = db.prepare('SELECT * FROM wilayas WHERE code = ?');
  return stmt.get(code);
}

export function updateWilayaPrice(code: number, home_price: number, office_price: number, is_active: number = 1) {
  const stmt = db.prepare(`
    UPDATE wilayas
    SET home_price = ?, office_price = ?, is_active = ?
    WHERE code = ?
  `);
  stmt.run(Math.max(0, Number(home_price)), Math.max(0, Number(office_price)), is_active ? 1 : 0, code);
  return getWilayaByCode(code);
}

export function bulkUpdateWilayas(wilayasList: Array<{ code: number; home_price: number; office_price: number; is_active?: number }>) {
  db.exec('BEGIN TRANSACTION;');
  try {
    const stmt = db.prepare(`
      UPDATE wilayas
      SET home_price = ?, office_price = ?, is_active = COALESCE(?, is_active)
      WHERE code = ?
    `);
    for (const w of wilayasList) {
      stmt.run(
        Math.max(0, Number(w.home_price)),
        Math.max(0, Number(w.office_price)),
        w.is_active !== undefined ? (w.is_active ? 1 : 0) : null,
        w.code
      );
    }
    db.exec('COMMIT;');
    return getAllWilayas();
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

// -------------------------------------------------------------
// Orders & Tracking
// -------------------------------------------------------------

export function createOrder(data: {
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    wilaya_code: number;
    delivery_type: 'home' | 'office';
  };
  items: Array<{ productId: number; quantity: number }>;
}) {
  if (!data.items || data.items.length === 0) {
    throw new Error('السلة فارغة، يرجى إضافة منتجات قبل إتمام الطلب');
  }

  // Look up Wilaya
  const wilaya = getWilayaByCode(data.customer.wilaya_code) as any;
  if (!wilaya) {
    throw new Error('يرجى اختيار ولاية صالحة من ولايات الجزائر');
  }

  // Calculate delivery price based on type & free shipping settings
  const settings = getStoreSettings();
  let subtotal = 0;
  const verifiedItems: Array<{
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }> = [];

  for (const item of data.items) {
    const product = getProductById(Number(item.productId)) as any;
    if (!product) {
      throw new Error(`المنتج رقم ${item.productId} لم يعد متوفراً في المتجر`);
    }
    const qty = Math.max(1, parseInt(String(item.quantity), 10));
    if (product.stock < qty) {
      throw new Error(`الكمية المطلوبة من "${product.name}" غير متوفرة (المتبقي: ${product.stock})`);
    }

    const itemPrice = Number(product.price);
    subtotal += itemPrice * qty;
    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      price: itemPrice,
      quantity: qty
    });
  }

  let deliveryPrice = data.customer.delivery_type === 'office' ? wilaya.office_price : wilaya.home_price;
  if (settings.freeShippingEnabled && subtotal >= settings.freeShippingThreshold) {
    deliveryPrice = 0;
  }

  const totalAmount = subtotal + deliveryPrice;

  // Execute database transaction
  db.exec('BEGIN TRANSACTION;');
  try {
    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (
        customer_name, customer_phone, customer_address, customer_notes,
        wilaya_code, wilaya_name, delivery_type, delivery_price, subtotal, total_amount, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const orderRes = insertOrderStmt.run(
      data.customer.name.trim(),
      data.customer.phone.trim(),
      data.customer.address.trim(),
      (data.customer.notes || '').trim(),
      wilaya.code,
      wilaya.name_ar,
      data.customer.delivery_type || 'home',
      deliveryPrice,
      subtotal,
      totalAmount,
      'جديد'
    );

    const orderId = Number(orderRes.lastInsertRowid);

    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);

    const decrementStockStmt = db.prepare(`
      UPDATE products
      SET stock = stock - ?
      WHERE id = ?
    `);

    for (const vItem of verifiedItems) {
      insertItemStmt.run(orderId, vItem.productId, vItem.productName, vItem.price, vItem.quantity);
      decrementStockStmt.run(vItem.quantity, vItem.productId);
    }

    db.exec('COMMIT;');
    return getOrderById(orderId);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function getOrderById(id: number) {
  const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  const order = orderStmt.get(id) as any;
  if (!order) return null;

  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  order.items = itemsStmt.all(id);
  return order;
}

export function getOrdersByPhone(phone: string) {
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
  const ordersStmt = db.prepare(`
    SELECT * FROM orders 
    WHERE customer_phone LIKE ? 
       OR REPLACE(REPLACE(customer_phone, ' ', ''), '-', '') LIKE ?
    ORDER BY id DESC
  `);
  const pattern = `%${cleanPhone.slice(-8)}%`;
  const orders = ordersStmt.all(pattern, pattern) as any[];

  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  for (const o of orders) {
    o.items = itemsStmt.all(o.id);
  }
  return orders;
}

export function getAllOrders() {
  const ordersStmt = db.prepare('SELECT * FROM orders ORDER BY id DESC');
  const orders = ordersStmt.all() as any[];

  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  for (const o of orders) {
    o.items = itemsStmt.all(o.id);
  }
  return orders;
}

export function updateOrderStatus(orderId: number, newStatus: string) {
  const order = getOrderById(orderId);
  if (!order) return null;

  const oldStatus = order.status;
  if (oldStatus === newStatus) return order;

  db.exec('BEGIN TRANSACTION;');
  try {
    if (newStatus === 'ملغي' && oldStatus !== 'ملغي') {
      const restockStmt = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
      for (const item of order.items) {
        restockStmt.run(item.quantity, item.product_id);
      }
    } else if (oldStatus === 'ملغي' && newStatus !== 'ملغي') {
      const deductStmt = db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?');
      for (const item of order.items) {
        deductStmt.run(item.quantity, item.product_id);
      }
    }

    const updateStmt = db.prepare(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(newStatus, orderId);

    db.exec('COMMIT;');
    return getOrderById(orderId);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function deleteOrder(orderId: number) {
  db.exec('BEGIN TRANSACTION;');
  try {
    db.prepare('DELETE FROM order_items WHERE order_id = ?').run(orderId);
    const info = db.prepare('DELETE FROM orders WHERE id = ?').run(orderId);
    db.exec('COMMIT;');
    return info.changes > 0;
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function deleteFinishedOrders() {
  db.exec('BEGIN TRANSACTION;');
  try {
    const finished = db.prepare("SELECT id FROM orders WHERE status IN ('مكتمل', 'ملغي')").all() as Array<{ id: number }>;
    const ids = finished.map(f => f.id);
    if (ids.length > 0) {
      const deleteItems = db.prepare('DELETE FROM order_items WHERE order_id = ?');
      const deleteOrd = db.prepare('DELETE FROM orders WHERE id = ?');
      for (const id of ids) {
        deleteItems.run(id);
        deleteOrd.run(id);
      }
    }
    db.exec('COMMIT;');
    return ids.length;
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function getStats() {
  const totalSalesStmt = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'ملغي'");
  const totalOrdersStmt = db.prepare('SELECT COUNT(*) as count FROM orders');
  const pendingOrdersStmt = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'جديد'");
  const totalProductsStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const lowStockStmt = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock <= 3');

  return {
    totalSales: (totalSalesStmt.get() as any).total,
    totalOrders: (totalOrdersStmt.get() as any).count,
    pendingOrders: (pendingOrdersStmt.get() as any).count,
    totalProducts: (totalProductsStmt.get() as any).count,
    lowStockCount: (lowStockStmt.get() as any).count
  };
}

export function getStoreSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{ key: string; value: string }>;
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return {
    storeName: 'glassglow',
    primaryColor: map['primary_color'] || '#059669',
    currency: 'د.ج', // Strictly Algerian Dinar
    announcement: map['announcement'] || 'توصيل متوفر لجميع الولايات الـ 58 والدفع عند الاستلام!',
    freeShippingEnabled: map['free_shipping_enabled'] === '1' || map['free_shipping_enabled'] === 'true',
    freeShippingThreshold: Number(map['free_shipping_threshold'] || 5000)
  };
}

export function updateStoreSettings(settings: Partial<{
  storeName: string;
  primaryColor: string;
  announcement: string;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
}>) {
  if (settings.storeName !== undefined) {
    setSettingStmt.run('store_name', settings.storeName.trim() || 'كؤوس وأكواب الجزائر');
  }
  if (settings.primaryColor !== undefined) {
    setSettingStmt.run('primary_color', settings.primaryColor.trim() || '#059669');
  }
  if (settings.announcement !== undefined) {
    setSettingStmt.run('announcement', settings.announcement.trim());
  }
  if (settings.freeShippingEnabled !== undefined) {
    setSettingStmt.run('free_shipping_enabled', settings.freeShippingEnabled ? '1' : '0');
  }
  if (settings.freeShippingThreshold !== undefined) {
    setSettingStmt.run('free_shipping_threshold', String(Math.max(0, Number(settings.freeShippingThreshold))));
  }
  return getStoreSettings();
}
