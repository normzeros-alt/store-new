import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, MapPin, Building2, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerData, Wilaya, StoreSettings } from '../types';
import { api } from '../lib/api';

interface CheckoutModalProps {
  settings: StoreSettings | null;
  onOrderSuccess: (orderId: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  settings,
  onOrderSuccess
}) => {
  const { items, subtotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    notes: '',
    wilaya_code: 16, // الجزائر العاصمة افتراضياً
    delivery_type: 'home'
  });

  const [isLoadingWilayas, setIsLoadingWilayas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const currency = settings?.currency || 'د.ج';

  useEffect(() => {
    if (isCheckoutOpen) {
      setIsLoadingWilayas(true);
      api.getWilayas()
        .then(res => {
          setWilayas(res);
          if (res.length > 0 && !formData.wilaya_code) {
            setFormData(prev => ({ ...prev, wilaya_code: res[0].code }));
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingWilayas(false));
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Find active wilaya and calculate delivery fee
  const selectedWilaya = wilayas.find(w => w.code === Number(formData.wilaya_code)) || wilayas[0];
  let deliveryPrice = 0;
  if (selectedWilaya) {
    deliveryPrice = formData.delivery_type === 'office' ? selectedWilaya.office_price : selectedWilaya.home_price;
  }

  // Free shipping rule from settings
  const isFreeShipping = settings?.freeShippingEnabled && subtotal >= (settings?.freeShippingThreshold || 6000);
  const finalDeliveryPrice = isFreeShipping ? 0 : deliveryPrice;
  const finalTotal = subtotal + finalDeliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية (الاسم، رقم الهاتف، العنوان)');
      return;
    }

    if (formData.phone.trim().length < 8) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderItems = items.map(it => ({
        productId: it.product.id,
        quantity: it.quantity
      }));

      const res = await api.createOrder(formData, orderItems);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
        onOrderSuccess(res.order.id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-right flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                إتمام الطلب — الدفع عند الاستلام
              </h2>
              <p className="text-xs text-slate-500">
                توصيل سريع وآمن لجميع ولايات الجزائر الـ 58
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى النموذج أو رسالة النجاح */}
        <div className="overflow-y-auto p-6 space-y-6">
          {completedOrder ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                تهانينا! تم تسجيل طلبك بنجاح
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                رقم طلبك هو <strong className="text-emerald-700">#{completedOrder.id}</strong>. سيقوم فريقنا بالاتصال بك هاتفياً عبر الرقم (<span dir="ltr">{completedOrder.customer_phone}</span>) لتأكيد شحن طلبيتك إلى ولاية {completedOrder.wilaya_name}.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 max-w-md mx-auto text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>المبلغ الإجمالي عند الاستلام:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    {completedOrder.total_amount?.toLocaleString('fr-DZ')} {currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>نوع التوصيل:</span>
                  <span>{completedOrder.delivery_type === 'office' ? 'استلام من مكتب التوصيل' : 'توصيل للمنزل'}</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCompletedOrder(null);
                    setIsCheckoutOpen(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                >
                  العودة للمتجر ومتابعة التسوق
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ملخص الطلب السريع */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>عدد المنتجات المختارة:</span>
                  <span>{items.reduce((s, i) => s + i.quantity, 0)} قطع</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>المجموع الفرعي للمنتجات:</span>
                  <span className="font-bold">{subtotal.toLocaleString('fr-DZ')} {currency}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>تكلفة التوصيل ({selectedWilaya?.name_ar || ''}):</span>
                  <span className={`font-bold ${isFreeShipping ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {isFreeShipping ? 'شحن مجاني' : `${deliveryPrice} ${currency}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>المجموع الإجمالي عند الاستلام:</span>
                  <span className="text-base text-emerald-700">{finalTotal.toLocaleString('fr-DZ')} {currency}</span>
                </div>
              </div>

              {/* بيانات الزبون الجزائري */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  معلومات الشحن والاستلام
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الاسم واللقب *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: محمد بن علي"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم الهاتف (ضروري لتأكيد الطلب) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0550123456 أو 0661..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* اختيار الولاية من ولايات الجزائر الـ 58 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الولاية (58 ولاية جزائرية) *
                  </label>
                  <select
                    value={formData.wilaya_code}
                    onChange={e => setFormData({ ...formData, wilaya_code: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none cursor-pointer"
                  >
                    {wilayas.map(w => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.name_ar} ({w.name_en}) — للمنزل: {w.home_price} د.ج / للمكتب: {w.office_price} د.ج
                      </option>
                    ))}
                  </select>
                </div>

                {/* خيار التوصيل للمنزل أو لمكتب التوصيل (Stop Desk) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    مكان الاستلام المفضل *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.delivery_type === 'home'
                          ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_type"
                        checked={formData.delivery_type === 'home'}
                        onChange={() => setFormData({ ...formData, delivery_type: 'home' })}
                        className="hidden"
                      />
                      <Home className={`w-5 h-5 shrink-0 ${formData.delivery_type === 'home' ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <div className="flex-1">
                        <span className="font-bold text-xs block">توصيل لباب المنزل</span>
                        <span className="text-[11px] text-slate-500">
                          {isFreeShipping ? 'مجاني' : `${selectedWilaya?.home_price || 0} ${currency}`}
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.delivery_type === 'office'
                          ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_type"
                        checked={formData.delivery_type === 'office'}
                        onChange={() => setFormData({ ...formData, delivery_type: 'office' })}
                        className="hidden"
                      />
                      <Building2 className={`w-5 h-5 shrink-0 ${formData.delivery_type === 'office' ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <div className="flex-1">
                        <span className="font-bold text-xs block">استلام من مكتب التوصيل</span>
                        <span className="text-[11px] text-slate-500">
                          {isFreeShipping ? 'مجاني' : `${selectedWilaya?.office_price || 0} ${currency} (أوفر سعراً)`}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* العنوان الكامل والبلدية */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    العنوان بالتفصيل والبلدية *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="مثال: بلدية درارية، حي 500 مسكن، عمارة ب رقم 12"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                  />
                </div>

                {/* ملاحظات إضافية */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ملاحظات للموصل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 text-center">
                  {errorMsg}
                </div>
              )}

              {/* زر تأكيد الطلب بنظام الدفع عند الاستلام */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>تأكيد الطلب الآن — الدفع نقداً عند الاستلام ({finalTotal.toLocaleString('fr-DZ')} {currency})</span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>دفع نقدي 100% عند وصول الطرد إلى يديك ومعاينته</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
