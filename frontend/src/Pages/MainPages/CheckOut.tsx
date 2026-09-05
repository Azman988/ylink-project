import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';

import OrderSummary from '../../Components/MainComponents/CheckOut/OrderSummary';
import PaymentMethod from '../../Components/MainComponents/CheckOut/PaymentMethod';
import { orderApi } from '../../api/orderApi';
import AddressBook from '../../Components/MainComponents/Address/Address';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

interface Address {
    _id: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    isDefault: boolean;
}

export interface CheckoutItem {
    product: string;
    name: string;
    image: { url: string };
    price: number;
    quantity: number;
}

interface CheckoutData {
    checkoutItems: CheckoutItem[];
    subtotal: number;
    addresses: Address[];
    defaultAddress: Address | null;
    availableBonusPoints: number;
}

const CheckOut: React.FC = () => {
    const { showToast } = useToast();
    const { fetchCart } = useCart();
    const navigate = useNavigate();

    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    // --- State Management ---
    const [activeAddress, setActiveAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('paystack');
    const [applyBonusPoints, setApplyBonusPoints] = useState<boolean>(false);

    // --- Fetch Pre-checkout Data ---
    useEffect(() => {
        const fetchCheckoutData = async () => {
            await fetchCart();

            setIsLoading(true);
            try {
                const response = await API.get('/cart/checkout-proceed');
                const data: CheckoutData = response.data?.data || response.data;
                
                setCheckoutData(data);

                setActiveAddress(data.defaultAddress)
            } catch (error: any) {
                showToast(error.response?.data?.message || 'Failed to initialize checkout', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCheckoutData();
    }, []);

    // --- Safe Order Calculations ---
    const subTotal = checkoutData?.subtotal ?? 0;
    const bonusPoints = checkoutData?.availableBonusPoints ?? 0;
    const checkoutItems = checkoutData?.checkoutItems ?? [];

    const shippingFee = activeAddress?.city?.toLowerCase() === 'ibadan' ? 1500 : 3500;
    const grossTotal = subTotal + shippingFee;
    const discountAmount = applyBonusPoints ? Math.min(bonusPoints, grossTotal) : 0;
    const finalTotal = Math.max(0, grossTotal - discountAmount);

    // --- Unified Checkout Handler ---
    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!activeAddress) {
            showToast("Please add or select a delivery address.", "error");
            return;
        }

        if (checkoutItems.length === 0) {
            showToast("Your cart is empty.", "error");
            return;
        }

        setIsProcessing(true);

        try {
            const orderPayload = {
                orderItems: checkoutItems.map((item) => ({
                    product: item.product,
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image || (item.product as any)?.images?.[0]?.url || (item.product as any)?.images?.[0] || ''
                })),
                shippingAddress: {
                    street: activeAddress.street,
                    city: activeAddress.city,
                    state: activeAddress.state,
                    phoneNumber: activeAddress.phone
                },
                paymentMethod,
                applyBonusPoints
            };

            const result = await orderApi.createOrder(orderPayload);

            // Case-insensitive paystack check
            if (paymentMethod.toLowerCase() === 'paystack' && result.authorization_url) {
                showToast("Redirecting to secure payment...", "success");
                window.location.href = result.authorization_url;
            } else {
                showToast("Order placed successfully!", "success");
                navigate(`/order-received?ref=${result.data._id}`);
            }
        } catch (error: any) {
            console.error("Checkout Failure Details:", error.response?.data || error);
            showToast(error.response?.data?.message || "Failed to submit order. Try again later.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Wireframe Skeleton Loader Component ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pb-24 pt-28">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                        <div className="space-y-2">
                            <div className="h-4 w-36 bg-slate-200 rounded-md"></div>
                            <div className="h-8 w-64 bg-slate-300 rounded-lg"></div>
                        </div>
                        <div className="h-8 w-44 bg-slate-200 rounded-xl"></div>
                    </div>

                    {/* Main Content Wireframe */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left Column: Form Placeholders */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            {/* Address Card Skeleton */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                                <div className="h-5 w-40 bg-slate-200 rounded"></div>
                                <div className="h-16 w-full bg-slate-100 rounded-2xl"></div>
                                <div className="h-16 w-full bg-slate-100 rounded-2xl"></div>
                            </div>
                            {/* Payment Method Skeleton */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                                <div className="h-5 w-40 bg-slate-200 rounded"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 bg-slate-100 rounded-2xl"></div>
                                    <div className="h-20 bg-slate-100 rounded-2xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary Card Skeleton */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-32 bg-slate-800 rounded"></div>
                                    <div className="h-5 w-16 bg-slate-800 rounded-full"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-12 bg-slate-800/60 rounded-xl"></div>
                                    <div className="h-12 bg-slate-800/60 rounded-xl"></div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 space-y-2">
                                    <div className="h-4 w-full bg-slate-800/80 rounded"></div>
                                    <div className="h-4 w-2/3 bg-slate-800/80 rounded"></div>
                                </div>
                                <div className="h-12 w-full bg-slate-800 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Empty Cart Fallback Screen ---
    if (!checkoutData || checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        You have no items in your cart to check out. Browse our collection to add items.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 pt-28 relative selection:bg-blue-500 selection:text-white">
 
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                            <ShoppingBag className="w-3.5 h-3.5" /> Secure Checkout Gateway
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review and Pay</h1>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200/60 shadow-sm px-3 py-2 rounded-xl w-fit">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> End-to-End Encrypted
                    </div>
                </div>

                {/* Form & Order Summary */}
                <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-2/3 space-y-6">
                        <AddressBook 
                            allowEdit={false} 
                        />
                        <PaymentMethod 
                            paymentMethod={paymentMethod} 
                            setPaymentMethod={setPaymentMethod} 
                        />
                    </div>

                    <div className="w-full lg:w-1/3 sticky top-28">
                        <OrderSummary
                            checkoutData={checkoutItems}
                            subTotal={subTotal}
                            shippingFee={shippingFee}
                            discountAmount={discountAmount}
                            finalTotal={finalTotal}
                            paymentMethod={paymentMethod}
                            isProcessing={isProcessing}
                            bonusPoints={bonusPoints}
                            applyBonusPoints={applyBonusPoints}
                            setApplyBonusPoints={setApplyBonusPoints}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckOut;