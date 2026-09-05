import type React from "react";


// Modular Card Wireframe for local async states
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "h-24" }) => (
  <div className={`bg-slate-200/70 animate-pulse rounded-2xl ${className}`} />
);


export const AccountSkeleton: React.FC = () => (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="h-28 bg-slate-900/90 rounded-4xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-7 w-52 bg-slate-700/60 rounded-lg" />
                    <div className="h-4 w-72 bg-slate-800 rounded-lg" />
                </div>
                <div className="h-7 w-36 bg-slate-800 rounded-lg" />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Skeleton */}
                <aside className="lg:col-span-4 xl:col-span-3">
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-sm">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 space-y-3">
                            <div className="w-16 h-16 bg-slate-200 rounded-4xl" />
                            <div className="h-5 w-32 bg-slate-200 rounded-md" />
                            <div className="h-4 w-44 bg-slate-150 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-12 bg-slate-100 rounded-xl" />
                            <div className="h-12 bg-slate-100 rounded-xl" />
                            <div className="h-12 bg-slate-100 rounded-xl" />
                        </div>
                    </div>
                </aside>

                {/* Content Skeleton */}
                <main className="lg:col-span-8 xl:col-span-9 space-y-6">
                    <div className="h-36 bg-slate-200 rounded-3xl" />

                    {/* Stat Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                        {[1, 2, 3].map((key) => (
                            <div key={key} className="h-24 bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 w-16 bg-slate-200 rounded" />
                                    <div className="h-6 w-10 bg-slate-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-48 bg-white rounded-3xl border border-slate-200/80 p-6" />
                </main>
            </div>
        </div>
    </div>
);