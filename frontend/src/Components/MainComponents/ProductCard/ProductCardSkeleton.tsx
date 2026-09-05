import React from 'react';
import { Loader2 } from 'lucide-react';

/* --- ISOLATED WIREFRAME LOADING SKELETON LAYER --- */
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl flex flex-col overflow-hidden animate-pulse shadow-xs">
      {/* Media Canvas Aspect Ratio Frame */}
      <div className="w-full aspect-square bg-slate-100 border-b border-slate-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
      </div>

      {/* Content Details Meta Frame */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow border-t border-slate-50">
        {/* Rating Stars Bar Placeholder */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-18 h-3.5 bg-slate-200 rounded-sm" />
          <div className="w-8 h-3 bg-slate-100 rounded-sm" />
        </div>

        {/* Product Title Placeholder */}
        <div className="w-3/4 h-4 bg-slate-200 rounded-md mb-2" />

        {/* Overview Description Lines */}
        <div className="space-y-1.5 mb-3 flex-grow">
          <div className="w-full h-3 bg-slate-100 rounded-md" />
          <div className="w-4/5 h-3 bg-slate-100 rounded-md" />
        </div>

        {/* Pricing & CTA Button Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="space-y-1">
            <div className="w-12 h-2.5 bg-slate-100 rounded-xs" />
            <div className="w-20 h-5 bg-slate-200 rounded-md" />
          </div>
          <div className="w-9 h-9 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;