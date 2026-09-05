import { Loader2, Sparkles } from "lucide-react";
import type { CheckoutItem } from "../../../Pages/MainPages/CheckOut";
import { formatPriceWithCurrency } from "../../../utils/money";

interface OrderSummaryProps {
    checkoutData: CheckoutItem[];
    subTotal: number;
    shippingFee: number;
    discountAmount: number;
    finalTotal: number;
    paymentMethod: string;
    isProcessing?: boolean;
    bonusPoints: number;
    applyBonusPoints: boolean;
    setApplyBonusPoints: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const OrderSummary = ({
    checkoutData,
    subTotal,
    shippingFee,
    discountAmount,
    finalTotal,
    paymentMethod,
    isProcessing,
    bonusPoints,
    applyBonusPoints,
    setApplyBonusPoints
}: OrderSummaryProps) => {

    const handleToggle = () => {
        if (bonusPoints > 0) {
            setApplyBonusPoints((prev) => !prev);
        }
    };

    return (
        <div className="bg-slate-950 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden border border-slate-800">
            {/* Soft backdrop glow effect for modern feel */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-xl font-black mb-6 tracking-tight flex items-center justify-between relative z-10">
                Order Summary
                <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700/50">
                    {checkoutData.length} Item{checkoutData.length !== 1 && 's'}
                </span>
            </h2>

            {/* Cart Items List */}
            <div className="space-y-4 mb-8 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {checkoutData.map((item: CheckoutItem) => (
                    <div key={item.product} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-1 shrink-0 group-hover:border-blue-500/30 transition-colors">
                                <img src={item.image.url} alt={item.name} className="w-full h-full object-cover drop-shadow-md rounded-xl" />
                            </div>
                            <div className="pr-4 truncate">
                                <p className="text-sm font-bold text-slate-100 truncate">{item.name}</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <div className="font-bold text-sm text-right shrink-0">
                            {formatPriceWithCurrency(item.price * item.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Redesigned Bonus Points Toggle Banner */}
            <div 
                onClick={handleToggle}
                className={`relative z-10 mb-6 p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                    bonusPoints === 0 
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60 cursor-not-allowed' 
                        : applyBonusPoints 
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            applyBonusPoints && bonusPoints > 0
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/10 text-amber-400'
                        }`}>
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-100">Redeem Bonus Points</p>
                                {bonusPoints === 0 && (
                                    <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                                        Empty
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Available: <span className="font-bold text-slate-200">{bonusPoints.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>

                    {/* Custom Tailwind Toggle Switch */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={applyBonusPoints}
                        disabled={bonusPoints === 0}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents double toggling if outer div is clicked
                            handleToggle();
                        }}
                        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed ${
                            applyBonusPoints && bonusPoints > 0 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                    >
                        <span className="sr-only">Apply Bonus Points</span>
                        <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                                applyBonusPoints && bonusPoints > 0 ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 pt-6 border-t border-slate-800/80 mb-8 relative z-10">
                <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-slate-200">{formatPriceWithCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Shipping Fee:</span>
                    <span className="text-slate-200">
                        {shippingFee > 0 ? `${formatPriceWithCurrency(shippingFee)}` : 'Free'}
                    </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Bonus Discount:</span>
                    <span className={`font-semibold ${discountAmount > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {discountAmount > 0 ? `-${formatPriceWithCurrency(discountAmount)}` : '₦0'}
                    </span>
                </div>
            </div>

            {/* Total & Action Buttons */}
            <div className="pt-6 border-t border-slate-800/80 relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <span className="text-base font-bold text-slate-300">Total Due</span>
                    <span className="text-3xl font-black text-white tracking-tight">
                        {formatPriceWithCurrency(finalTotal)}
                    </span>
                </div>

                {/* CheckOut btn */}
                <button
                    type="submit"
                    disabled={isProcessing || checkoutData.length === 0}
                    className={`${paymentMethod === 'paystack' ?
                        "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20"
                        :
                        "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"} 
                        w-full text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed`}
                >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : paymentMethod === 'paystack' ? 'Pay with Paystack' : 'Confirm Order'}
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;