import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { api } from '../lib/api';
import { ProductCard } from './ProductCard';

interface SearchPageProps { settings: StoreSettings | null; onBack: () => void; onOpenProduct: (product: Product) => void; }

export const SearchPage: React.FC<SearchPageProps> = ({ settings, onBack, onOpenProduct }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const currency = settings?.currency || 'د.ج';

  useEffect(() => {
    const term = query.trim();
    if (!term) { setProducts([]); return; }
    setLoading(true);
    const timer = window.setTimeout(() => {
      api.getProducts({ search: term }).then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-emerald-300"><ArrowRight className="h-4 w-4" /> العودة للمتجر</button>
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-black text-slate-950 sm:text-4xl">ابحث عن قطعتك المفضلة</h1>
        <p className="mt-3 text-sm text-slate-500">اكتب اسم المنتج أو التصنيف أو أي كلمة من الوصف</p>
        <div className="relative mt-7">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-700" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="مثال: كوب سيراميك" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 text-sm font-semibold outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-100" />
          {query && <button type="button" onClick={() => setQuery('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>}
        </div>
      </div>
    </section>
    <div className="mt-8">
      {loading ? <div className="py-16 text-center text-sm text-slate-500">جاري البحث...</div> : !query.trim() ? <div className="py-16 text-center text-sm text-slate-400">ابدأ بكتابة كلمة للبحث</div> : products.length === 0 ? <div className="py-16 text-center text-sm text-slate-500">لا توجد منتجات مطابقة</div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{products.map(product => <ProductCard key={product.id} product={product} currency={currency} onOpenProductPage={onOpenProduct} />)}</div>}
    </div>
  </div>;
};
