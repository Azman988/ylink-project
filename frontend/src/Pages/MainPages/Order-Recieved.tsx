import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Package, ArrowRight, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { useCart } from '../../context/CartContext';
import { formatPriceWithCurrency } from '../../utils/money';

interface OrderDetails {
    orderId: string;
    totalAmount: number;
    paymentMethod: string;
    date: string;
    status: string;
}

const OrderReceived: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    
    // Paystack uses 'reference' or 'trxref'. Our POD flow uses 'ref' (which holds the MongoDB _id)
    const paystackRef = searchParams.get('reference') || searchParams.get('trxref');
    const orderIdParam = searchParams.get('ref');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

    useEffect(() => {
        const fetchAndVerifyOrder = async () => {
            if (!paystackRef && !orderIdParam) {
                setStatus('error');
                return;
            }

            try {
                let orderData;

                // Route the request based on the payment method flow
                if (paystackRef) {
                    const response = await orderApi.verifyPaystackPayment(paystackRef);
                    orderData = response.data || response;
                } else if (orderIdParam) {
                    const response = await orderApi.getOrderDetails(orderIdParam);
                    orderData = response.data || response;
                }

                // Map MongoDB backend schema to frontend state
                setOrderDetails({
                    orderId: orderData._id,
                    totalAmount: orderData.totalPrice || 0,
                    paymentMethod: orderData.paymentMethod || 'Unknown',
                    date: new Date(orderData.createdAt || Date.now()).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }),
                    status: orderData.paymentStatus
                });

                // Clear frontend cart state after successful confirmation
                await clearCart();
                setStatus('success');
            } catch (error) {
                console.error("Order verification error:", error);
                setStatus('error');
            }
        };

        fetchAndVerifyOrder();
    }, [paystackRef, orderIdParam]);

    // --- RENDER: Loading State ---
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-blue-500 selection:text-white">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Verifying your order...</h2>
                <p className="text-slate-500 font-medium text-sm text-center max-w-sm">
                    Please hold on a moment while we securely confirm your transaction with the server, do not refresh this page.
                </p>
            </div>
        );
    }

    // --- RENDER: Error State ---
    if (status === 'error') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-blue-500 selection:text-white">
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-rose-200 animate-fade-in">
                    <XCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3 text-center">Verification Failed</h2>
                <p className="text-slate-500 font-medium text-center max-w-md mb-8">
                    We couldn't verify this order. If your account was debited, please contact our support team immediately with your reference number.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                    <Link to="/support" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-center transition-colors text-sm text-nowrap">
                        Contact Support
                    </Link>
                    <Link to="/shop" className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-center transition-colors text-sm text-nowrap">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    // --- RENDER: Success State ---
    return (
        <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 flex items-center justify-center selection:bg-blue-500 selection:text-white">
            <div className="max-w-2xl w-full">
                
                {/* Header Section */}
                <div className="text-center flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 border border-emerald-200 animate-fade-in">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">Order Confirmed!</h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        Thank you for shopping with YLinkTech. Your order has been received and is currently being processed.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-50 rounded-full blur-3xl pointer-events-none"></div>

                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                        <Package className="w-5 h-5 text-blue-600" /> Order Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Order Reference ID</p>
                            <p className="text-sm font-semibold text-slate-800 break-all">{orderDetails?.orderId}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Date
                            </p>
                            <p className="text-sm font-semibold text-slate-800">{orderDetails?.date}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5" /> Payment Method
                            </p>
                            <p className="text-sm font-semibold text-slate-800 capitalize">
                                {orderDetails?.paymentMethod === 'pod' 
                                    ? 'Pay on Delivery' 
                                    : 'Paystack'
                                }
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Total Amount</p>
                            <p className="text-lg font-black text-blue-600">
                                {formatPriceWithCurrency(orderDetails?.totalAmount)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link 
                        to={'/orders'}
                        className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                        View Orders <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                        to="/shop" 
                        className="w-full sm:w-auto flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <ShoppingBag className="w-4 h-4" /> Continue Shopping
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OrderReceived;