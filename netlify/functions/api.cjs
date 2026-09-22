var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../../tmp/api-entry.ts
var api_entry_exports = {};
__export(api_entry_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(api_entry_exports);

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_node_zlib = require("node:zlib");

// server/db.ts
var import_node_sqlite = require("node:sqlite");
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);

// src/data/wilayas.ts
var ALGERIA_WILAYAS = [
  { code: 1, name_ar: "\u0623\u062F\u0631\u0627\u0631", name_en: "Adrar", home_price: 900, office_price: 600 },
  { code: 2, name_ar: "\u0627\u0644\u0634\u0644\u0641", name_en: "Chlef", home_price: 650, office_price: 450 },
  { code: 3, name_ar: "\u0627\u0644\u0623\u063A\u0648\u0627\u0637", name_en: "Laghouat", home_price: 750, office_price: 500 },
  { code: 4, name_ar: "\u0623\u0645 \u0627\u0644\u0628\u0648\u0627\u0642\u064A", name_en: "Oum El Bouaghi", home_price: 650, office_price: 450 },
  { code: 5, name_ar: "\u0628\u0627\u062A\u0646\u0629", name_en: "Batna", home_price: 650, office_price: 450 },
  { code: 6, name_ar: "\u0628\u062C\u0627\u064A\u0629", name_en: "B\xE9ja\xEFa", home_price: 600, office_price: 400 },
  { code: 7, name_ar: "\u0628\u0633\u0643\u0631\u0629", name_en: "Biskra", home_price: 750, office_price: 500 },
  { code: 8, name_ar: "\u0628\u0634\u0627\u0631", name_en: "B\xE9char", home_price: 900, office_price: 600 },
  { code: 9, name_ar: "\u0627\u0644\u0628\u0644\u064A\u062F\u0629", name_en: "Blida", home_price: 500, office_price: 350 },
  { code: 10, name_ar: "\u0627\u0644\u0628\u0648\u064A\u0631\u0629", name_en: "Bouira", home_price: 550, office_price: 350 },
  { code: 11, name_ar: "\u062A\u0645\u0646\u0631\u0627\u0633\u062A", name_en: "Tamanrasset", home_price: 1200, office_price: 800 },
  { code: 12, name_ar: "\u062A\u0628\u0633\u0629", name_en: "T\xE9bessa", home_price: 700, office_price: 450 },
  { code: 13, name_ar: "\u062A\u0644\u0645\u0633\u0627\u0646", name_en: "Tlemcen", home_price: 650, office_price: 450 },
  { code: 14, name_ar: "\u062A\u064A\u0627\u0631\u062A", name_en: "Tiaret", home_price: 650, office_price: 450 },
  { code: 15, name_ar: "\u062A\u064A\u0632\u064A \u0648\u0632\u0648", name_en: "Tizi Ouzou", home_price: 550, office_price: 350 },
  { code: 16, name_ar: "\u0627\u0644\u062C\u0632\u0627\u0626\u0631", name_en: "Alger", home_price: 400, office_price: 250 },
  { code: 17, name_ar: "\u0627\u0644\u062C\u0644\u0641\u0629", name_en: "Djelfa", home_price: 700, office_price: 450 },
  { code: 18, name_ar: "\u062C\u064A\u062C\u0644", name_en: "Jijel", home_price: 650, office_price: 450 },
  { code: 19, name_ar: "\u0633\u0637\u064A\u0641", name_en: "S\xE9tif", home_price: 600, office_price: 400 },
  { code: 20, name_ar: "\u0633\u0639\u064A\u062F\u0629", name_en: "Sa\xEFda", home_price: 700, office_price: 450 },
  { code: 21, name_ar: "\u0633\u0643\u064A\u0643\u062F\u0629", name_en: "Skikda", home_price: 650, office_price: 450 },
  { code: 22, name_ar: "\u0633\u064A\u062F\u064A \u0628\u0644\u0639\u0628\u0627\u0633", name_en: "Sidi Bel Abb\xE8s", home_price: 650, office_price: 450 },
  { code: 23, name_ar: "\u0639\u0646\u0627\u0628\u0629", name_en: "Annaba", home_price: 650, office_price: 450 },
  { code: 24, name_ar: "\u0642\u0627\u0644\u0645\u0629", name_en: "Guelma", home_price: 650, office_price: 450 },
  { code: 25, name_ar: "\u0642\u0633\u0646\u0637\u064A\u0646\u0629", name_en: "Constantine", home_price: 600, office_price: 400 },
  { code: 26, name_ar: "\u0627\u0644\u0645\u062F\u064A\u0629", name_en: "M\xE9d\xE9a", home_price: 550, office_price: 350 },
  { code: 27, name_ar: "\u0645\u0633\u062A\u063A\u0627\u0646\u0645", name_en: "Mostaganem", home_price: 650, office_price: 450 },
  { code: 28, name_ar: "\u0627\u0644\u0645\u0633\u064A\u0644\u0629", name_en: "M'Sila", home_price: 650, office_price: 450 },
  { code: 29, name_ar: "\u0645\u0639\u0633\u0643\u0631", name_en: "Mascara", home_price: 650, office_price: 450 },
  { code: 30, name_ar: "\u0648\u0631\u0642\u0644\u0629", name_en: "Ouargla", home_price: 800, office_price: 550 },
  { code: 31, name_ar: "\u0648\u0647\u0631\u0627\u0646", name_en: "Oran", home_price: 600, office_price: 400 },
  { code: 32, name_ar: "\u0627\u0644\u0628\u064A\u0636", name_en: "El Bayadh", home_price: 800, office_price: 550 },
  { code: 33, name_ar: "\u0625\u0644\u064A\u0632\u064A", name_en: "Illizi", home_price: 1200, office_price: 800 },
  { code: 34, name_ar: "\u0628\u0631\u062C \u0628\u0648\u0639\u0631\u064A\u0631\u064A\u062C", name_en: "Bordj Bou Arreridj", home_price: 600, office_price: 400 },
  { code: 35, name_ar: "\u0628\u0648\u0645\u0631\u062F\u0627\u0633", name_en: "Boumerd\xE8s", home_price: 500, office_price: 300 },
  { code: 36, name_ar: "\u0627\u0644\u0637\u0627\u0631\u0641", name_en: "El Tarf", home_price: 700, office_price: 450 },
  { code: 37, name_ar: "\u062A\u0646\u062F\u0648\u0641", name_en: "Tindouf", home_price: 1200, office_price: 800 },
  { code: 38, name_ar: "\u062A\u064A\u0633\u0645\u0633\u064A\u0644\u062A", name_en: "Tissemsilt", home_price: 650, office_price: 450 },
  { code: 39, name_ar: "\u0627\u0644\u0648\u0627\u062F\u064A", name_en: "El Oued", home_price: 750, office_price: 500 },
  { code: 40, name_ar: "\u062E\u0646\u0634\u0644\u0629", name_en: "Khenchela", home_price: 700, office_price: 450 },
  { code: 41, name_ar: "\u0633\u0648\u0642 \u0623\u0647\u0631\u0627\u0633", name_en: "Souk Ahras", home_price: 700, office_price: 450 },
  { code: 42, name_ar: "\u062A\u064A\u0628\u0627\u0632\u0629", name_en: "Tipaza", home_price: 500, office_price: 300 },
  { code: 43, name_ar: "\u0645\u064A\u0644\u0629", name_en: "Mila", home_price: 650, office_price: 450 },
  { code: 44, name_ar: "\u0639\u064A\u0646 \u0627\u0644\u062F\u0641\u0644\u0649", name_en: "A\xEFn Defla", home_price: 600, office_price: 400 },
  { code: 45, name_ar: "\u0627\u0644\u0646\u0639\u0627\u0645\u0629", name_en: "Na\xE2ma", home_price: 800, office_price: 550 },
  { code: 46, name_ar: "\u0639\u064A\u0646 \u062A\u0645\u0648\u0634\u0646\u062A", name_en: "A\xEFn T\xE9mouchent", home_price: 650, office_price: 450 },
  { code: 47, name_ar: "\u063A\u0631\u062F\u0627\u064A\u0629", name_en: "Gharda\xEFa", home_price: 800, office_price: 550 },
  { code: 48, name_ar: "\u063A\u0644\u064A\u0632\u0627\u0646", name_en: "Relizane", home_price: 650, office_price: 450 },
  { code: 49, name_ar: "\u062A\u064A\u0645\u064A\u0645\u0648\u0646", name_en: "Timimoun", home_price: 950, office_price: 650 },
  { code: 50, name_ar: "\u0628\u0631\u062C \u0628\u0627\u062C\u064A \u0645\u062E\u062A\u0627\u0631", name_en: "Bordj Badji Mokhtar", home_price: 1300, office_price: 900 },
  { code: 51, name_ar: "\u0623\u0648\u0644\u0627\u062F \u062C\u0644\u0627\u0644", name_en: "Ouled Djellal", home_price: 750, office_price: 500 },
  { code: 52, name_ar: "\u0628\u0646\u064A \u0639\u0628\u0627\u0633", name_en: "B\xE9ni Abb\xE8s", home_price: 950, office_price: 650 },
  { code: 53, name_ar: "\u0625\u0646 \u0635\u0627\u0644\u062D", name_en: "In Salah", home_price: 1100, office_price: 750 },
  { code: 54, name_ar: "\u0625\u0646 \u0642\u0632\u0627\u0645", name_en: "In Guezzam", home_price: 1300, office_price: 900 },
  { code: 55, name_ar: "\u062A\u0642\u0631\u062A", name_en: "Touggourt", home_price: 800, office_price: 550 },
  { code: 56, name_ar: "\u062C\u0627\u0646\u062A", name_en: "Djanet", home_price: 1200, office_price: 800 },
  { code: 57, name_ar: "\u0627\u0644\u0645\u063A\u064A\u0631", name_en: "El M'Ghair", home_price: 800, office_price: 550 },
  { code: 58, name_ar: "\u0627\u0644\u0645\u0646\u064A\u0639\u0629", name_en: "El Meniaa", home_price: 850, office_price: 600 }
];

// server/db.ts
var bundledDataDir = import_node_path.default.resolve(process.cwd(), "data");
var isNetlifyFunction = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
var DATA_DIR = isNetlifyFunction ? "/tmp/glass-glow-data" : bundledDataDir;
if (!import_node_fs.default.existsSync(DATA_DIR)) import_node_fs.default.mkdirSync(DATA_DIR, { recursive: true });
var bundledDbPath = import_node_path.default.join(bundledDataDir, "store.sqlite");
var DB_PATH = import_node_path.default.join(DATA_DIR, "store.sqlite");
if (isNetlifyFunction && !import_node_fs.default.existsSync(DB_PATH) && import_node_fs.default.existsSync(bundledDbPath)) {
  import_node_fs.default.copyFileSync(bundledDbPath, DB_PATH);
}
var db = new import_node_sqlite.DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");
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
    discount_percent REAL NOT NULL DEFAULT 0,
    discount_price REAL NOT NULL DEFAULT 0,
    discount_enabled INTEGER NOT NULL DEFAULT 0,
    discount_start TEXT,
    discount_end TEXT,
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
    status TEXT NOT NULL DEFAULT '\u062C\u062F\u064A\u062F',
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
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
try {
  const pragmaProd = db.prepare("PRAGMA table_info(products)").all();
  const hasImages = pragmaProd.some((col) => col.name === "images");
  if (!hasImages) {
    db.exec('ALTER TABLE products ADD COLUMN images TEXT NOT NULL DEFAULT "[]";');
  }
  const discountColumns = db.prepare("PRAGMA table_info(products)").all();
  if (!discountColumns.some((col) => col.name === "discount_percent")) db.exec("ALTER TABLE products ADD COLUMN discount_percent REAL NOT NULL DEFAULT 0;");
  if (!discountColumns.some((col) => col.name === "discount_start")) db.exec("ALTER TABLE products ADD COLUMN discount_start TEXT;");
  if (!discountColumns.some((col) => col.name === "discount_end")) db.exec("ALTER TABLE products ADD COLUMN discount_end TEXT;");
  if (!discountColumns.some((col) => col.name === "discount_price")) db.exec("ALTER TABLE products ADD COLUMN discount_price REAL NOT NULL DEFAULT 0;");
  if (!discountColumns.some((col) => col.name === "discount_enabled")) db.exec("ALTER TABLE products ADD COLUMN discount_enabled INTEGER NOT NULL DEFAULT 0;");
  const pragmaOrders = db.prepare("PRAGMA table_info(orders)").all();
  const hasWilayaCode = pragmaOrders.some((col) => col.name === "wilaya_code");
  if (!hasWilayaCode) {
    db.exec("ALTER TABLE orders ADD COLUMN wilaya_code INTEGER;");
    db.exec("ALTER TABLE orders ADD COLUMN wilaya_name TEXT;");
    db.exec('ALTER TABLE orders ADD COLUMN delivery_type TEXT NOT NULL DEFAULT "home";');
    db.exec("ALTER TABLE orders ADD COLUMN delivery_price REAL NOT NULL DEFAULT 0;");
    db.exec("ALTER TABLE orders ADD COLUMN subtotal REAL NOT NULL DEFAULT 0;");
  }
} catch (e) {
  console.log("Migration check info:", e);
}
var getSettingStmt = db.prepare("SELECT value FROM settings WHERE key = ?");
var setSettingStmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
setSettingStmt.run("store_name", "Glass Glow");
if (!getSettingStmt.get("primary_color")) {
  setSettingStmt.run("primary_color", "#059669");
}
setSettingStmt.run("currency", "\u062F.\u062C");
if (!getSettingStmt.get("announcement")) {
  setSettingStmt.run("announcement", "\u062A\u0648\u0635\u064A\u0644 \u0645\u062A\u0648\u0641\u0631 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0627\u0644\u0640 58 \u0648\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645!");
}
if (!getSettingStmt.get("free_shipping_enabled")) {
  setSettingStmt.run("free_shipping_enabled", "1");
}
if (!getSettingStmt.get("free_shipping_threshold")) {
  setSettingStmt.run("free_shipping_threshold", "5000");
}
var categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get().count;
if (categoryCount === 0) {
  const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
  for (const name of ["\u0627\u0644\u0643\u0624\u0648\u0633", "\u0627\u0644\u0628\u0648\u0643\u0633\u0627\u062A"]) insertCategory.run(name);
}
var countWilayasStmt = db.prepare("SELECT COUNT(*) as count FROM wilayas");
var wilayaCount = countWilayasStmt.get().count;
if (wilayaCount === 0) {
  const insertWilaya = db.prepare(`
    INSERT INTO wilayas (code, name_ar, name_en, home_price, office_price, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  for (const w of ALGERIA_WILAYAS) {
    insertWilaya.run(w.code, w.name_ar, w.name_en, w.home_price, w.office_price);
  }
}
var FRESH_PRODUCTS = [
  {
    name: "\u0643\u0648\u0628 \u0633\u064A\u0631\u0627\u0645\u064A\u0643 \u064A\u062F\u0648\u064A \u0641\u0627\u062E\u0631 \u0628\u062A\u0635\u0645\u064A\u0645 \u0631\u062E\u0627\u0645\u064A",
    price: 1800,
    description: "\u0643\u0648\u0628 \u0633\u064A\u0631\u0627\u0645\u064A\u0643 \u0645\u0635\u0646\u0648\u0639 \u064A\u062F\u0648\u064A\u0627\u064B \u0628\u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629 \u0645\u0639 \u0637\u0644\u0627\u0621 \u0631\u062E\u0627\u0645\u064A \u062D\u0631\u0627\u0631\u064A \u0623\u0646\u064A\u0642 \u0648\u0645\u0642\u0627\u0648\u0645 \u0644\u063A\u0633\u0627\u0644\u0627\u062A \u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0648\u0627\u0644\u0645\u064A\u0643\u0631\u0648\u0648\u064A\u0641\u060C \u0633\u0639\u0629 350 \u0645\u0644 \u0645\u062B\u0627\u0644\u064A \u0644\u0644\u0642\u0647\u0648\u0629 \u0627\u0644\u0635\u0628\u0627\u062D\u064A\u0629 \u0648\u0627\u0644\u0634\u0627\u064A.",
    category: "\u0627\u0644\u0643\u0624\u0648\u0633",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80"
    ]),
    stock: 25,
    rating: 4.9,
    reviews_count: 42,
    badge: "\u0627\u0644\u0623\u0643\u062B\u0631 \u0645\u0628\u064A\u0639\u0627\u064B"
  },
  {
    name: "\u0643\u0648\u0628 \u062D\u0631\u0627\u0631\u064A \u0645\u0632\u062F\u0648\u062C \u0627\u0644\u062C\u062F\u0627\u0631 \u062D\u0627\u0641\u0638 \u0644\u0644\u062D\u0631\u0627\u0631\u0629 \u0648\u0627\u0644\u0628\u0631\u0648\u062F\u0629",
    price: 2400,
    description: "\u0643\u0648\u0628 \u062D\u0631\u0627\u0631\u064A \u0645\u0646 \u0627\u0644\u0641\u0648\u0644\u0627\u0630 \u0627\u0644\u0645\u0642\u0627\u0648\u0645 \u0644\u0644\u0635\u062F\u0623 304 \u0645\u0639 \u063A\u0637\u0627\u0621 \u0645\u0627\u0646\u0639 \u0644\u0644\u062A\u0633\u0631\u0628 \u064A\u062D\u0641\u0638 \u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062A \u062D\u062A\u0649 8 \u0633\u0627\u0639\u0627\u062A \u0648\u0628\u0631\u0648\u062F\u062A\u0647\u0627 \u062D\u062A\u0649 12 \u0633\u0627\u0639\u0629\u060C \u0633\u0639\u0629 450 \u0645\u0644.",
    category: "\u0627\u0644\u0643\u0624\u0648\u0633",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80"
    ]),
    stock: 18,
    rating: 4.8,
    reviews_count: 36,
    badge: "\u062C\u062F\u064A\u062F"
  },
  {
    name: "\u0643\u0648\u0628 \u0632\u062C\u0627\u062C\u064A \u0628\u0631\u0648\u0633\u064A\u0644\u064A\u0643\u0627\u062A \u0645\u0632\u062F\u0648\u062C \u0634\u0641\u0627\u0641 \u0644\u0644\u0642\u0647\u0648\u0629 \u0627\u0644\u0645\u062E\u062A\u0635\u0629",
    price: 1500,
    description: "\u0643\u0648\u0628 \u0632\u062C\u0627\u062C\u064A \u0623\u0646\u064A\u0642 \u0639\u0627\u0632\u0644 \u0644\u0644\u062D\u0631\u0627\u0631\u0629 \u0644\u0627 \u064A\u062D\u0631\u0642 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0645\u0642\u0627\u0648\u0645 \u0644\u0644\u0635\u062F\u0645\u0627\u062A \u0627\u0644\u062D\u0631\u0627\u0631\u064A\u0629\u060C \u0633\u0639\u0629 300 \u0645\u0644 \u0644\u0625\u0628\u0631\u0627\u0632 \u062C\u0645\u0627\u0644 \u0637\u0628\u0642\u0627\u062A \u0627\u0644\u0644\u0627\u062A\u064A\u0647 \u0648\u0627\u0644\u0643\u0627\u0628\u062A\u0634\u064A\u0646\u0648.",
    category: "\u0627\u0644\u0643\u0624\u0648\u0633",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
    ]),
    stock: 30,
    rating: 4.9,
    reviews_count: 51,
    badge: ""
  },
  {
    name: "\u0643\u0648\u0628 \u0641\u062E\u0627\u0631\u064A \u0645\u0627\u062A \u0628\u062A\u0634\u0637\u064A\u0628 \u062C\u0628\u0644\u064A \u0639\u062A\u064A\u0642",
    price: 2100,
    description: "\u0643\u0648\u0628 \u0641\u062E\u0627\u0631\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0628\u062A\u0634\u0637\u064A\u0628 \u062C\u0628\u0644\u064A \u0631\u0645\u0627\u062F\u064A \u063A\u064A\u0631 \u0644\u0627\u0645\u0639 \u0648\u0645\u0644\u0645\u0633 \u062A\u0631\u0627\u0628\u064A \u062F\u0627\u0641\u0626\u060C \u0645\u062A\u064A\u0646 \u0648\u0645\u0631\u064A\u062D \u0641\u064A \u0642\u0628\u0636\u0629 \u0627\u0644\u064A\u062F \u0645\u0639 \u0639\u0632\u0644 \u062D\u0631\u0627\u0631\u064A \u0637\u0628\u064A\u0639\u064A \u0645\u0645\u062A\u0627\u0632.",
    category: "\u0627\u0644\u0643\u0624\u0648\u0633",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80"
    ]),
    stock: 20,
    rating: 4.8,
    reviews_count: 27,
    badge: "\u0625\u0635\u062F\u0627\u0631 \u0645\u062D\u062F\u0648\u062F"
  },
  {
    name: "\u0628\u0648\u0643\u0633 \u0627\u0644\u0630\u0648\u0627\u0642\u0629 \u0627\u0644\u0645\u0644\u0643\u064A (\u0645\u062C\u0645\u0648\u0639\u0629 4 \u0623\u0643\u0648\u0627\u0628 \u0641\u062E\u0627\u0631\u064A\u0629 \u0645\u0639 \u0642\u0627\u0639\u062F\u0629 \u062E\u0634\u0628\u064A\u0629)",
    price: 5200,
    description: "\u0628\u0648\u0643\u0633 \u0647\u062F\u0627\u064A\u0627 \u0641\u0627\u062E\u0631 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u062A\u0634\u0643\u064A\u0644\u0629 \u0645\u0646 4 \u0623\u0643\u0648\u0627\u0628 \u0642\u0647\u0648\u0629 \u0641\u062E\u0627\u0631\u064A\u0629 \u064A\u062F\u0648\u064A\u0629 \u0627\u0644\u0635\u0646\u0639 \u0628\u0623\u0644\u0648\u0627\u0646 \u0645\u062A\u0646\u0627\u063A\u0645\u0629 \u0645\u0639 \u0642\u0648\u0627\u0639\u062F \u062E\u064A\u0632\u0631\u0627\u0646 \u0637\u0628\u064A\u0639\u064A\u0629 \u0648\u0645\u0644\u0639\u0642\u0629 \u062E\u0634\u0628\u064A\u0629 \u0645\u062D\u0641\u0648\u0631\u0629\u060C \u0645\u063A\u0644\u0641\u0629 \u0641\u064A \u0635\u0646\u062F\u0648\u0642 \u0647\u062F\u0627\u064A\u0627 \u0645\u0642\u0648\u0649 \u0648\u0645\u0628\u0637\u0646.",
    category: "\u0627\u0644\u0628\u0648\u0643\u0633\u0627\u062A",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80"
    ]),
    stock: 12,
    rating: 5,
    reviews_count: 64,
    badge: "\u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B"
  },
  {
    name: "\u0628\u0648\u0643\u0633 \u0627\u0644\u0623\u0632\u0648\u0627\u062C \u0627\u0644\u0641\u0627\u062E\u0631 (\u0643\u0648\u0628\u064A\u0646 \u0633\u064A\u0631\u0627\u0645\u064A\u0643 \u0628\u062A\u0635\u0645\u064A\u0645 \u0631\u062E\u0627\u0645\u064A \u0623\u0633\u0648\u062F \u0648\u0623\u0628\u064A\u0636)",
    price: 3800,
    description: "\u0628\u0648\u0643\u0633 \u0623\u0646\u064A\u0642 \u0645\u062E\u0635\u0635 \u0643\u0647\u062F\u064A\u0629 \u0644\u0644\u0623\u0632\u0648\u0627\u062C \u0623\u0648 \u0627\u0644\u0623\u0635\u062F\u0642\u0627\u0621\u060C \u064A\u0636\u0645 \u0643\u0648\u0628\u064A\u0646 \u0645\u0646 \u0627\u0644\u0633\u064A\u0631\u0627\u0645\u064A\u0643 \u0627\u0644\u0645\u0637\u0641\u064A \u0645\u0639 \u0623\u063A\u0637\u064A\u0629 \u062E\u0634\u0628\u064A\u0629 \u0645\u062D\u0643\u0645\u0629 \u0648\u062D\u0644\u0642\u0627\u062A \u0630\u0647\u0628\u064A\u0629 \u0641\u0627\u062E\u0631\u0629 \u0648\u0635\u0646\u062F\u0648\u0642 \u0647\u062F\u0627\u064A\u0627 \u0645\u0632\u064A\u0646 \u0628\u0634\u0631\u064A\u0637 \u0633\u0627\u062A\u0627\u0646.",
    category: "\u0627\u0644\u0628\u0648\u0643\u0633\u0627\u062A",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80"
    ]),
    stock: 15,
    rating: 4.9,
    reviews_count: 48,
    badge: "\u0647\u062F\u064A\u0629 \u0631\u0627\u0642\u064A\u0629"
  },
  {
    name: "\u0628\u0648\u0643\u0633 \u0623\u0643\u0648\u0627\u0628 \u0627\u0644\u0625\u0633\u0628\u0631\u064A\u0633\u0648 \u0627\u0644\u0625\u064A\u0637\u0627\u0644\u064A\u0629 (\u0637\u0642\u0645 6 \u0641\u0646\u0627\u062C\u064A\u0646 \u0645\u0639 \u0623\u0637\u0628\u0627\u0642\u0647\u0627)",
    price: 4600,
    description: "\u0645\u062C\u0645\u0648\u0639\u0629 \u0645\u062A\u0643\u0627\u0645\u0644\u0629 \u0645\u0646 6 \u0641\u0646\u0627\u062C\u064A\u0646 \u0625\u0633\u0628\u0631\u064A\u0633\u0648 \u0628\u062A\u0635\u0627\u0645\u064A\u0645 \u0645\u0633\u062A\u0648\u062D\u0627\u0629 \u0645\u0646 \u0627\u0644\u0645\u0642\u0627\u0647\u064A \u0627\u0644\u0625\u064A\u0637\u0627\u0644\u064A\u0629 \u0627\u0644\u0639\u0631\u064A\u0642\u0629 \u0645\u0639 \u0623\u0637\u0628\u0627\u0642 \u0633\u064A\u0631\u0627\u0645\u064A\u0643 \u0645\u0637\u0627\u0628\u0642\u0629 \u0648\u062D\u0627\u0645\u0644 \u0645\u0639\u062F\u0646\u064A \u0623\u0646\u064A\u0642 \u0644\u062A\u0632\u064A\u064A\u0646 \u0631\u0643\u0646 \u0627\u0644\u0642\u0647\u0648\u0629.",
    category: "\u0627\u0644\u0628\u0648\u0643\u0633\u0627\u062A",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80"
    ]),
    stock: 10,
    rating: 4.8,
    reviews_count: 29,
    badge: "\u0637\u0642\u0645 \u0645\u062A\u0643\u0627\u0645\u0644"
  },
  {
    name: "\u0628\u0648\u0643\u0633 \u0627\u0644\u0633\u0641\u0631 \u0627\u0644\u0645\u062A\u0643\u0627\u0645\u0644 (\u0643\u0648\u0628\u064A\u0646 \u062D\u0631\u0627\u0631\u064A\u064A\u0646 \u0645\u0639 \u062D\u0627\u0641\u0638\u0629 \u0623\u0646\u064A\u0642\u0629)",
    price: 6400,
    description: "\u0628\u0648\u0643\u0633 \u0647\u062F\u0627\u064A\u0627 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A \u0644\u0639\u0634\u0627\u0642 \u0627\u0644\u0631\u062D\u0644\u0627\u062A \u0648\u0627\u0644\u062A\u0646\u0642\u0644\u060C \u064A\u062A\u0636\u0645\u0646 \u0643\u0648\u0628\u064A\u0646 \u062D\u0631\u0627\u0631\u064A\u064A\u0646 \u0641\u0627\u0626\u0642\u064A\u0646 \u0627\u0644\u0639\u0632\u0644 \u0645\u0639 \u0623\u063A\u0637\u064A\u0629 \u0634\u0641\u0627\u0641\u0629 \u0645\u062D\u0643\u0645\u0629 \u0648\u0635\u0646\u062F\u0648\u0642 \u0647\u062F\u0627\u064A\u0627 \u0645\u0628\u0637\u0646 \u0641\u0627\u062E\u0631.",
    category: "\u0627\u0644\u0628\u0648\u0643\u0633\u0627\u062A",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
    ]),
    stock: 8,
    rating: 4.9,
    reviews_count: 19,
    badge: "\u062C\u062F\u064A\u062F"
  }
];
function resetProducts() {
  db.exec("BEGIN TRANSACTION;");
  try {
    db.prepare("DELETE FROM products").run();
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
    db.exec("COMMIT;");
    setSettingStmt.run("products_reset_v3", "true");
    return getAllProducts();
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
var countStmt = db.prepare("SELECT COUNT(*) as count FROM products");
var currentCount = countStmt.get().count;
var resetCheck = getSettingStmt.get("products_reset_v3");
if (currentCount === 0 || !resetCheck) {
  resetProducts();
}
function formatProductRow(row, includeAllImages = true) {
  if (!row) return null;
  let parsedImages = [];
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
  const primaryImage = parsedImages[0] || row.image || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80";
  const discountPrice = Math.max(0, Number(row.discount_price || 0));
  const start2 = row.discount_start ? Date.parse(row.discount_start) : -Infinity;
  const end = row.discount_end ? Date.parse(row.discount_end) : Infinity;
  const activeDiscount = Boolean(row.discount_enabled) && discountPrice > 0 && discountPrice < Number(row.price) && Date.now() >= start2 && Date.now() <= end;
  const salePrice = activeDiscount ? discountPrice : Number(row.price);
  return {
    ...row,
    images: includeAllImages ? parsedImages.length > 0 ? parsedImages : [primaryImage] : [primaryImage],
    image: includeAllImages ? primaryImage : void 0,
    discountPrice,
    discountEnabled: Boolean(row.discount_enabled),
    discountStart: row.discount_start || "",
    discountEnd: row.discount_end || "",
    salePrice
  };
}
function getAllProducts(filter = {}, includeAllImages = true) {
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];
  if (filter.category && filter.category !== "ALL") {
    sql += " AND category = ?";
    params.push(filter.category);
  }
  if (filter.search && filter.search.trim()) {
    sql += " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
    const term = `%${filter.search.trim()}%`;
    params.push(term, term, term);
  }
  if (filter.sort === "price-asc") {
    sql += " ORDER BY price ASC";
  } else if (filter.sort === "price-desc") {
    sql += " ORDER BY price DESC";
  } else if (filter.sort === "name-asc") {
    sql += " ORDER BY name ASC";
  } else {
    sql += " ORDER BY id DESC";
  }
  const stmt = db.prepare(sql);
  const rows = stmt.all(...params);
  return rows.map((row) => formatProductRow(row, includeAllImages));
}
function getProductById(id) {
  const stmt = db.prepare("SELECT * FROM products WHERE id = ?");
  const row = stmt.get(id);
  return formatProductRow(row);
}
function getAllCategories() {
  return db.prepare("SELECT name FROM categories ORDER BY id ASC").all().map((row) => row.name);
}
function createCategory(name) {
  const clean = String(name || "").trim();
  if (!clean || clean.length > 40) throw new Error("\u0627\u0633\u0645 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D");
  db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)").run(clean);
  return clean;
}
function renameCategory(oldName, name) {
  const clean = String(name || "").trim();
  if (!clean || clean.length > 40) throw new Error("\u0627\u0633\u0645 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D");
  if (oldName === clean) return clean;
  const result = db.prepare("UPDATE categories SET name = ? WHERE name = ?").run(clean, oldName);
  if (!result.changes) throw new Error("\u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F");
  db.prepare("UPDATE products SET category = ? WHERE category = ?").run(clean, oldName);
  return clean;
}
function deleteCategory(name) {
  const used = db.prepare("SELECT COUNT(*) as count FROM products WHERE category = ?").get(name).count;
  if (used > 0) throw new Error("\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0630\u0641 \u062A\u0635\u0646\u064A\u0641 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0645\u0646\u062A\u062C\u0627\u062A");
  const result = db.prepare("DELETE FROM categories WHERE name = ?").run(name);
  return result.changes > 0;
}
function createProduct(data) {
  const stmt = db.prepare(`
    INSERT INTO products (name, price, description, category, images, badge, discount_price, discount_enabled, discount_start, discount_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const safeCategory = String(data.category || "\u0627\u0644\u0643\u0624\u0648\u0633").trim() || "\u0627\u0644\u0643\u0624\u0648\u0633";
  createCategory(safeCategory);
  const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images.filter(Boolean) : []);
  const res = stmt.run(
    data.name.trim(),
    Math.max(0, Number(data.price)),
    data.description.trim(),
    safeCategory,
    imagesJson,
    (data.badge || "").trim(),
    Math.max(0, Number(data.discountPrice || 0)),
    data.discountEnabled ? 1 : 0,
    data.discountStart || null,
    data.discountEnd || null
  );
  return getProductById(Number(res.lastInsertRowid));
}
function updateProduct(id, data) {
  const existing = getProductById(id);
  if (!existing) return null;
  const name = data.name !== void 0 ? data.name.trim() : existing.name;
  const price = data.price !== void 0 ? Math.max(0, Number(data.price)) : existing.price;
  const description = data.description !== void 0 ? data.description.trim() : existing.description;
  const category = data.category !== void 0 ? String(data.category).trim() || existing.category : existing.category;
  createCategory(category);
  const badge = data.badge !== void 0 ? data.badge.trim() : existing.badge;
  const discountPrice = data.discountPrice !== void 0 ? Math.max(0, Number(data.discountPrice)) : Number(existing.discountPrice || 0);
  const discountEnabled = data.discountEnabled !== void 0 ? Boolean(data.discountEnabled) : Boolean(existing.discountEnabled);
  const discountStart = data.discountStart !== void 0 ? data.discountStart || null : existing.discountStart || null;
  const discountEnd = data.discountEnd !== void 0 ? data.discountEnd || null : existing.discountEnd || null;
  const images = data.images !== void 0 ? JSON.stringify(data.images.filter(Boolean)) : JSON.stringify(existing.images);
  const stmt = db.prepare(`
    UPDATE products
    SET name = ?, price = ?, description = ?, category = ?, images = ?, badge = ?, discount_price = ?, discount_enabled = ?, discount_start = ?, discount_end = ?
    WHERE id = ?
  `);
  stmt.run(name, price, description, category, images, badge, discountPrice, discountEnabled ? 1 : 0, discountStart, discountEnd, id);
  return getProductById(id);
}
function deleteProduct(id) {
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  const res = stmt.run(id);
  return res.changes > 0;
}
function getAllWilayas() {
  const stmt = db.prepare("SELECT * FROM wilayas ORDER BY code ASC");
  return stmt.all();
}
function getWilayaByCode(code) {
  const stmt = db.prepare("SELECT * FROM wilayas WHERE code = ?");
  return stmt.get(code);
}
function updateWilayaPrice(code, home_price, office_price, is_active = 1) {
  const stmt = db.prepare(`
    UPDATE wilayas
    SET home_price = ?, office_price = ?, is_active = ?
    WHERE code = ?
  `);
  stmt.run(Math.max(0, Number(home_price)), Math.max(0, Number(office_price)), is_active ? 1 : 0, code);
  return getWilayaByCode(code);
}
function bulkUpdateWilayas(wilayasList) {
  db.exec("BEGIN TRANSACTION;");
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
        w.is_active !== void 0 ? w.is_active ? 1 : 0 : null,
        w.code
      );
    }
    db.exec("COMMIT;");
    return getAllWilayas();
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
function createOrder(data) {
  if (!data.items || data.items.length === 0) {
    throw new Error("\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0631\u063A\u0629\u060C \u064A\u0631\u062C\u0649 \u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C\u0627\u062A \u0642\u0628\u0644 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628");
  }
  const wilaya = getWilayaByCode(data.customer.wilaya_code);
  if (!wilaya) {
    throw new Error("\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0648\u0644\u0627\u064A\u0629 \u0635\u0627\u0644\u062D\u0629 \u0645\u0646 \u0648\u0644\u0627\u064A\u0627\u062A \u0627\u0644\u062C\u0632\u0627\u0626\u0631");
  }
  const settings = getStoreSettings();
  let subtotal = 0;
  const verifiedItems = [];
  for (const item of data.items) {
    const product = getProductById(Number(item.productId));
    if (!product) {
      throw new Error(`\u0627\u0644\u0645\u0646\u062A\u062C \u0631\u0642\u0645 ${item.productId} \u0644\u0645 \u064A\u0639\u062F \u0645\u062A\u0648\u0641\u0631\u0627\u064B \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631`);
    }
    const qty = Math.max(1, parseInt(String(item.quantity), 10));
    const itemPrice = Number(product.salePrice ?? product.price);
    subtotal += itemPrice * qty;
    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      price: itemPrice,
      quantity: qty
    });
  }
  let deliveryPrice = data.customer.delivery_type === "office" ? wilaya.office_price : wilaya.home_price;
  if (settings.freeShippingEnabled && subtotal >= settings.freeShippingThreshold) {
    deliveryPrice = 0;
  }
  const totalAmount = subtotal + deliveryPrice;
  db.exec("BEGIN TRANSACTION;");
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
      (data.customer.notes || "").trim(),
      wilaya.code,
      wilaya.name_ar,
      data.customer.delivery_type || "home",
      deliveryPrice,
      subtotal,
      totalAmount,
      "\u062C\u062F\u064A\u062F"
    );
    const orderId = Number(orderRes.lastInsertRowid);
    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const vItem of verifiedItems) {
      insertItemStmt.run(orderId, vItem.productId, vItem.productName, vItem.price, vItem.quantity);
    }
    db.exec("COMMIT;");
    return getOrderById(orderId);
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
function getOrderById(id) {
  const orderStmt = db.prepare("SELECT * FROM orders WHERE id = ?");
  const order = orderStmt.get(id);
  if (!order) return null;
  const itemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  order.items = itemsStmt.all(id);
  return order;
}
function getOrdersByPhone(phone) {
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, "");
  const ordersStmt = db.prepare(`
    SELECT * FROM orders 
    WHERE customer_phone LIKE ? 
       OR REPLACE(REPLACE(customer_phone, ' ', ''), '-', '') LIKE ?
    ORDER BY id DESC
  `);
  const pattern = `%${cleanPhone.slice(-8)}%`;
  const orders = ordersStmt.all(pattern, pattern);
  const itemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  for (const o of orders) {
    o.items = itemsStmt.all(o.id);
  }
  return orders;
}
function getAllOrders() {
  const ordersStmt = db.prepare("SELECT * FROM orders ORDER BY id DESC");
  const orders = ordersStmt.all();
  const itemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  for (const o of orders) {
    o.items = itemsStmt.all(o.id);
  }
  return orders;
}
function updateOrderStatus(orderId, newStatus) {
  const order = getOrderById(orderId);
  if (!order) return null;
  const oldStatus = order.status;
  if (oldStatus === newStatus) return order;
  db.exec("BEGIN TRANSACTION;");
  try {
    const updateStmt = db.prepare(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    updateStmt.run(newStatus, orderId);
    db.exec("COMMIT;");
    return getOrderById(orderId);
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
function deleteOrder(orderId) {
  db.exec("BEGIN TRANSACTION;");
  try {
    db.prepare("DELETE FROM order_items WHERE order_id = ?").run(orderId);
    const info = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);
    db.exec("COMMIT;");
    return info.changes > 0;
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
function deleteFinishedOrders() {
  db.exec("BEGIN TRANSACTION;");
  try {
    const finished = db.prepare("SELECT id FROM orders WHERE status IN ('\u0645\u0643\u062A\u0645\u0644', '\u0645\u0644\u063A\u064A')").all();
    const ids = finished.map((f) => f.id);
    if (ids.length > 0) {
      const deleteItems = db.prepare("DELETE FROM order_items WHERE order_id = ?");
      const deleteOrd = db.prepare("DELETE FROM orders WHERE id = ?");
      for (const id of ids) {
        deleteItems.run(id);
        deleteOrd.run(id);
      }
    }
    db.exec("COMMIT;");
    return ids.length;
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
function getStats() {
  const totalSalesStmt = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != '\u0645\u0644\u063A\u064A'");
  const totalOrdersStmt = db.prepare("SELECT COUNT(*) as count FROM orders");
  const pendingOrdersStmt = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = '\u062C\u062F\u064A\u062F'");
  const totalProductsStmt = db.prepare("SELECT COUNT(*) as count FROM products");
  return {
    totalSales: totalSalesStmt.get().total,
    totalOrders: totalOrdersStmt.get().count,
    pendingOrders: pendingOrdersStmt.get().count,
    totalProducts: totalProductsStmt.get().count
  };
}
function getStoreSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const map = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return {
    primaryColor: map["primary_color"] || "#059669",
    currency: "\u062F.\u062C",
    // Strictly Algerian Dinar
    announcement: map["announcement"] || "\u062A\u0648\u0635\u064A\u0644 \u0645\u062A\u0648\u0641\u0631 \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u0627\u0644\u0640 58 \u0648\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645!",
    freeShippingEnabled: map["free_shipping_enabled"] === "1" || map["free_shipping_enabled"] === "true",
    freeShippingThreshold: Number(map["free_shipping_threshold"] || 15e3)
  };
}
function updateStoreSettings(settings) {
  if (settings.primaryColor !== void 0) {
    setSettingStmt.run("primary_color", settings.primaryColor.trim() || "#059669");
  }
  if (settings.announcement !== void 0) {
    setSettingStmt.run("announcement", settings.announcement.trim());
  }
  if (settings.freeShippingEnabled !== void 0) {
    setSettingStmt.run("free_shipping_enabled", settings.freeShippingEnabled ? "1" : "0");
  }
  if (settings.freeShippingThreshold !== void 0) {
    setSettingStmt.run("free_shipping_threshold", String(Math.max(0, Number(settings.freeShippingThreshold))));
  }
  return getStoreSettings();
}

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
var ADMIN_PASSWORD = "demo360";
var productResponseCache = /* @__PURE__ */ new Map();
var clearProductCache = () => productResponseCache.clear();
var ADMIN_TOKEN = "demo360_session_authorized";
app.use(import_express.default.json({ limit: "25mb" }));
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = ((body) => {
    const acceptsGzip = String(req.headers["accept-encoding"] || "").includes("gzip");
    if (!acceptsGzip) return originalJson(body);
    const payload = (0, import_node_zlib.gzipSync)(Buffer.from(JSON.stringify(body)));
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Vary", "Accept-Encoding");
    return res.end(payload);
  });
  next();
});
process.on("uncaughtException", (error) => console.error("[server] uncaught exception", error));
process.on("unhandledRejection", (error) => console.error("[server] unhandled rejection", error));
function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644: \u064A\u062A\u0637\u0644\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0643\u0645\u0633\u0624\u0648\u0644" });
  }
  next();
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/settings", (req, res) => {
  try {
    const settings = getStoreSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A" });
  }
});
app.get("/api/categories", (req, res) => {
  try {
    res.json(getAllCategories());
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A" });
  }
});
app.get("/api/wilayas", (req, res) => {
  try {
    const wilayas = getAllWilayas();
    res.json(wilayas);
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A" });
  }
});
app.get("/api/products", (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const cacheKey = JSON.stringify({ category: category || "", search: search || "", sort: sort || "" });
    const cached = productResponseCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return res.json(cached.data);
    const products = getAllProducts({ category, search, sort }, false);
    productResponseCache.set(cacheKey, { expires: Date.now() + 5e3, data: products });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" });
  }
});
app.get("/api/products/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "\u0645\u0639\u0631\u0641 \u0627\u0644\u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0635\u0627\u0644\u062D" });
    }
    const product = getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
    }
    const similar = getAllProducts({ category: product.category }, false).filter((p) => p.id !== product.id).slice(0, 4);
    res.json({ ...product, similar });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C" });
  }
});
app.post("/api/orders", (req, res) => {
  try {
    const { customer, items } = req.body;
    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.wilaya_code) {
      return res.status(400).json({ error: "\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644 \u0643\u0627\u0645\u0644\u0629 (\u0627\u0644\u0627\u0633\u0645\u060C \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641\u060C \u0627\u0644\u0648\u0644\u0627\u064A\u0629\u060C \u0627\u0644\u0639\u0646\u0648\u0627\u0646)" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "\u0633\u0644\u0629 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0641\u0627\u0631\u063A\u0629" });
    }
    const order = createOrder({ customer, items });
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message || "\u062A\u0639\u0630\u0631 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628" });
  }
});
app.get("/api/track", (req, res) => {
  try {
    const phone = req.query.phone;
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0635\u062D\u064A\u062D \u0644\u0644\u0628\u062D\u062B \u0639\u0646 \u0637\u0644\u0628\u0627\u062A\u0643" });
    }
    const orders = getOrdersByPhone(phone);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u0637\u0644\u0628\u0627\u062A" });
  }
});
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password || String(password).trim() !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" });
  }
  res.json({
    success: true,
    token: ADMIN_TOKEN,
    message: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D"
  });
});
app.get("/api/admin/stats", requireAdmin, (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A" });
  }
});
app.get("/api/admin/orders", requireAdmin, (req, res) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0637\u0644\u0628\u0627\u062A" });
  }
});
app.patch("/api/admin/orders/:id/status", requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const valid = ["\u062C\u062F\u064A\u062F", "\u0642\u064A\u062F \u0627\u0644\u062A\u062C\u0647\u064A\u0632", "\u062A\u0645 \u0627\u0644\u0634\u062D\u0646", "\u0645\u0643\u062A\u0645\u0644", "\u0645\u0644\u063A\u064A"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "\u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629" });
    }
    const order = updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ error: "\u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628" });
  }
});
app.delete("/api/admin/orders/:id", requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ok = deleteOrder(id);
    if (!ok) {
      return res.status(404).json({ error: "\u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062A\u0645 \u062D\u0630\u0641\u0647 \u0645\u0633\u0628\u0642\u0627\u064B" });
    }
    res.json({ success: true, message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062C\u0627\u062D" });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628" });
  }
});
app.post("/api/admin/orders/delete-finished", requireAdmin, (req, res) => {
  try {
    const count = deleteFinishedOrders();
    res.json({ success: true, count, message: `\u062A\u0645 \u062D\u0630\u0641 ${count} \u0637\u0644\u0628 \u0645\u0646\u062A\u0647\u064A \u0628\u0646\u062C\u0627\u062D` });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0646\u062A\u0647\u064A\u0629" });
  }
});
app.get("/api/admin/wilayas", requireAdmin, (req, res) => {
  try {
    const wilayas = getAllWilayas();
    res.json(wilayas);
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A" });
  }
});
app.put("/api/admin/wilayas/:code", requireAdmin, (req, res) => {
  try {
    const code = parseInt(req.params.code, 10);
    const { home_price, office_price, is_active } = req.body;
    const updated = updateWilayaPrice(code, home_price, office_price, is_active);
    res.json({ success: true, wilaya: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0633\u0639\u0631 \u0627\u0644\u0648\u0644\u0627\u064A\u0629" });
  }
});
app.put("/api/admin/wilayas-bulk", requireAdmin, (req, res) => {
  try {
    const { wilayas } = req.body;
    if (!Array.isArray(wilayas)) {
      return res.status(400).json({ error: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629" });
    }
    const result = bulkUpdateWilayas(wilayas);
    res.json({ success: true, wilayas: result });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u062C\u0645\u0627\u0639\u064A \u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0648\u0644\u0627\u064A\u0627\u062A" });
  }
});
app.post("/api/admin/categories", requireAdmin, (req, res) => {
  try {
    const category = createCategory(req.body?.name);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062A\u0635\u0646\u064A\u0641" });
  }
});
app.patch("/api/admin/categories/:name", requireAdmin, (req, res) => {
  try {
    const category = renameCategory(decodeURIComponent(req.params.name), req.body?.name);
    res.json({ success: true, category });
  } catch (err) {
    res.status(400).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0635\u0646\u064A\u0641" });
  }
});
app.delete("/api/admin/categories/:name", requireAdmin, (req, res) => {
  try {
    const deleted = deleteCategory(decodeURIComponent(req.params.name));
    res.json({ success: deleted, message: deleted ? "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062A\u0635\u0646\u064A\u0641" : "\u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
  } catch (err) {
    res.status(400).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u062A\u0635\u0646\u064A\u0641" });
  }
});
app.post("/api/admin/products", requireAdmin, (req, res) => {
  try {
    const { name, price, description, category, images, image, badge, discountPrice, discountEnabled, discountStart, discountEnd } = req.body;
    if (!name || price === void 0) {
      return res.status(400).json({ error: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u0633\u0639\u0631\u0647 \u0645\u0637\u0644\u0648\u0628\u0627\u0646" });
    }
    const finalCategory = String(category || "\u0627\u0644\u0643\u0624\u0648\u0633").trim() || "\u0627\u0644\u0643\u0624\u0648\u0633";
    let finalImages = [];
    if (Array.isArray(images) && images.length > 0) {
      finalImages = images.filter((value) => typeof value === "string" && (value.startsWith("data:image/") || value.startsWith("http://") || value.startsWith("https://"))).slice(0, 6);
    } else if (typeof image === "string" && image) {
      finalImages = [image];
    }
    const product = createProduct({
      name,
      price: Number(price),
      description: description || "",
      category: finalCategory,
      images: finalImages,
      badge: badge || "",
      discountPrice: Number(discountPrice || 0),
      discountEnabled: Boolean(discountEnabled),
      discountStart: discountStart || "",
      discountEnd: discountEnd || ""
    });
    clearProductCache();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C" });
  }
});
app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = updateProduct(id, req.body);
    if (!product) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
    }
    clearProductCache();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0646\u062A\u062C" });
  }
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const ok = deleteProduct(id);
    if (!ok) {
      return res.status(404).json({ error: "\u0627\u0644\u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u062A\u0645 \u062D\u0630\u0641\u0647 \u0645\u0633\u0628\u0642\u0627\u064B" });
    }
    clearProductCache();
    res.json({ success: true, message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C \u0628\u0646\u062C\u0627\u062D" });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C" });
  }
});
app.post("/api/admin/products/reset", requireAdmin, (req, res) => {
  try {
    const products = resetProducts();
    res.json({ success: true, products, message: "\u062A\u0645 \u0645\u0633\u062D \u0648\u0625\u0639\u0627\u062F\u0629 \u0625\u0646\u0634\u0627\u0621 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u0646\u062C\u0627\u062D" });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" });
  }
});
app.put("/api/admin/settings", requireAdmin, (req, res) => {
  try {
    const updated = updateStoreSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "\u062E\u0637\u0623 \u0641\u064A \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A" });
  }
});
app.use((err, req, res, next) => {
  console.error("[server] request error", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ success: false, error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u062F\u0627\u062E\u0644\u064A \u0641\u064A \u0627\u0644\u062E\u0627\u062F\u0645" });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}
if (process.env.NETLIFY !== "true") {
  start();
}

// ../../../tmp/api-entry.ts
var import_serverless_http = __toESM(require("serverless-http"));
var handler = (0, import_serverless_http.default)(app);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
