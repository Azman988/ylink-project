import React, { useState, useMemo } from 'react';
import { CreditCard, Lock, Zap, ChevronDown, Info, AlertCircle } from "lucide-react";
import { usePaystack } from '../../../hooks/usePaystack';

// Types for our price data
interface PriceOption {
  label: string;
  price: number;
  description: string;
}

const PRICE_MAP: Record<string, PriceOption> = {
  light: { label: 'Light Usage', price: 5000, description: 'Basic load assessment' },
  medium: { label: 'Medium Usage', price: 10000, description: 'Standard residential setup' },
  heavy: { label: 'Heavy Usage', price: 20000, description: 'Complex/Commercial setup' },
};

interface PaymentProps {
  serviceName: string;
  customerEmail?: string; // Ideally passed from your form state
  customerName?: string;
}

const Payment: React.FC<PaymentProps> = ({
  serviceName,
  customerEmail = "customer@example.com",
  customerName = "Valued Client"
}) => {
  const isAssessment = serviceName === "assessment process";

  // State
  const [selectedTier, setSelectedTier] = useState<string>('medium');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calculate final amount in Kobo (Paystack requirement: Amount * 100)
  const finalAmount = useMemo(() => {
    if (isAssessment && selectedTier !== 'unsure') {
      return (PRICE_MAP[selectedTier]?.price || 0) * 100;
    }
    return (Number(customAmount) || 0) * 100;
  }, [isAssessment, selectedTier, customAmount]);

  function serviceTypeDisplay() {
    if (isAssessment) return `Solar Assessment (${selectedTier})`;
    return `Device Repair / Service`;
  }

  const { initializePayment } = usePaystack();

  const handlePaymentClick = () => {
    if (finalAmount <= 0) {
      alert("Please select a tier or enter a valid amount.");
      return;
    }
    initializePayment({
      email: customerEmail,
      amount: finalAmount,
      metadata: {
        name: customerName,
        custom_fields: [
          {
            display_name: "Service Type",
            variable_name: "service_type",
            value: serviceTypeDisplay()
          }
        ]
      },
      onSuccess: (reference: any) => {
        alert(`Payment Successful! Reference: ${reference.reference}`);
        // Handle post-payment logic here (e.g., update DB)
      },
      onCancel: () => {
        console.log('Payment window closed');
      }
    });
  };

  return (
    <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      {/* Header Banner */}
      <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wide uppercase">Checkout Portal</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
          <Lock className="w-3 h-3" /> SECURE
        </div>
      </div>

      <div className="px-8 py-5">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Info */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Make Your Payment</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Secure your priority slot and fast-track your <span className="font-bold text-slate-700">{serviceName}</span>.
              Payments are processed instantly via Paystack.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <CheckCircleIcon /> Instant confirmation
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <CheckCircleIcon /> Secure encryption
              </div>
            </div>
          </div>

          {/* Right: Input Logic */}
          <div className="bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100">
            {isAssessment ? (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Assessment Tier</label>

                {/* Custom Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl flex items-center justify-between text-left hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className={`w-5 h-5 ${selectedTier === 'unsure' ? 'text-slate-400' : 'text-blue-500'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedTier === 'unsure' ? 'Unsure / Custom Amount' : PRICE_MAP[selectedTier].label}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {selectedTier === 'unsure' ? 'Enter amount manually' : `₦${PRICE_MAP[selectedTier].price.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                      {Object.entries(PRICE_MAP).map(([key, opt]) => (
                        <button
                          key={key}
                          onClick={() => { setSelectedTier(key); setIsDropdownOpen(false); }}
                          className="w-full px-5 py-3 text-left hover:bg-blue-50 flex justify-between items-center transition-colors"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-700">{opt.label}</p>
                            <p className="text-[10px] text-slate-500">{opt.description}</p>
                          </div>
                          <span className="text-sm font-black text-blue-600">₦{opt.price.toLocaleString()}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => { setSelectedTier('unsure'); setIsDropdownOpen(false); }}
                        className="w-full px-5 py-3 text-left hover:bg-slate-100 border-t border-slate-50 flex justify-between items-center"
                      >
                        <p className="text-sm font-bold text-slate-700 italic">I am unsure / Need help</p>
                        <Info className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  )}
                </div>

                {selectedTier === 'unsure' && (
                  <div className="animate-fade-in space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Enter Amount (₦)</label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-blue-600"
                      placeholder="5000"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-8 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-xl text-slate-800"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            {/* Total Display & Button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-slate-400">TOTAL DUE</span>
                <span className="text-2xl font-black text-slate-900">
                  ₦{(finalAmount / 100).toLocaleString()}
                </span>
              </div>

              <button
                onClick={handlePaymentClick}
                className="w-full py-4 bg-[#0BA4DB] hover:bg-[#098bb8] text-white font-extrabold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Pay with Paystack
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> Encrypted by Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
  <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </div>
);

export default Payment;