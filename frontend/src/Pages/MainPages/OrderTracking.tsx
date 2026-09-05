import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search, Package, Truck, CheckCircle2,
    MapPin, Clock, Loader2, AlertCircle
} from 'lucide-react';
import { orderApi } from '../../api/orderApi';

// Adjust these interfaces based on your exact backend Mongoose schema
interface ShippingAddress {
    street: string;
    city: string;
    state: string;
}

interface TrackingData {
    _id: string;
    orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
    shippingAddress: ShippingAddress;
    expectedDeliveryDate?: string;
}

const OrderTrack: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const orderIdParam = searchParams.get('orderId') || '';

    const [searchInput, setSearchInput] = useState(orderIdParam);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchTracking = async (id: string) => {
        if (!id.trim()) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const data = await orderApi.trackOrder(id);
            console.log(data)

            setTrackingData(data.order || data);
            setStatus('success');
        } catch (error: any) {
            console.error("Tracking error:", error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Order not found. Please check your ID and try again.');
        }
    };

    // Auto-fetch if orderId is in the URL on load
    useEffect(() => {
        if (orderIdParam) {
            fetchTracking(orderIdParam);
        }
    }, [orderIdParam]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ orderId: searchInput.trim() });
        }
    };

    // Define the sequence of valid statuses to power the visual progress bar
    const statusSequence = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    const getCurrentStepIndex = () => {
        if (!trackingData) return -1;
        if (trackingData.orderStatus === 'Cancelled') return -1;
        return statusSequence.indexOf(trackingData.orderStatus);
    };

    const currentStep = getCurrentStepIndex();

    const lastUpdated = trackingData?.updatedAt
        ? new Date(trackingData.updatedAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'N/A';

    return (
        <div className={`min-h-screen bg-slate-50 px-4 ${status !== 'idle' && " pt-28 pb-20"} sm:px-6 lg:px-8`}>
            <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-screen">

                {/* Search Header */}
                <div className="min-w-full text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                        <Package className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Track Your Order</h1>
                    <p className="text-slate-500 font-medium">Enter your order reference ID to get real-time updates.</p>

                    <form onSubmit={handleSearch} className="mx-auto mt-6 relative">
                        <div className="relative w-full flex items-center">
                            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="e.g. 64d9f...8a2"
                                className="w-full pl-12 pr-32 py-3.5 bg-white border border-slate-200 rounded-full shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading' || !searchInput.trim()}
                                className="absolute right-2 bg-blue-600 hover:bg-blue-600/80 text-white font-bold py-2.5 px-5 rounded-full text-sm transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Track
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-slate-500 mt-5">
                        You can find your Order ID in your confirmation email or by checking your <Link to="/orders" className="text-blue-600 font-semibold hover:underline">Order History</Link>.
                    </p>
                </div>

                {/* Loading State */}
                {status === 'loading' && (
                    <div className="min-w-full flex flex-col items-center justify-center py-12 animate-pulse">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Locating your package...</p>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="min-w-full bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col items-center text-center animate-fade-in text-rose-600">
                        <AlertCircle className="w-10 h-10 mb-3" />
                        <h3 className="text-lg font-bold">Tracking Failed</h3>
                        <p className="text-sm font-medium mt-1">{errorMessage}</p>
                    </div>
                )}

                {/* Success State: Tracking Details */}
                {status === 'success' && trackingData && (
                    <div className="min-w-full bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden animate-fade-in-up">

                        {/* Status Banner */}
                        <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-slate-400 font-semibold text-sm uppercase tracking-wider mb-1">Order ID: {trackingData._id}</p>
                                    <h2 className="text-2xl font-black flex items-center gap-2">
                                        {trackingData.orderStatus === 'Cancelled' ? (
                                            <span className="text-rose-400">Order Cancelled</span>
                                        ) : trackingData.orderStatus === 'Delivered' ? (
                                            <span className="text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-6 h-6" /> Delivered</span>
                                        ) : (
                                            <span className="text-blue-400 flex items-center gap-2"><Truck className="w-6 h-6" /> {trackingData.orderStatus}</span>
                                        )}
                                    </h2>
                                </div>

                                {trackingData.orderStatus !== 'Cancelled' && trackingData.orderStatus !== 'Delivered' && (
                                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                        <p className="text-xs text-slate-300 font-medium mb-1">Last Updated</p>
                                        <p className="font-bold text-sm">
                                            {lastUpdated}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 sm:p-10">
                            {/* Visual Progress Bar (Hidden if cancelled) */}
                            {trackingData.orderStatus !== 'Cancelled' && (
                                <div className="mb-12 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500 ease-out"
                                        style={{ width: `${(Math.max(currentStep, 0) / (statusSequence.length - 1)) * 100}%` }}
                                    ></div>

                                    <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                                        {statusSequence.map((step, index) => {
                                            const isCompleted = index <= currentStep;
                                            const isCurrent = index === currentStep;

                                            // Assign icons based on step
                                            const StepIcon = index === 0 ? Clock : index === 1 ? Package : index === 2 ? Truck : index === 3 ? MapPin : CheckCircle2;

                                            return (
                                                <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-3 relative z-10">
                                                    <div className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300
                                                        ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-300'}
                                                        ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                                                    `}>
                                                        <StepIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="sm:text-center">
                                                        <p className={`font-bold text-sm ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                                                        {isCurrent && (
                                                            <p className="text-xs text-blue-600 font-semibold mt-0.5 sm:mt-1 hidden sm:block">Current Stage</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-600" /> Delivery Address
                                    </h3>
                                    <div className="text-slate-600 text-sm font-medium leading-relaxed">
                                        <p>{trackingData.shippingAddress?.street}</p>
                                        <p>{trackingData.shippingAddress?.city}, {trackingData.shippingAddress?.state}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" /> Timeline Overview
                                    </h3>
                                    <div className="space-y-2 text-sm font-medium">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Order Placed</span>
                                            <span className="text-slate-900">
                                                {new Date(trackingData.createdAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Last Activity</span>
                                            <span className="text-slate-900">{lastUpdated}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrack;