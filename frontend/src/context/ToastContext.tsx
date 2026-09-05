import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Loader2, X, AlertTriangle, HelpCircle } from 'lucide-react';

export type ToastState = 'success' | 'error' | 'idle';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ToastData {
  message: string;
  type: ToastState;
}

interface ConfirmState {
  config: ConfirmOptions;
  resolve: (value: boolean) => void;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastState, duration?: number) => void;
  hideToast: () => void;
  confirmAction: (options: ConfirmOptions | string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [confirmData, setConfirmData] = useState<ConfirmState | null>(null);

  // Use useRef instead of useState for setTimeout IDs to avoid re-triggering callbacks
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastState = 'idle', duration = 3500) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setToast({ message, type });

    if (type !== 'idle' && duration > 0) {
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    }
  }, []);

  // Promise-based confirmation handler
  const confirmAction = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    const config: ConfirmOptions = typeof options === 'string' ? { message: options } : options;

    return new Promise<boolean>((resolve) => {
      setConfirmData((prev) => {
        if (prev) {
          prev.resolve(false); // Resolve any pending modal with false before opening a new one
        }
        return { config, resolve };
      });
    });
  }, []);

  const handleConfirmResponse = (result: boolean) => {
    if (confirmData) {
      confirmData.resolve(result);
      setConfirmData(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, confirmAction }}>
      {children}

      {/* Action Confirmation Modal */}
      {confirmData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-scaleIn">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${confirmData.config.variant === 'warning'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : confirmData.config.variant === 'info'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
              >
                {confirmData.config.variant === 'info' ? (
                  <HelpCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-100">
                  {confirmData.config.title || 'Confirm Action'}
                </h3>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {confirmData.config.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleConfirmResponse(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                {confirmData.config.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmResponse(true)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer text-white shadow-lg ${confirmData.config.variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20'
                    : confirmData.config.variant === 'info'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
                  }`}
              >
                {confirmData.config.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen-Centered Toast Modal */}
      {toast && (
        <div className="fixed bottom-10 w-screen z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`
              relative flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border w-fit
              transition-all transform scale-100 text-sm font-medium
              ${toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                : toast.type === 'error'
                  ? 'bg-slate-900 border-rose-500/40 text-rose-400'
                  : 'bg-slate-900 border-blue-500/40 text-blue-400'
              }
            `}
          >
            {/* Dynamic Status Icon */}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'idle' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />}

            <p className="flex-1 text-center text-slate-100">{toast.message}</p>

            {toast.type !== 'idle' && (
              <button
                onClick={hideToast}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};