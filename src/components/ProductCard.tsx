import React, { useState } from 'react';
import { Plus, Check, Eye, Package, Images } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  currency?: string;
  onOpenProductPage: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency = 'د.ج',
  onOpenProductPage
}) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenProductPage(product)}
      className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* حاوية الصورة */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-4">
            <Package className="w-10 h-10 stroke-1" />
            <span className="text-xs text-center line-clamp-1">{product.name}</span>
          </div>
        ) : (
          <img
            src={mainImage}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* عدد الصور إن كان المنتج يحتوي عدة صور */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
            <Images className="w-3 h-3" />
            <span>{images.length} صور</span>
          </span>
        )}

        {/* الشارة الترويجية إن وجدت */}
        {product.badge && (
          <span className="absolute top-3 right-3 bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}

        {/* زر المعاينة وتفاصيل الصفحة */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-white/95 text-slate-700 flex items-center justify-center shadow-md hover:bg-emerald-700 hover:text-white transition-colors"
            title="فتح صفحة المنتج الخاصة"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-right">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <span className="text-emerald-800 font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
              {product.category}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* السعر وزر الإضافة للسلة دون إزعاج فتح الدرج تلقائياً */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block font-normal">السعر</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {(product.salePrice ?? product.price).toLocaleString('fr-DZ')}
              </span>
              {product.salePrice !== undefined && product.salePrice < product.price && <span className="text-[11px] text-slate-400 line-through">{product.price.toLocaleString('fr-DZ')}</span>}
              <span className="text-xs font-bold text-emerald-700">
                {currency}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${isAdded ? 'bg-emerald-700 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-200'}`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>أُضيف للسلة</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
