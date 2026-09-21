import React, { useState, useEffect } from 'react';
import { Coffee, Box, Truck, ShieldCheck, Sparkles, Filter, ChevronLeft } from 'lucide-react';
import { Product, StoreSettings } from './types';
import { api } from './lib/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { OrderTracking } from './components/OrderTracking';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  // Navigation / View state
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(() => {
    const match = window.location.pathname.match(/^\/product\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  });

  // Store data
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Filters (Categories restricted to exactly 'ALL', 'الكؤوس', 'البوكسات')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'الكؤوس' | 'البوكسات'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Handle browser popstate
  useEffect(() => {
    const onLocationChange = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      const match = path.match(/^\/product\/(\d+)/);
      if (match) {
        setSelectedProductId(parseInt(match[1], 10));
      } else {
        setSelectedProductId(null);
      }
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Sync navigation helper
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    const match = path.match(/^\/product\/(\d+)/);
    if (match) {
      setSelectedProductId(parseInt(match[1], 10));
    } else {
      setSelectedProductId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial store settings
  useEffect(() => {
    api.getSettings()
      .then(res => setSettings(res))
      .catch(() => {});
  }, []);

  // Fetch products with filters
  useEffect(() => {
    setIsLoadingProducts(true);
    api.getProducts({
      category: selectedCategory,
      search: searchQuery,
      sort: sortBy
    })
      .then(res => setProducts(res))
      .catch(() => {})
      .finally(() => setIsLoadingProducts(false));
  }, [selectedCategory, searchQuery, sortBy]);

  // If the path is /admin, ONLY show the AdminPanel (no buttons in the UI lead to it)
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminPanel />;
  }

  const currency = settings?.currency || 'د.ج';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* الترويسة الرئيسية الخالية من أي أزرار للأدمن */}
      <Header
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateHome={() => navigateTo('/')}
        onOpenTracking={() => navigateTo('/track')}
      />

      {/* المحتوى الرئيسي حسب المسار */}
      <main className="flex-1 flex flex-col">
        {/* صفحة تتبع الطلب برقم الهاتف */}
        {currentPath === '/track' ? (
          <OrderTracking
            onBack={() => navigateTo('/')}
            settings={settings}
          />
        ) : selectedProductId !== null ? (
          /* صفحة تفاصيل المنتج المستقلة الخاصة بكل منتج */
          <ProductPage
            productId={selectedProductId}
            onBack={() => navigateTo('/')}
            onSelectProduct={p => navigateTo(`/product/${p.id}`)}
            settings={settings}
          />
        ) : (
          /* واجهة المتجر الرئيسية والكتالوج الجزائري */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
            {/* لافتة الترحيب والتسوق الجزائرية */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-12 shadow-lg">
              <div className="relative z-10 max-w-2xl text-right space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>المتجر الجزائري الأول للكؤوس الفاخرة وبوكسات الهدايا</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                  تشكيلات راقية من الكؤوس والبوكسات الملكية
                </h1>
                <p className="text-sm text-emerald-100 leading-relaxed max-w-xl">
                  استمتع بأفضل تجربة قهوة وشاي مع خامات سيراميك وزجاج حراري فاخر. نوفر خدمة التوصيل السريع إلى باب منزلك أو مكتب التوصيل لكافة ولايات الجزائر الـ 58 مع الدفع عند الاستلام.
                </p>

                {/* خيار الشحن المجاني الترويجي إن كان مفعلاً */}
                {settings?.freeShippingEnabled && (
                  <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-white/15 backdrop-blur-xs text-xs font-bold border border-white/25">
                    <Truck className="w-4 h-4 text-emerald-300" />
                    <span>توصيل مجاني 100% لجميع الطلبات التي تتجاوز {settings.freeShippingThreshold.toLocaleString('fr-DZ')} {currency}!</span>
                  </div>
                )}
              </div>

              {/* عناصر ديكورية ناعمة */}
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-1/3 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* أدوات التصفية: مقتصرة تماماً على فئتي (الكؤوس) و (البوكسات) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* تبويبات الفئات: فقط الكؤوس والبوكسات */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>جميع المنتجات</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('الكؤوس')}
                  className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'الكؤوس'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>الكؤوس (الأكواب الفردية)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('البوكسات')}
                  className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'البوكسات'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <span>البوكسات (مجموعات الأكواب)</span>
                </button>
              </div>

              {/* الترتيب حسب السعر والتقييم */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 font-medium">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-xs font-bold text-slate-900 outline-none cursor-pointer"
                >
                  <option value="default">الأحدث إضافة</option>
                  <option value="price-asc">الأقل سعراً</option>
                  <option value="price-desc">الأعلى سعراً</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {/* شبكة عرض المنتجات */}
            {isLoadingProducts ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center">
                <div className="w-9 h-9 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-3" />
                <span className="text-xs text-slate-500 font-medium">جاري تحميل المنتجات...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
                <Coffee className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-900 text-base">لا توجد منتجات مطابقة للبحث</h3>
                <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى أو اختر فئة مختلفة</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    currency={currency}
                    onOpenProductPage={p => navigateTo(`/product/${p.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* سلة المشتريات الجانبية */}
      <CartDrawer
        currency={currency}
        onNavigateShopping={() => navigateTo('/')}
      />

      {/* نافذة تأكيد الطلب بنظام الدفع عند الاستلام */}
      <CheckoutModal
        settings={settings}
        onOrderSuccess={() => {}}
      />

      {/* التذييل */}
      <Footer settings={settings} />
    </div>
  );
}
