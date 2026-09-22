import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  currency?: string;
  onNavigateShopping: () => void;
  isPage?: boolean;
  onNavigateCheckout?: () => void;
  onClosePage?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  currency = 'د.ج',
  onNavigateShopping,
  isPage = false,
  onNavigateCheckout,
  onClosePage
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalCount,
    setIsCheckoutOpen
  } = useCart();

  if (!isPage) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    onNavigateCheckout?.();
  };

  return (
    <div className={isPage ? 'min-h-[70vh] bg-slate-50 py-8' : 'fixed inset-0 z-50 overflow-hidden'}>
      {/* الخلفية المعتمة */}
      {!isPage && <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />}

      <div className={isPage ? 'mx-auto max-w-4xl px-4' : 'fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10'}>
        <div className={isPage ? 'flex min-h-[70vh] flex-col rounded-3xl border border-slate-200 bg-white text-right shadow-sm' : 'flex w-screen max-w-md flex-col border-r border-slate-200 bg-white text-right shadow-2xl'}>
          {/* رأس السلة */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-slate-900">
                سلة المشتريات
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {totalCount} {totalCount === 1 ? 'منتج' : 'منتجات'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => isPage ? onClosePage?.() : setIsCartOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* قائمة العناصر */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  سلتك فارغة حالياً
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  استكشف أحدث الكؤوس والبوكسات الملكية وأضف ما يعجبك إلى السلة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateShopping();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map(item => {
                const img = (item.product.images && item.product.images[0]) || item.product.image || '';
                return (
                  <div key={item.product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                      <img
                        src={img}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="إزالة من السلة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-slate-400">
                          {item.product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-slate-900">
                            {((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString('fr-DZ')}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {currency}
                          </span>
                        </div>

                        {/* أزرار زيادة ونقصان الكمية */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* تذييل السلة ومجموع الحساب */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer"
              >
                <span>المتابعة إلى إتمام الطلب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>توصيل لكافة ولايات الجزائر الـ 58</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
