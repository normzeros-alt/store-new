import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingCart, Minus, Plus, Images, Check } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';

interface ProductPageProps {
  productId: number;
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
  settings: StoreSettings | null;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  productId,
  onBack,
  onSelectProduct,
  settings
}) => {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const [product, setProduct] = useState<(Product & { similar?: Product[] }) | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAddedToast, setIsAddedToast] = useState(false);

  const currency = settings?.currency || 'د.ج';

  useEffect(() => {
    setIsLoading(true);
    setSelectedImageIndex(0);
    setQuantity(1);
    setErrorMsg('');

    api.getProduct(productId)
      .then(res => {
        setProduct(res);
      })
      .catch(err => {
        setErrorMsg(err.message || 'تعذر جلب تفاصيل المنتج');
      })
      .finally(() => {
        setIsLoading(false);
      });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-500">جاري تحميل صفحة المنتج...</p>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white border border-rose-200 text-center shadow-md">
        <h3 className="text-lg font-bold text-slate-900 mb-2">عذراً، المنتج غير موجود</h3>
        <p className="text-xs text-slate-500 mb-6">{errorMsg || 'قد يكون تم حذفه أو تغييره'}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 hover:bg-emerald-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لكتالوج المنتجات</span>
        </button>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const activeImage = images[selectedImageIndex] || images[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  const handleDirectBuy = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* شريط الإشعار عند الإضافة */}
      {isAddedToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom">
          <Check className="w-4 h-4" />
          <span>تمت إضافة {quantity} قطعة من المنتج إلى السلة بنجاح!</span>
        </div>
      )}

      {/* زر العودة */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold transition-all shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لجميع المنتجات</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* معرض الصور المتقدم للمنتج (مع دعم الصور المتعددة) */}
          <div className="space-y-4">
            {/* الصورة الرئيسية الكبيرة */}
            <div className="aspect-4/3 sm:aspect-square rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200/80 shadow-xs">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 right-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* صور مصغرة (Thumbnails) لاختيار الصور المختلفة */}
            {images.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-600/20 scale-102'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* تفاصيل وخيارات المنتج */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* الفئة */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">{product.category}</span>
                <span className="text-xs text-slate-500 font-medium">كود المنتج: #{product.id}</span>
              </div>

              {/* الاسم */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* السعر بالدينار الجزائري */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 inline-flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {(product.salePrice ?? product.price).toLocaleString('fr-DZ')}
                </span>
                {product.salePrice !== undefined && product.salePrice < product.price && <span className="text-sm text-slate-400 line-through">{product.price.toLocaleString('fr-DZ')}</span>}
                <span className="text-sm font-extrabold text-emerald-700">
                  {currency}
                </span>
              </div>

              {/* الوصف المفصل */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  تفاصيل ومواصفات المنتج:
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* أدوات الشراء والكمية */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              {(
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    الكمية المطلوبة:
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3.5 px-6 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة إلى السلة</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectBuy}
                  className="py-3.5 px-6 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>شراء الآن (الدفع عند الاستلام)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* منتجات مشابهة من نفس الفئة */}
      {product.similar && product.similar.length > 0 && (
        <div className="mt-14">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            منتجات أخرى من نفس الفئة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.similar.map(sim => (
              <div
                key={sim.id}
                onClick={() => onSelectProduct(sim)}
                className="bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-lg hover:border-emerald-500/50 cursor-pointer transition-all"
              >
                <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden mb-3">
                  <img
                    src={(sim.images && sim.images[0]) || sim.image || ''}
                    alt={sim.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{sim.name}</h4>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-emerald-700">
                    {sim.price.toLocaleString('fr-DZ')} {currency}
                  </span>
                  <span className="text-[11px] text-slate-400">{sim.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
