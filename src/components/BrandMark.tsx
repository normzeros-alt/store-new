import React from 'react';

export const BrandMark: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 text-white shadow-lg shadow-emerald-900/20`} role="img" aria-label="Glass Glow">
    <span className="absolute -right-1 -top-2 h-7 w-7 rounded-full border border-amber-200/40 bg-amber-200/20" />
    <span className="relative z-10 font-serif text-[15px] font-black tracking-[-0.18em] text-amber-100">GG</span>
    <span className="absolute bottom-1 left-1/2 h-px w-5 -translate-x-1/2 bg-amber-200/70" />
  </div>
);
