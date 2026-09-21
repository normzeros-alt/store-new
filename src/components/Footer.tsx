import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, ShoppingBag } from 'lucide-react';
import { StoreSettings } from '../types';

export const Footer: React.FC<{ settings: StoreSettings | null }> = ({ settings: _settings }) => {
  const storeName = 'glassglow';

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      {/* مميزات المتجر والشارات */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-right">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">توصيل لـ 58 ولاية</h4>
              <p className="text-xs text-slate-500">للمنزل أو لمكتب التوصيل</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">الدفع عند الاستلام</h4>
              <p className="text-xs text-slate-500">عاين طلبيتك قبل الدفع</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">تغليف آمن ومقاوم للكسر</h4>
              <p className="text-xs text-slate-500">حماية فائقة للأكواب والبوكسات</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">خدمة زبائن جزائرية</h4>
              <p className="text-xs text-slate-500">متابعة دقيقة لكل طلب</p>
            </div>
          </div>
        </div>

        {/* سطر الحقوق */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>© {new Date().getFullYear()} {storeName} — متجر إلكتروني جزائري 100%.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <span>الدفع بالدينار الجزائري (د.ج) عند الاستلام</span>
            <span>توصيل سريع مضمون</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
