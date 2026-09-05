import React from 'react';

export const AddressBookSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-5 bg-slate-100/50 border border-slate-50 rounded-xl animate-pulse">
      {/* Header Skeleton */}
      <div className="pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
        <div className="space-y-2">
          {/* Title Placeholder */}
          <div className="h-6 w-44 bg-slate-300 rounded-md" />
          {/* Subtitle Placeholder */}
          <div className="h-4 w-64 sm:w-80 bg-slate-200 rounded-md" />
        </div>

        {/* Action Button Placeholder */}
        <div className="h-11 w-40 bg-slate-200 rounded-2xl hidden sm:block" />
      </div>

      {/* Grid Skeleton (2 Cards matching the max limit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((index) => (
          <div
            key={index}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-6"
          >
            {/* Card Content Skeleton */}
            <div className="space-y-4">
              {/* Header Row (Icon + Tag) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
                {index === 1 && (
                  <div className="h-6 w-16 bg-blue-100/70 rounded-xl border border-blue-200/50" />
                )}
              </div>

              {/* Text Lines */}
              <div className="space-y-2 pt-1">
                {/* Street */}
                <div className="h-5 w-3/4 bg-slate-300 rounded-md" />
                {/* City & State */}
                <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
              </div>

              {/* Phone Pill */}
              <div className="h-8 w-32 bg-slate-100 rounded-xl border border-slate-200/60" />
            </div>

            {/* Bottom Action Bar Skeleton */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-3.5 w-10 bg-slate-200 rounded" />
                <div className="h-3.5 w-12 bg-slate-200 rounded" />
              </div>
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBookSkeleton;