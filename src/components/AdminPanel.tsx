import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, DollarSign, Settings, LogOut, Plus, Trash2,
  Edit2, Save, X, Eye, Truck, Check, AlertCircle, RefreshCw, Upload, Images
} from 'lucide-react';
import { Product, Order, StoreSettings, AdminStats, Wilaya } from '../types';
import { api } from '../lib/api';

export const AdminPanel: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token_dz'));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'wilayas' | 'settings'>('orders');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // حالة إضافة/تعديل منتج (مع صور متعددة)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productImagesInput, setProductImagesInput] = useState<string[]>(['']);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // حالة البحث والتصفية للولايات
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [isSavingWilayas, setIsSavingWilayas] = useState(false);

  // إشعار
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
      const [s, ords, prods, wils, setts] = await Promise.all([
        api.getAdminStats(token),
        api.getAdminOrders(token),
        api.getProducts(),
        api.getAdminWilayas(token),
        api.getSettings()
      ]);
      setStats(s);
      setOrders(ords);
      setProducts(prods);
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
      setEditingProduct({
        name: '',
        price: 2500,
        description: '',
        category: 'الكؤوس',
        stock: 15,
        badge: ''
      });
      setProductImagesInput(['']);
    }
  };

  // إضافة حقل صورة جديد
  const handleAddImageField = () => {
    setProductImagesInput(prev => [...prev, '']);
  };

  const handleUpdateImageUrl = (index: number, val: string) => {
    setProductImagesInput(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveImageField = (index: number) => {
    setProductImagesInput(prev => prev.filter((_, i) => i !== index));
  };

  // حفظ المنتج
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProduct) return;

    const validImages = productImagesInput.map(u => u.trim()).filter(Boolean);
    if (validImages.length === 0) {
      notify('يرجى إضافة رابط صورة واحدة على الأقل للمنتج', 'error');
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
          setEditingProduct(null);
        }
      } else {
        const res = await api.createProduct(payload, token);
        if (res.success) {
          notify('تمت إضافة المنتج الجديد بنجاح');
          setProducts(prev => [res.product, ...prev]);
          setEditingProduct(null);
        }
      }
    } catch (err: any) {
      notify(err.message || 'فشل حفظ المنتج', 'error');
    } finally {
      setIsSubmittingProduct(false);
    }
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
        notify('تم حفظ أسعار التوصيل لجميع الولايات بنجاح! 🇩🇿');
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

  // تصدير نسخة احتياطية
  const handleExportData = () => {
    if (!token) return;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/admin/export');
    xhr.setRequestHeader('x-admin-token', token);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.responseText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dz-cups-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      }
    };
    xhr.send();
  };

  // شاشة تسجيل الدخول إن لم يكن مسجلاً
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-right">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-6">
            <Settings className="w-7 h-7" />
          </div>

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
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              DZ
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
                لوحة إدارة المتجر 🇩🇿
              </h1>
              <span className="text-[11px] text-slate-400 block">
                كؤوس وأكواب الجزائر | متجر الكؤوس والبوكسات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
              <span className="text-2xl font-extrabold text-amber-600">{stats.pendingOrders}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">عدد المنتجات (كؤوس وبوكسات)</span>
              <span className="text-2xl font-extrabold text-slate-900">{stats.totalProducts}</span>
            </div>
          </div>
        )}

        {/* أشرطة التبويب الرئيسية للوحة التحكم */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
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
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'products' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة المنتجات (كؤوس وبوكسات)</span>
          </button>

          <button
            onClick={() => setActiveTab('wilayas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'wilayas' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>أسعار توصيل الـ 58 ولاية (المنزل والمكتب)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'settings' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الشحن المجاني والمتجر</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* تبويب 1: إدارة الطلبات */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">سجل الطلبات الواردة (الدفع عند الاستلام)</h3>
                <p className="text-xs text-slate-500">يمكنك تحديث الحالة ليراها الزبون في صفحة التتبع فوراً</p>
              </div>
              <button
                onClick={loadAdminData}
                disabled={isLoadingData}
                className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-xl"
                title="تحديث البيانات"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
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
        {/* تبويب 2: إدارة المنتجات (كؤوس وبوكسات فقط + صور متعددة) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">كتالوج المنتجات (الكؤوس والبوكسات)</h3>
                <p className="text-xs text-slate-500">محددة حصراً في فئتين: الكؤوس، والبوكسات (مجموعات الأكواب) مع دعم صور متعددة</p>
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
                        <span className="text-[11px] text-slate-400 block">المخزون: {prod.stock} قطع</span>
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
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto text-right">
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              إعدادات المتجر والشحن المجاني
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              تحكم في اسم المتجر، الإعلان العلوي، وخيار التوصيل المجاني للطلبات الكبيرة
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  شريط الإعلانات العلوي
                </label>
                <input
                  type="text"
                  value={settings.announcement || ''}
                  onChange={e => setSettings({ ...settings, announcement: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                />
              </div>

              {/* قسم الشحن المجاني المحدد بالطلب */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-emerald-950 block">
                      تفعيل خاصية الشحن المجاني
                    </span>
                    <span className="text-xs text-emerald-800">
                      يصبح الشحن مجانياً تلقائياً عند وصول سلة العميل لمبلغ معين
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.freeShippingEnabled}
                      onChange={e => setSettings({ ...settings, freeShippingEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                  </label>
                </div>

                {settings.freeShippingEnabled && (
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                      الحد الأدنى لمبلغ الطلب حتى يصبح الشحن مجانياً (بالدينار الجزائري د.ج)
                    </label>
                    <div className="flex items-center gap-2 max-w-xs">
                      <input
                        type="number"
                        min="500"
                        step="500"
                        value={settings.freeShippingThreshold}
                        onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-white border border-emerald-300 focus:border-emerald-700 rounded-xl text-sm font-bold text-slate-900 outline-none"
                      />
                      <span className="text-xs font-bold text-emerald-800">د.ج</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  حفظ إعدادات المتجر
                </button>

                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  تصدير نسخة احتياطية (JSON)
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* نافذة إنشاء / تعديل منتج مع دعم الصور المتعددة وفئتي الكؤوس والبوكسات */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-right overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct.id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الفئة (محددة بـ 2 فقط) *
                  </label>
                  <select
                    value={editingProduct.category || 'الكؤوس'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="الكؤوس">الكؤوس (الأكواب الفردية)</option>
                    <option value="البوكسات">البوكسات (مجموعات الأكواب والهدايا)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الكمية المتوفرة بالمخزون *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.stock || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                  />
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

              {/* قسم الصور المتعددة للمنتج */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    صور المنتج (يمكن إضافة عدة صور لنفس المنتج):
                  </span>
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة رابط صورة</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {productImagesInput.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono w-5 text-center">{idx + 1}.</span>
                      <input
                        type="url"
                        value={url}
                        onChange={e => handleUpdateImageUrl(idx, e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-emerald-600"
                        dir="ltr"
                      />
                      {productImagesInput.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageField(idx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
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
