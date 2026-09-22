import React, { useState, useEffect } from 'react';
import { Coffee, Box, Filter } from 'lucide-react';
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
import { SearchPage } from './components/SearchPage';

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
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Filters (Categories restricted to exactly 'ALL', 'الكؤوس', 'البوكسات')
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

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

  // Fetch initial store settings and categories
  useEffect(() => {
    Promise.all([api.getSettings(), api.getCategories()])
      .then(([settingsRes, categoriesRes]) => { setSettings(settingsRes); setCategories(categoriesRes); })
      .catch(() => {});
  }, []);

  // Fetch products with filters
  useEffect(() => {
    if (currentPath !== '/' ) {
      setIsLoadingProducts(false);
      return;
    }
    setIsLoadingProducts(true);
    api.getProducts({
      category: selectedCategory,
      search: searchQuery,
      sort: sortBy
    })
      .then(res => setProducts(res))
      .catch(() => {})
      .finally(() => setIsLoadingProducts(false));
  }, [currentPath, selectedCategory, searchQuery, sortBy]);

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
        onOpenCart={() => navigateTo('/cart')}
        onOpenSearch={() => navigateTo('/search')}
      />

      {/* المحتوى الرئيسي حسب المسار */}
      <main className="flex-1 flex flex-col">
        {/* صفحة تتبع الطلب برقم الهاتف */}
        {currentPath === '/cart' || currentPath === '/checkout' ? null : currentPath === '/search' ? (
          <SearchPage settings={settings} onBack={() => navigateTo('/')} onOpenProduct={p => navigateTo(`/product/${p.id}`)} />
        ) : currentPath === '/track' ? (
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
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full space-y-5 sm:space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-sm">
              <div className="min-h-[300px] max-w-4xl space-y-5 text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs font-bold text-amber-800">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Glass Glow · Premium Tableware</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-slate-950">
                  تشكيلات راقية من الكؤوس والبوكسات الملكية
                </h1>
                <p className="text-sm leading-relaxed text-slate-600">
                  استمتع بأفضل تجربة قهوة وشاي مع خامات سيراميك وزجاج حراري فاخر. نوفر خدمة التوصيل السريع إلى باب منزلك أو مكتب التوصيل لكافة ولايات الجزائر الـ 58 مع الدفع عند الاستلام.
                </p>
              </div>
            </section>

            {/* أدوات التصفية للفئات المتاحة */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              {/* تبويبات الفئات: فقط الكؤوس والبوكسات */}
              <div className="flex items-center gap-2 w-full sm:w-auto min-w-0 overflow-x-auto pb-1 sm:pb-0 snap-x snap-mandatory scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 snap-start ${
                    selectedCategory === 'ALL'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>جميع المنتجات</span>
                </button>

                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 snap-start ${
                      selectedCategory === category ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{category}</span>
                  </button>
                ))}
              </div>

              {/* الترتيب حسب السعر والتقييم */}
              <div className="flex w-full items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs sm:w-auto sm:justify-end sm:border-0 sm:pt-0">
                <div className="flex items-center gap-2 text-slate-500"><Filter className="h-4 w-4 text-emerald-700" /><span className="font-bold">ترتيب حسب</span></div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="h-10 min-w-36 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 cursor-pointer"
                >
                  <option value="default">الأحدث إضافة</option>
                  <option value="price-asc">الأقل سعراً</option>
                  <option value="price-desc">الأعلى سعراً</option>
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
            isPage={currentPath === '/cart'}
            onNavigateCheckout={() => navigateTo('/checkout')}
            onClosePage={() => navigateTo('/')}
          />

      {/* نافذة تأكيد الطلب بنظام الدفع عند الاستلام */}
      <CheckoutModal
          settings={settings}
          onOrderSuccess={() => {}}
          isPage={currentPath === '/checkout'}
          onClosePage={() => navigateTo('/')}
      />

      {/* التذييل */}
      {currentPath === '/' && <Footer settings={settings} />}
    </div>
  );
}
