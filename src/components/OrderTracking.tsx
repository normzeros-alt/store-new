import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Phone, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { api } from '../lib/api';

interface OrderTrackingProps {
  onBack: () => void;
  settings: StoreSettings | null;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ onBack, settings }) => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currency = settings?.currency || 'د.ج';

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح مكون من 9 أو 10 أرقام على الأقل');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.trackOrders(phone.trim());
      setOrders(res.orders || []);
      setHasSearched(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء البحث عن الطلبات');
      setOrders([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'جديد':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>طلب جديد قيد التأكيد</span>
          </span>
        );
      case 'قيد التجهيز':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Package className="w-3.5 h-3.5" />
            <span>جاري تجهيز وتغليف الطلبية</span>
          </span>
        );
      case 'تم الشحن':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3.5 h-3.5" />
            <span>في الطريق إلى ولايتك</span>
          </span>
        );
      case 'مكتمل':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم التسليم بنجاح</span>
          </span>
        );
      case 'ملغي':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>طلب ملغي</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      {/* زر الرجوع للتسوق */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لمتجر الكؤوس</span>
        </button>
      </div>

      {/* بطاقة البحث برقم الهاتف */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm text-right mb-8">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            تتبع حالة طلبيتك في الجزائر
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            أدخل رقم الهاتف الذي استخدمته عند تسجيل الطلب لمعرفة حالة التوصيل الحالية فوراً.
          </p>
        </div>

        <form onSubmit={handleTrack} className="max-w-md mx-auto space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0550500500"
              className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-slate-900 placeholder-slate-400 text-base font-semibold outline-none transition-all"
              dir="ltr"
              autoFocus
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>بحث عن طلبيتي</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* نتائج البحث */}
      {hasSearched && (
        <div className="space-y-6">
          {orders && orders.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  الطلبات المسجلة برقم ({phone}):
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {orders.length} {orders.length === 1 ? 'طلب' : 'طلبات'}
                </span>
              </div>

              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-right space-y-5"
                >
                  {/* رأس بطاقة الطلب */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">رقم الطلب:</span>
                        <span className="text-sm font-extrabold text-slate-900">#{order.id}</span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* تفاصيل العميل وموقع التوصيل */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">العميل:</span>
                      <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                      <span className="text-slate-600 block mt-0.5">{order.customer_phone}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">وجهة التوصيل:</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>ولاية {order.wilaya_name || `رقم ${order.wilaya_code}`}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({order.delivery_type === 'office' ? 'استلام من مكتب التوصيل' : 'توصيل لباب المنزل'})
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 line-clamp-1">{order.customer_address}</p>
                    </div>
                  </div>

                  {/* قائمة منتجات هذا الطلب */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700">محتويات الطلبية:</h4>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      {order.items?.map(it => (
                        <div key={it.id} className="p-3 flex items-center justify-between text-xs bg-white">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-slate-900">{it.product_name}</span>
                          </div>
                          <span className="font-bold text-slate-700">
                            {(it.price * it.quantity).toLocaleString('fr-DZ')} {currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ملخص الحساب */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-slate-500">
                      <span>المجموع: <strong>{order.subtotal?.toLocaleString('fr-DZ')} {currency}</strong></span>
                      <span>رسوم التوصيل: <strong>{order.delivery_price === 0 ? 'مجاني' : `${order.delivery_price} ${currency}`}</strong></span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-500">المبلغ الإجمالي عند الاستلام:</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        {order.total_amount?.toLocaleString('fr-DZ')} {currency}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                    <span>نظام الدفع عند الاستلام (COD): يرجى إعداد المبلغ نقداً والتأكد من مطابقة طلبيتك قبل الدفع للموصل.</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                لم نجد أي طلبات مسجلة برقم ({phone})
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                يرجى التأكد من كتابة نفس رقم الهاتف المستخدم عند تأكيد الشراء، أو التواصل مع خدمة الزبائن للمساعدة.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
