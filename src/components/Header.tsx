import React from 'react';
import { ShoppingBag, ShoppingCart, Search, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateHome: () => void;
  onOpenTracking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  onOpenTracking
}) => {
  const { totalCount, setIsCartOpen } = useCart();

  const storeName = 'glassglow';
  const announcement = settings?.announcement || 'توصيل متوفر لجميع الولايات الـ 58 والدفع عند الاستلام!';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* شريط الإعلانات العلوي الجزائري */}
      {announcement && (
        <div className="bg-emerald-700 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>{announcement}</span>
        </div>
      )}

      {/* منطقة الترويسة الرئيسية */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* الشعار واسم المتجر */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-right group focus:outline-none cursor-pointer"
          title={storeName}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight block">
              {storeName}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              أكواب وبوكسات هدايا فاخرة في الجزائر
            </span>
          </div>
        </button>

        {/* حقل البحث الحي */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="ابحث عن كوب، بوكس هدايا، أو تصميم..."
            className="w-full pr-10 pl-4 py-2 text-sm bg-slate-100 border border-transparent focus:border-emerald-600 rounded-xl focus:bg-white text-slate-900 placeholder-slate-400 outline-none transition-all duration-200"
          />
        </div>

        {/* الإجراءات: تتبع الطلب بالهاتف + سلة المشتريات (لا يوجد أي زر أو رابط للوحة التحكم) */}
        <div className="flex items-center gap-2.5">
          {/* زر تتبع الطلب للزبائن */}
          <button
            type="button"
            onClick={onOpenTracking}
            className="h-10 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-2 text-xs font-bold transition-all focus:outline-none"
            title="تتبع طلبك عبر رقم هاتفك"
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">تتبع طلبي</span>
          </button>

          {/* زر سلة المشتريات */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="h-10 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2.5 transition-all duration-200 shadow-sm focus:outline-none cursor-pointer"
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

      {/* حقل البحث للشاشات الصغيرة */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="ابحث عن كوب أو بوكس..."
            className="w-full pr-10 pl-4 py-2 text-sm bg-slate-100 border border-transparent focus:border-emerald-600 rounded-xl text-slate-900 placeholder-slate-400 outline-none"
          />
        </div>
      </div>
    </header>
  );
};
