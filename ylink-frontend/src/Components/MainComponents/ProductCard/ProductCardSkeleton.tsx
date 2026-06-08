import { Loader2 } from "lucide-react";

{/* --- ISOLATED WIREFRAME LOADING SKELETON LAYER --- */ }
const ProductCardSkeleton = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-0 flex flex-col overflow-hidden animate-pulse shadow-sm min-h-[420px]">
            {/* Image Placeholder Frame */}
            <div className="h-56 bg-slate-100 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
            </div>

            {/* Content Details Block */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="w-20 h-5 bg-slate-200 rounded-full" />
                <div className="space-y-2 flex-grow">
                    <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
                    <div className="w-full h-3 bg-slate-100 rounded-md" />
                    <div className="w-5/6 h-3 bg-slate-100 rounded-md" />
                </div>

                {/* Actions Block Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="w-12 h-2 bg-slate-200 rounded-sm" />
                        <div className="w-20 h-5 bg-slate-200 rounded-md" />
                    </div>
                    <div className="w-28 h-10 bg-slate-200 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;