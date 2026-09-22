import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, DollarSign, Settings, LogOut, Plus, Trash2,
  Edit2, Save, X, Eye, Truck, Check, AlertCircle, RefreshCw, Upload, Images, Menu
} from 'lucide-react';
import { Product, Order, StoreSettings, AdminStats, Wilaya } from '../types';
import { api } from '../lib/api';
import { BrandMark } from './BrandMark';

export const AdminPanel: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token_dz'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'wilayas' | 'settings'>(() => {
    const part = window.location.pathname.split('/')[2];
    return part === 'products' || part === 'categories' || part === 'wilayas' || part === 'settings' ? part : 'orders';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductPage, setIsProductPage] = useState(() => window.location.pathname === '/admin/products/new');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // حالة إضافة/تعديل منتج (مع صور متعددة)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productImagesInput, setProductImagesInput] = useState<string[]>([]);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // حالة البحث والتصفية للولايات
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [isSavingWilayas, setIsSavingWilayas] = useState(false);

  // إشعار
  const navigateAdmin = (tab: 'orders' | 'products' | 'categories' | 'wilayas' | 'settings') => {
    window.history.pushState({}, '', `/admin/${tab}`);
    setActiveTab(tab);
    setIsProductPage(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      const part = window.location.pathname.split('/')[2];
      setIsProductPage(window.location.pathname === '/admin/products/new');
      setActiveTab(part === 'products' || part === 'categories' || part === 'wilayas' || part === 'settings' ? part : 'orders');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    setLoginError('');

    try {
      const res = await api.adminLogin(password);
      if (res.success && res.token) {
        localStorage.setItem('admin_token_dz', res.token);
        setToken(res.token);
        setPassword('');
      }
    } catch (err: any) {
      setLoginError(err.message || 'كلمة المرور غير صحيحة');
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token_dz');
    setToken(null);
  };

  // جلب البيانات
  const loadAdminData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [s, ords, prods, categoryList, wils, setts] = await Promise.all([
        api.getAdminStats(token),
        api.getAdminOrders(token),
        api.getProducts(),
        api.getCategories(),
        api.getAdminWilayas(token),
        api.getSettings()
      ]);
      setStats(s);
      setOrders(ords);
      setProducts(prods);
      setCategories(categoryList);
      setWilayas(wils);
      setSettings(setts);
    } catch (err: any) {
      if (err.message?.includes('غير مصرح') || err.message?.includes('401')) {
        handleLogout();
      } else {
        notify('حدث خطأ أثناء تحميل البيانات', 'error');
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handleDeleteFinishedOrders = async () => {
    if (!token || !confirm('هل تريد حذف جميع الطلبات المكتملة والملغاة؟')) return;
    try {
      const res = await api.deleteFinishedOrders(token);
      setOrders(prev => prev.filter(order => order.status !== 'مكتمل' && order.status !== 'ملغي'));
      notify(res.message || 'تم حذف الطلبات المنتهية بنجاح');
      await loadAdminData();
    } catch (err: any) {
      notify(err.message || 'فشل حذف الطلبات المنتهية', 'error');
    }
  };

  // تحديث حالة الطلب
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    if (!token) return;
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, token);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
        notify(`تم تحديث حالة الطلب #${orderId} إلى: ${newStatus}`);
      }
    } catch (err: any) {
      notify(err.message || 'فشل تحديث الطلب', 'error');
    }
  };

  // فتح نموذج المنتج
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct({ ...product });
      const imgs = product.images && product.images.length > 0 ? product.images : [product.image || ''];
      setProductImagesInput(imgs);
    } else {
      window.history.pushState({}, '', '/admin/products/new');
      setIsProductPage(true);
      setEditingProduct({
        name: '',
        price: 2500,
        description: '',
        category: categories[0] || 'الكؤوس',
        badge: '',
        discountPrice: 0,
        discountEnabled: false,
        discountStart: '',
        discountEnd: ''
      });
      setProductImagesInput(['']);
    }
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 6);
    Promise.all(selected.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('تعذر قراءة الصورة'));
      reader.readAsDataURL(file);
    }))).then(images => setProductImagesInput(images)).catch(() => notify('تعذر قراءة إحدى الصور', 'error'));
  };

  // حفظ المنتج
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProduct) return;

    const validImages = productImagesInput.filter(Boolean);
    if (validImages.length === 0) {
      notify('يرجى اختيار صورة واحدة على الأقل للمنتج', 'error');
      return;
    }

    setIsSubmittingProduct(true);
    try {
      const payload = {
        ...editingProduct,
        images: validImages,
        image: validImages[0]
      };

      if (editingProduct.id) {
        const res = await api.updateProduct(editingProduct.id, payload, token);
        if (res.success) {
          notify('تم تعديل المنتج بنجاح');
          setProducts(prev => prev.map(p => p.id === res.product.id ? res.product : p));
          setEditingProduct(null); setIsProductPage(false); window.history.pushState({}, '', '/admin/products');
        }
      } else {
        const res = await api.createProduct(payload, token);
        if (res.success) {
          notify('تمت إضافة المنتج الجديد بنجاح');
          setProducts(prev => [res.product, ...prev]);
          setEditingProduct(null); setIsProductPage(false); window.history.pushState({}, '', '/admin/products');
        }
      }
    } catch (err: any) {
      notify(err.message || 'فشل حفظ المنتج', 'error');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!token || !newCategory.trim()) return;
    try {
      const res = await api.createCategory(newCategory.trim(), token);
      setCategories(prev => prev.includes(res.category) ? prev : [...prev, res.category]);
      setNewCategory('');
      notify('تمت إضافة التصنيف بنجاح');
    } catch (err: any) { notify(err.message || 'فشل إضافة التصنيف', 'error'); }
  };

  const handleRenameCategory = async (category: string) => {
    if (!token) return;
    const nextName = window.prompt('اكتب الاسم الجديد للتصنيف', category)?.trim();
    if (!nextName || nextName === category) return;
    try {
      const res = await api.renameCategory(category, nextName, token);
      setCategories(prev => prev.map(item => item === category ? res.category : item));
      setProducts(prev => prev.map(product => product.category === category ? { ...product, category: res.category } : product));
      notify('تم تعديل التصنيف بنجاح');
    } catch (err: any) { notify(err.message || 'فشل تعديل التصنيف', 'error'); }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!token || !confirm(`هل تريد حذف تصنيف "${category}"؟ يجب ألا يحتوي على منتجات.`)) return;
    try {
      await api.deleteCategory(category, token);
      setCategories(prev => prev.filter(item => item !== category));
      notify('تم حذف التصنيف بنجاح');
    } catch (err: any) { notify(err.message || 'فشل حذف التصنيف', 'error'); }
  };

  // حذف منتج
  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    if (!confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟')) return;

    try {
      const res = await api.deleteProduct(id, token);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        notify('تم حذف المنتج بنجاح');
      }
    } catch (err: any) {
      notify(err.message || 'فشل حذف المنتج', 'error');
    }
  };

  // تحديث أسعار الولايات
  const handleWilayaPriceChange = (code: number, field: 'home_price' | 'office_price', value: string) => {
    const num = Math.max(0, Number(value) || 0);
    setWilayas(prev => prev.map(w => w.code === code ? { ...w, [field]: num } : w));
  };

  const handleSaveAllWilayas = async () => {
    if (!token) return;
    setIsSavingWilayas(true);
    try {
      const list = wilayas.map(w => ({
        code: w.code,
        home_price: w.home_price,
        office_price: w.office_price,
        is_active: w.is_active ? 1 : 0
      }));
      const res = await api.bulkUpdateWilayas(list, token);
      if (res.success) {
        setWilayas(res.wilayas);
        notify('تم حفظ أسعار التوصيل لجميع الولايات بنجاح');
      }
    } catch (err: any) {
      notify(err.message || 'فشل حفظ أسعار الولايات', 'error');
    } finally {
      setIsSavingWilayas(false);
    }
  };

  // حفظ الإعدادات والشحن المجاني
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !settings) return;

    try {
      const res = await api.updateSettings(settings, token);
      if (res.success) {
        setSettings(res.settings);
        notify('تم حفظ إعدادات المتجر والشحن المجاني بنجاح');
      }
    } catch (err: any) {
      notify(err.message || 'فشل حفظ الإعدادات', 'error');
    }
  };

  // شاشة تسجيل الدخول إن لم يكن مسجلاً
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-right">
          <BrandMark className="w-14 h-14 rounded-2xl mx-auto mb-6" />

          <h2 className="text-xl font-bold text-slate-900 text-center mb-1">
            لوحة تحكم المتجر الجزائري
          </h2>
          <p className="text-xs text-slate-500 text-center mb-6">
            يرجى إدخال كلمة مرور الإدارة للمتابعة
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-slate-900 outline-none text-sm"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {isLoadingLogin ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>دخول لوحة التحكم</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <a
              href="/"
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              ← العودة لمتجر الزبائن
            </a>
          </div>
        </div>
      </div>
    );
  }

  const filteredWilayas = wilayas.filter(w =>
    w.name_ar.includes(wilayaSearch) ||
    w.name_en.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
    String(w.code).includes(wilayaSearch)
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 text-right">
      {/* الترويسة العلوية للوحة التحكم */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="w-9 h-9 rounded-xl" />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
                لوحة إدارة Glass Glow
              </h1>
              <span className="text-[11px] text-slate-400 block">
                إدارة Glass Glow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsMenuOpen(v => !v)} className="md:hidden h-9 w-9 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-center" aria-label="فتح قائمة الإدارة">
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden md:flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">معاينة واجهة المتجر</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل خروج</span>
            </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden border-t border-slate-100 bg-white p-3 space-y-1">
            {([['orders', 'إدارة الطلبات'], ['products', 'إدارة المنتجات'], ['categories', 'إدارة التصنيفات'], ['wilayas', 'أسعار التوصيل'], ['settings', 'إعدادات المتجر']] as const).map(([tab, label]) => (
              <button key={tab} type="button" onClick={() => navigateAdmin(tab)} className={`w-full rounded-xl px-4 py-3 text-right text-sm font-bold ${activeTab === tab ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-50'}`}>{label}</button>
            ))}
          </nav>
        )}
      </header>

      {/* رسالة النجاح أو التنبيه */}
      {statusMessage && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top ${
          statusMessage.type === 'success' ? 'bg-emerald-700 text-white' : 'bg-rose-600 text-white'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* بطاقات الإحصائيات الحية */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">إجمالي المبيعات (COD)</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">{stats.totalSales.toLocaleString('fr-DZ')}</span>
                <span className="text-xs font-bold text-emerald-700">د.ج</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">إجمالي الطلبات</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.totalOrders}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">طلبات جديدة قيد المراجعة</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.pendingOrders}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">عدد المنتجات</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.totalProducts}</span>
            </div>
          </div>
        )}

        {/* أشرطة التبويب الرئيسية للوحة التحكم */}
        <div className="hidden md:flex bg-white rounded-2xl border border-slate-200 p-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => navigateAdmin('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>إدارة الطلبات</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{orders.length}</span>
            )}
          </button>

          <button
            onClick={() => navigateAdmin('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'products' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة المنتجات</span>
          </button>

          <button
            onClick={() => navigateAdmin('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'categories' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إدارة التصنيفات</span>
          </button>

          <button
            onClick={() => navigateAdmin('wilayas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'wilayas' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>أسعار التوصيل</span>
          </button>

          <button
            onClick={() => navigateAdmin('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'settings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات المتجر</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* تبويب 1: إدارة الطلبات */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">سجل الطلبات الواردة</h3>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleDeleteFinishedOrders} className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف الطلبات المنتهية</span>
                </button>
                <button
                  onClick={loadAdminData}
                  disabled={isLoadingData}
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-xl"
                  title="تحديث البيانات"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">العميل والهاتف</th>
                    <th className="p-4">الولاية ونوع التوصيل</th>
                    <th className="p-4">المنتجات</th>
                    <th className="p-4">المبلغ الإجمالي</th>
                    <th className="p-4">حالة الطلب</th>
                    <th className="p-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        لا توجد طلبات مسجلة حتى الآن
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-extrabold text-slate-900">#{order.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                          <span className="text-slate-500 font-mono" dir="ltr">{order.customer_phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block">ولاية {order.wilaya_name || `رقم ${order.wilaya_code}`}</span>
                          <span className="text-[11px] text-slate-500">
                            {order.delivery_type === 'office' ? 'مكتب توصيل' : 'لباب المنزل'} ({order.delivery_price === 0 ? 'مجاني' : `${order.delivery_price} د.ج`})
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 max-w-xs">
                            {order.items?.map(it => (
                              <div key={it.id} className="text-[11px] text-slate-700 truncate">
                                • {it.quantity}x {it.product_name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-emerald-700 text-sm">
                            {order.total_amount?.toLocaleString('fr-DZ')} د.ج
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold outline-none cursor-pointer bg-white"
                          >
                            <option value="جديد">جديد</option>
                            <option value="قيد التجهيز">قيد التجهيز</option>
                            <option value="تم الشحن">تم الشحن</option>
                            <option value="مكتمل">مكتمل</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">
                          {new Date(order.created_at).toLocaleDateString('ar-DZ')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* تبويب إدارة التصنيفات */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">إدارة تصنيفات المتجر</h3>
              <p className="text-xs text-slate-500 mt-1">أضف تصنيفات جديدة وستظهر مباشرة في شريط التصنيفات بالمتجر.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="مثال: أكواب حرارية" className="flex-1 px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-600" />
              <button type="button" onClick={handleCreateCategory} className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold">إضافة التصنيف</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(category => <div key={category} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100"><span className="text-emerald-800 text-xs font-bold">{category}</span><div className="flex items-center gap-1"><button type="button" onClick={() => handleRenameCategory(category)} className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-white" title="تعديل التصنيف"><Edit2 className="w-3.5 h-3.5" /></button><button type="button" onClick={() => handleDeleteCategory(category)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-white" title="حذف التصنيف"><Trash2 className="w-3.5 h-3.5" /></button></div></div>)}
            </div>
          </div>
        )}

        {/* تبويب 2: إدارة المنتجات */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">كتالوج المنتجات</h3>
                <p className="text-xs text-slate-500">أضف منتجاتك وصنّفها كما تريد</p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map(prod => {
                const imgs = prod.images && prod.images.length > 0 ? prod.images : [prod.image || ''];
                return (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="aspect-4/3 rounded-xl bg-slate-100 overflow-hidden relative mb-3">
                        <img src={imgs[0]} alt={prod.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {prod.category}
                        </span>
                        {imgs.length > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                            <Images className="w-3 h-3" />
                            <span>{imgs.length} صور</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{prod.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 text-base">{prod.price.toLocaleString('fr-DZ')}</span>
                        <span className="text-xs font-bold text-emerald-700 mr-1">د.ج</span>
                        {prod.salePrice !== undefined && prod.salePrice < prod.price && <span className="text-[11px] text-emerald-700 block">سعر خاص</span>}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenProductModal(prod)}
                          className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-lg"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* تبويب 3: أسعار الـ 58 ولاية جزائرية (المنزل والمكتب) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'wilayas' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  إدارة أسعار التوصيل لولايات الجزائر الـ 58
                </h3>
                <p className="text-xs text-slate-500">
                  حدد سعر التوصيل لباب المنزل وسعر الاستلام من مكتب التوصيل لكل ولاية على حدة
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={wilayaSearch}
                  onChange={e => setWilayaSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو الرقم..."
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />

                <button
                  type="button"
                  onClick={handleSaveAllWilayas}
                  disabled={isSavingWilayas}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingWilayas ? 'جاري الحفظ...' : 'حفظ جميع التعديلات'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[65vh]">
              <table className="w-full text-right text-xs">
                <thead className="sticky top-0 bg-slate-100 text-slate-600 font-semibold z-10">
                  <tr>
                    <th className="p-3 w-16">الرقم</th>
                    <th className="p-3">اسم الولاية بالعربية</th>
                    <th className="p-3">الاسم باللاتينية</th>
                    <th className="p-3">سعر التوصيل للمنزل (د.ج)</th>
                    <th className="p-3">سعر التوصيل للمكتب (د.ج)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWilayas.map(w => (
                    <tr key={w.code} className="hover:bg-slate-50">
                      <td className="p-3 font-bold font-mono text-slate-900">{w.code}</td>
                      <td className="p-3 font-bold text-slate-900">{w.name_ar}</td>
                      <td className="p-3 text-slate-500 font-mono">{w.name_en}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={w.home_price}
                            onChange={e => handleWilayaPriceChange(w.code, 'home_price', e.target.value)}
                            className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-lg text-xs font-bold text-slate-900 outline-none"
                          />
                          <span className="text-[11px] text-slate-400">د.ج</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={w.office_price}
                            onChange={e => handleWilayaPriceChange(w.code, 'office_price', e.target.value)}
                            className="w-24 px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-lg text-xs font-bold text-slate-900 outline-none"
                          />
                          <span className="text-[11px] text-slate-400">د.ج</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* تبويب 4: إعدادات المتجر والشحن المجاني */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'settings' && settings && (
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-xs sm:p-8">
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              إعدادات المتجر والشحن المجاني
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              تحكم في الإعلان العلوي وخيار التوصيل المجاني للطلبات الكبيرة
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-6">

              <div className="flex flex-col gap-5 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div><span className="block text-sm font-bold text-slate-900">تفعيل خاصية الشحن المجاني</span><span className="text-xs text-slate-500">يصبح الشحن مجانياً تلقائياً عند وصول سلة العميل لمبلغ معين</span></div>
                <div className="flex items-center gap-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">الحد الأدنى لمبلغ الطلب حتى يصبح الشحن مجانياً (د.ج)</label>
                    <div className="flex max-w-xs items-center gap-2">
                      <input type="number" min="500" step="500" value={settings.freeShippingThreshold} onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })} className="w-44 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-700" />
                      <span className="text-xs font-bold text-emerald-800">د.ج</span>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.freeShippingEnabled}
                      onChange={e => setSettings({ ...settings, freeShippingEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-300 peer-focus:outline-none peer peer-checked:bg-emerald-700 peer-checked:after:translate-x-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  حفظ إعدادات المتجر
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* نافذة إنشاء / تعديل منتج مع دعم الصور المتعددة وفئتي الكؤوس والبوكسات */}
      {editingProduct && (
        <div className={isProductPage ? 'min-h-screen bg-slate-100 py-8' : 'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in'}>
          <div
            className={isProductPage ? 'mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm sm:p-8' : 'w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-2xl sm:max-h-[90vh] sm:p-8'}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct.id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button
                type="button"
                onClick={() => { setEditingProduct(null); setIsProductPage(false); window.history.pushState({}, '', '/admin/products'); }}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="مثال: كوب سيراميك يدوي فاخر..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    السعر (د.ج) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف *</label>
                  <select
                    value={editingProduct.category || categories[0] || 'الكؤوس'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none cursor-pointer"
                  >
                    {categories.map(category => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div><span className="block text-xs font-bold text-slate-900">سعر البيع الخاص</span><span className="text-[11px] text-slate-500">حدد السعر ووقت انتهائه ثم فعّل العرض</span></div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" checked={Boolean(editingProduct.discountEnabled)} onChange={e => setEditingProduct({ ...editingProduct, discountEnabled: e.target.checked })} className="peer sr-only" />
                    <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-700 peer-focus:ring-2 peer-focus:ring-emerald-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="number" min="0" disabled={!editingProduct.discountEnabled} value={editingProduct.discountPrice || 0} onChange={e => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) })} placeholder="السعر الخاص (د.ج)" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                  <input type="datetime-local" disabled={!editingProduct.discountEnabled} value={editingProduct.discountStart || ''} onChange={e => setEditingProduct({ ...editingProduct, discountStart: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                  <input type="datetime-local" disabled={!editingProduct.discountEnabled} value={editingProduct.discountEnd || ''} onChange={e => setEditingProduct({ ...editingProduct, discountEnd: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شارة ترويجية (اختياري)
                </label>
                <input
                  type="text"
                  value={editingProduct.badge || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  placeholder="مثال: الأكثر مبيعاً، حصري، جديد..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  وصف المنتج بالتفصيل
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="أدخل وصف الكوب أو البوكس ومميزاته ومواده..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">صور المنتج</span>
                  <span className="text-[11px] text-slate-500">اختر الصور من جهازك، حتى 6 صور</span>
                </div>
                <input type="file" accept="image/*" multiple onChange={e => handleImageFiles(e.target.files)} className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-xs" />
                {productImagesInput.length > 0 && <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">{productImagesInput.map((img, idx) => <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-white border border-slate-200"><img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" /></div>)}</div>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setEditingProduct(null); setIsProductPage(false); window.history.pushState({}, '', '/admin/products'); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingProduct ? 'جاري الحفظ...' : 'حفظ المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
