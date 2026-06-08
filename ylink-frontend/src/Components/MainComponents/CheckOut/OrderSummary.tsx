import type { CartItem } from "../../../data/product";
import { Loader2 } from "lucide-react";

interface OrderSummaryProps {
    cartItems: CartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    handlePaystackCheckout: () => void;
    isProcessing?: boolean;
}

const OrderSummary = ({ 
    cartItems, 
    subtotal, 
    shippingFee, 
    total, 
    paymentMethod, 
    handlePaystackCheckout,
    isProcessing 
}: OrderSummaryProps) => {

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';

    return (
        <div className="bg-slate-950 rounded-3xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden border border-slate-800">
            {/* Soft backdrop glow effect for modern feel */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-xl font-black mb-6 tracking-tight flex items-center justify-between relative z-10">
                Order Summary
                <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    {cartItems.length} Item{cartItems.length !== 1 && 's'}
                </span>
            </h2>

            {/* Cart Items List */}
            <div className="space-y-4 mb-8 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {cartItems.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shrink-0 group-hover:border-blue-500/30 transition-colors">
                                <img src={item.icon} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <div className="pr-4 truncate">
                                <p className="text-sm font-bold text-slate-100 truncate">{item.name}</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <div className="font-bold text-sm text-right shrink-0">
                            {currency}{(item.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 pt-6 border-t border-slate-800/80 mb-8 relative z-10">
                <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-200">{currency}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-400">
                    <span>Delivery Fee</span>
                    <span className="text-slate-200">{currency}{shippingFee.toLocaleString()}</span>
                </div>
            </div>

            {/* Total & Action Buttons */}
            <div className="pt-6 border-t border-slate-800/80 relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <span className="text-base font-bold text-slate-300">Total Due</span>
                    <span className="text-3xl font-black text-white tracking-tight">
                        {currency}{total.toLocaleString()}
                    </span>
                </div>

                {paymentMethod === 'paystack' ? (
                    <button
                        type="button"
                        onClick={handlePaystackCheckout}
                        disabled={isProcessing || cartItems.length === 0}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay with Paystack'}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isProcessing || cartItems.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Order'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderSummary;