import React from 'react';
import { ShoppingCart, Search, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';
import { BrandMark } from './BrandMark';

interface HeaderProps {
  settings: StoreSettings | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateHome: () => void;
  onOpenTracking: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  onOpenTracking,
  onOpenCart,
  onOpenSearch
}) => {
  const { totalCount } = useCart();

  const storeName = 'Glass Glow';
  return (
    <>
      {settings?.freeShippingEnabled && (
        <div className="relative z-50 flex min-h-8 items-center justify-center bg-emerald-950 px-3 py-1.5 text-center text-[11px] font-bold tracking-wide text-emerald-50">
          <span>توصيل مجاني للطلبات التي تتجاوز {settings.freeShippingThreshold.toLocaleString('fr-DZ')} {settings.currency || 'د.ج'}</span>
        </div>
      )}
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      {/* منطقة الترويسة الرئيسية */}
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-3 sm:px-6 lg:px-8">
        {/* الشعار واسم المتجر */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-right group focus:outline-none cursor-pointer"
          title={storeName}
        >
          <BrandMark className="h-11 w-11 rounded-2xl transition-transform duration-200 group-hover:scale-105" />
          <div>
            <span className="block font-serif text-xl font-black tracking-tight text-emerald-950">
              {storeName}
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-amber-700">premium tableware</span>
          </div>
        </button>

        <div className="hidden flex-1 md:block" />

        {/* الإجراءات: تتبع الطلب بالهاتف + سلة المشتريات (لا يوجد أي زر أو رابط للوحة التحكم) */}
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={onOpenSearch} className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none" title="البحث في المنتجات">
            <Search className="h-4 w-4 text-emerald-600" /><span>البحث</span>
          </button>
          {/* زر تتبع الطلب للزبائن */}
          <button
            type="button"
            onClick={onOpenTracking}
            className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none"
            title="تتبع طلبك عبر رقم هاتفك"
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">تتبع طلبي</span>
          </button>

          {/* زر سلة المشتريات */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex h-10 items-center gap-2.5 rounded-2xl bg-emerald-900 px-4 text-white shadow-lg shadow-emerald-900/15 transition-all duration-200 hover:bg-emerald-800 focus:outline-none"
            title="سلة المشتريات"
            aria-label="سلة المشتريات"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">السلة</span>
            {totalCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-white text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

    </header>
    </>
  );
};
