import React, { useRef, useEffect, useState } from 'react';
import {
    Search,
    Package,
    Truck,
    CheckCircle2,
    MapPin,
    Calendar,
    ArrowLeft,
    Clock,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

// --- Types & Mock Data ---
type DeliveryStep = 'Placed' | 'Processing' | 'Packed & Ready' | 'Out for Delivery' | 'Delivered';

interface TrackingEvent {
    status: DeliveryStep;
    date: string;
    time: string;
    location: string;
    description: string;
    isCompleted: boolean;
    isCurrent: boolean;
}

interface TrackedOrder {
    id: string;
    expectedDelivery: string;
    courier: string;
    trackingNumber: string;
    customerName: string;
    deliveryAddress: string;
    items: { name: string; qty: number }[];
    timeline: TrackingEvent[];
}

const mockTrackingDatabase: Record<string, TrackedOrder> = {
    'ORD-2026-7741': {
        id: 'ORD-2026-7741',
        expectedDelivery: 'June 4, 2026',
        courier: 'YLink Logistics',
        trackingNumber: 'YLK-8890-NG',
        customerName: 'Usman Azeez',
        deliveryAddress: '123 Tech Hub Avenue, Ibadan, Oyo State',
        items: [
            { name: 'Noise-Canceling Earbuds Plus', qty: 2 },
            { name: 'Noise-Canceling Earbuds Plus', qty: 2 },
            { name: 'Noise-Canceling Earbuds Plus', qty: 2 }
        ],
        timeline: [
            {
                status: 'Delivered',
                date: '',
                time: '',
                location: '',
                description: 'Package will be handed to the recipient.',
                isCompleted: false,
                isCurrent: false,
            },
            {
                status: 'Out for Delivery',
                date: '',
                time: '',
                location: '',
                description: 'Package will be dispatched with a local rider.',
                isCompleted: false,
                isCurrent: false,
            },
            {
                status: 'Packed & Ready',
                date: 'May 30, 2026',
                time: '08:45 AM',
                location: 'YLink Distribution Center, Ibadan',
                description: 'Package has left the main distribution facility and is in transit.',
                isCompleted: true,
                isCurrent: true,
            },
            {
                status: 'Processing',
                date: 'May 21, 2026',
                time: '02:15 PM',
                location: 'YLink Shop, Ibadan',
                description: 'Order confirmed, payment verified, and items packed.',
                isCompleted: true,
                isCurrent: false,
            },
            {
                status: 'Placed',
                date: 'May 20, 2026',
                time: '10:30 AM',
                location: 'YLink Online Store',
                description: 'Order received by YLink Tech.',
                isCompleted: true,
                isCurrent: false,
            }
        ]
    }
};

const OrderTracking: React.FC = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const navigate = useNavigate()
    const [orderIdInput, setOrderIdInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeOrder, setActiveOrder] = useState<TrackedOrder | null>(null);


    const id = searchParams.get('orderId')
    const isInitialLoad = useRef<boolean>(true);
    useEffect(() => {
        if (isInitialLoad.current && id) {
            if (id !== undefined) setOrderIdInput(id);
            isInitialLoad.current = false;
        }
    }, []);

    // --- Handlers ---
    const handleTrackOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderIdInput.trim() || !emailInput.trim()) return;

        setIsSearching(true);
        setError(null);

        // Simulate network latency
        setTimeout(() => {
            setIsSearching(false);
            const order = mockTrackingDatabase[orderIdInput.trim().toUpperCase()];

            if (order) {
                setActiveOrder(order);
                setSearchParams({ orderId: orderIdInput.trim().toUpperCase() });
            } else {
                setError("We couldn't find an order matching that ID. Please check the number and try again.");
            }

        }, 1500);
    };

    const handleReset = () => {
        setActiveOrder(null);
        setOrderIdInput('');
        setError(null);
        setSearchParams({});
    };

    // --- Render Helpers ---
    const getStepIcon = (status: DeliveryStep, isCompleted: boolean, isCurrent: boolean) => {
        const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 bg-white ";

        if (isCurrent) {
            return (
                <div className={baseClasses + "border-blue-600 text-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"}>
                    <Truck className="w-5 h-5 animate-pulse" />
                </div>
            );
        }

        if (isCompleted) {
            return (
                <div className={baseClasses + "border-green-500 bg-green-50 text-green-600"}>
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            );
        }

        // Pending
        return (
            <div className={baseClasses + "border-slate-200 text-slate-300"}>
                {status === 'Delivered' ? <MapPin className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
        );
    };

    const handleNavToSupport = () => {
        navigate('/support')
        scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header (Hidden when tracking an order to save space) */}
                {!activeOrder && (
                    <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                            <Package className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Track Your Package
                        </h1>
                        <p className="text-slate-500">
                            Enter your tracking number or Order ID below to get real-time updates on your delivery status.
                        </p>
                    </div>
                )}

                {/* Tracking Input Form */}
                {!activeOrder ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <form onSubmit={handleTrackOrder} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Order ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={orderIdInput}
                                        onChange={(e) => setOrderIdInput(e.target.value)}
                                        placeholder="e.g., ORD-2026-7741"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-lg border border-gray-300 outline-none focus:border-blue-500 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="The email used for the order"
                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-lg border border-gray-300 outline-none focus:border-blue-500 transition-all text-slate-900"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSearching}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                            >
                                {isSearching ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Track Order'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-500">
                                You can find your Order ID in your confirmation email or by checking your <Link to="/orders" className="text-blue-600 font-semibold hover:underline">Order History</Link>.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Active Tracking Results View */
                    <div className="animate-fade-in-up">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" /> Track Another Order
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Timeline Stepper */}
                            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Order {activeOrder.id}</h2>
                                        <p className="text-slate-500 text-sm mt-1">Via {activeOrder.courier} • Tracking: <span className="font-mono font-medium text-slate-700">{activeOrder.trackingNumber}</span></p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-center sm:text-right">
                                        <p className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-80">Estimated Delivery</p>
                                        <p className="font-bold text-sm flex items-center gap-1.5 justify-center sm:justify-end">
                                            <Calendar className="w-4 h-4" /> {activeOrder.expectedDelivery}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative pl-4 sm:pl-0">
                                    {/* Vertical line connecting nodes */}
                                    <div className="absolute top-6 bottom-6 left-[35px] sm:left-[19px] w-0.5 bg-slate-100"></div>

                                    <div className="space-y-8 relative">
                                        {activeOrder.timeline.map((event, index) => (
                                            <div key={index} className={`relative flex items-start gap-6 ${!event.isCompleted && !event.isCurrent ? 'opacity-50' : ''}`}>

                                                {getStepIcon(event.status, event.isCompleted, event.isCurrent)}

                                                <div className="flex-1 pt-1.5 pb-2">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                        <h3 className={`font-bold text-base ${event.isCurrent ? 'text-blue-700' : 'text-slate-900'}`}>
                                                            {event.status}
                                                        </h3>
                                                        {event.date && (
                                                            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                                                {event.date} • {event.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed mb-1">
                                                        {event.description}
                                                    </p>
                                                    {event.location && (
                                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" /> {event.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Shipment Details Card */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-4 border-b border-slate-100 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" /> Delivery Address
                                    </h3>
                                    <p className="font-bold text-slate-800 text-sm">{activeOrder.customerName}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                        {activeOrder.deliveryAddress}
                                    </p>
                                </div>

                                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-4 border-b border-slate-100 flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-slate-400" /> Package Contents
                                    </h3>
                                    <div className="space-y-3">
                                        {activeOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-start justify-between gap-4">
                                                <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                                                <p className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">x{item.qty}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-3xl shadow-sm p-6 text-white text-center">
                                    <h4 className="font-bold text-sm mb-2">Need help with your delivery?</h4>
                                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                                        If you have questions about your shipment routing or need to update instructions, our support team is available.
                                    </p>
                                    <button onClick={() => handleNavToSupport()} className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;