import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Package, ChevronDown, MapPin, CreditCard, Download,
    RefreshCw, Inbox, Clock, Truck, CheckCircle2,
    XCircle, Loader2, AlertCircle,
    Copy
} from 'lucide-react';
import { InvoiceTemplate } from '../../Components/MainComponents/InvoiceTemplate';
import { useNavigate } from 'react-router-dom';
import { orderApi, type Order } from '../../api/orderApi';
import { formatPriceWithCurrency } from '../../utils/money';
import { useToast } from '../../context/ToastContext';

type TabType = 'All' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

// Define the static list of tabs to render
const FILTER_TABS: TabType[] = [
    'All',
    'Processing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
];

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // --- State ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('All');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Invoice engine states
    const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
    const [isCompiling, setIsCompiling] = useState<string | null>(null);

    // --- Backend Fetching ---
    const fetchUserOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await orderApi.getMyOrders();

            setOrders(data);
        } catch (err: any) {
            console.error('API Error fetching user orders:', err);
            setError(err?.message || 'Failed to load orders. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    // --- Computed Data ---
    const filteredOrders = useMemo(() => {
        if (activeTab === 'All') return orders;
        return orders?.filter((order) => order.orderStatus === activeTab);
    }, [orders, activeTab]);

    const { activeCount, deliveredCount } = useMemo(() => {
        const active = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Out for Delivery').length;
        const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;
        return { activeCount: active, deliveredCount: delivered };
    }, [orders]);

    // --- Handlers ---
    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderId(prev => (prev === orderId ? null : orderId));
    };

    const handleDownloadInvoice = (order: Order) => {
        setIsCompiling(order._id);
        setSelectedInvoiceOrder(order);
        setTimeout(() => {
            setIsCompiling(null);
            window.print();
            // Reset selected invoice after print dialog completes
            setTimeout(() => setSelectedInvoiceOrder(null), 1000);
        }, 600);
    };

    const getStatusBadge = (status: TabType) => {
        switch (status) {
            case 'Delivered':
                return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-4 w-4" /> };
            case 'Processing':
                return { style: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Clock className="h-4 w-4" /> };
            case 'Out for Delivery':
                return { style: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Truck className="h-4 w-4" /> };
            case 'Cancelled':
                return { style: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="h-4 w-4" /> };
            default:
                return { style: 'bg-slate-50 text-slate-700 border-slate-200', icon: <Clock className="h-4 w-4" /> };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 print:bg-white print:py-0">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 print:hidden">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                            Order History
                        </h1>
                        <p className="text-slate-500 font-medium">View, track, and manage your recent purchases.</p>
                    </div>

                    {/* Dashboard Stats */}
                    <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Orders</p>
                                <p className="text-xl font-black text-slate-900 leading-none mt-1">{isLoading ? '-' : activeCount}</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Completed</p>
                                <p className="text-xl font-black text-slate-900 leading-none mt-1">{isLoading ? '-' : deliveredCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-700 text-sm">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="font-semibold">{error}</span>
                        </div>
                        <button
                            onClick={fetchUserOrders}
                            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shrink-0"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Tabs / Filters */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-2xl text-sm whitespace-nowrap font-bold transition-all duration-200 cursor-pointer border select-none 
                                ${activeTab === tab
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {isLoading ? (
                    <OrdersSkeleton />
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Inbox className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">No orders found</h3>
                                <p className="text-slate-500 max-w-md mx-auto font-medium">
                                    You don't have any orders {activeTab !== 'All' ? `with the status "${activeTab}"` : 'yet'}. Explore our store to place a new order.
                                </p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const isExpanded = expandedOrderId === order._id;
                                const badgeMeta = getStatusBadge(order.orderStatus as TabType) || 'processing';

                                return (
                                    <div key={order._id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-sm">

                                        {/* Order Card Header */}
                                        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white relative z-10">
                                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                                {/* Order ID */}
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                                                        Order ID
                                                    </p>
                                                    <p className="font-semibold text-slate-900">
                                                        {order._id} <Copy className="w-4 h-4 text-slate-400 inline-block ml-1 cursor-pointer" onClick={() => {
                                                            navigator.clipboard.writeText(order._id)
                                                            showToast('Order ID copied to clipboard.', 'success')
                                                        }} />
                                                    </p>
                                                </div>

                                                {/* Date Placed */}
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Date Placed</p>
                                                    <p className="font-semibold text-sm text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</p>
                                                </div>

                                                {/* Total Amount */}
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                                                        Total Amount
                                                    </p>
                                                    <p className="font-bold text-md text-blue-600">
                                                        {formatPriceWithCurrency(order.totalPrice)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-2 ${badgeMeta.style}`}>
                                                    {badgeMeta.icon}
                                                    {order.orderStatus}
                                                </span>

                                                <button
                                                    onClick={() => toggleOrderDetails(order._id)}
                                                    aria-expanded={isExpanded}
                                                    className="text-sm font-semibold text-blue-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                                                >
                                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Collapsible Order Details */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8">

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                                        {/* Items List */}
                                                        <div className="md:col-span-2 space-y-4">
                                                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider pb-2 flex items-center gap-2">
                                                                <Package className="h-4 w-4" /> Items in this Order
                                                            </h4>
                                                            {order.orderItems.map(item => (
                                                                <div key={item._id} className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-sm transition-shadow">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                                                                            <img src={item.image} alt="" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-slate-900 text-sm line-clamp-1">{item.name}</p>
                                                                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="font-black text-slate-900 text-sm pl-4">
                                                                        {formatPriceWithCurrency(item.price * item.quantity)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Delivery & Payment Details */}
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider pb-2 mb-2 flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4" /> Delivery Destination
                                                                </h4>
                                                                <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                                                    {order.shippingAddress.street} {order.shippingAddress.city}, {order.shippingAddress.state}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider pb-2 mb-2 flex items-center gap-2">
                                                                    <CreditCard className="h-4 w-4" /> Payment Method
                                                                </h4>
                                                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                                                    <p className="text-sm text-slate-700 font-bold">{order.paymentMethod === 'pod' ? 'Pay On Delivery' : 'Paystack'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Controls */}
                                                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                                                        {order.orderStatus === 'Delivered' && (
                                                            <button
                                                                onClick={() => handleDownloadInvoice(order)}
                                                                disabled={isCompiling !== null}
                                                                className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {isCompiling === order._id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                                ) : (
                                                                    <Download className="h-4 w-4 text-slate-400" />
                                                                )}
                                                                Download Invoice
                                                            </button>
                                                        )}

                                                        {order.orderStatus === 'Out for Delivery' && (
                                                            <button
                                                                onClick={() => {
                                                                    navigate(`/orders-track?orderId=${order._id}`)
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <MapPin className="h-4 w-4" /> Track Order
                                                            </button>
                                                        )}

                                                        {order.orderStatus === 'Delivered' && order.orderItems.length > 0 && (
                                                            <button
                                                                onClick={() => navigate(`/product/${order.orderItems[0].product.slug}`)}
                                                                className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
                                                            >
                                                                <RefreshCw className="h-4 w-4" /> Buy Again
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Invoice Print Mounting */}
            {selectedInvoiceOrder && (
                <InvoiceTemplate
                    orderId={selectedInvoiceOrder._id}
                    orderDate={selectedInvoiceOrder.createdAt}
                    customerName={selectedInvoiceOrder.user.name}
                    customerEmail={selectedInvoiceOrder.user.email}
                    customerPhone={selectedInvoiceOrder.user.phone}
                    shippingAddress={selectedInvoiceOrder.shippingAddress}
                    shippingPrice={selectedInvoiceOrder.shippingPrice}
                    items={selectedInvoiceOrder.orderItems}
                    paymentMethod={selectedInvoiceOrder.paymentMethod}
                />
            )}
        </div>
    );
};

export default Orders;

// --- Loading Skeleton ---
function OrdersSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex gap-x-10 gap-y-4">
                        <div className="space-y-2"><div className="w-16 h-3 bg-slate-100 rounded" /><div className="w-24 h-5 bg-slate-200 rounded" /></div>
                        <div className="space-y-2"><div className="w-20 h-3 bg-slate-100 rounded" /><div className="w-28 h-5 bg-slate-200 rounded" /></div>
                        <div className="space-y-2"><div className="w-20 h-3 bg-slate-100 rounded" /><div className="w-24 h-5 bg-slate-200 rounded" /></div>
                    </div>
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
                        <div className="w-28 h-8 bg-slate-200 rounded-full" />
                        <div className="w-24 h-4 bg-slate-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}