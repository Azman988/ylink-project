import React, { useState, useEffect, useMemo } from 'react';
import {
    Package, ChevronDown, MapPin, CreditCard, Download,
    RefreshCw, Compass, Inbox, Clock, Truck, CheckCircle2,
    XCircle, Loader2
} from 'lucide-react';
import { InvoiceTemplate } from '../../Components/MainComponents/InvoiceTemplate';
import { useNavigate } from 'react-router-dom';

// --- Interfaces ---
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageIcon: 'sun' | 'headphones' | 'laptop';
}

type OrderStatus = 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
}

// --- Fallback Mock Data ---
const mockOrders: Order[] = [
    {
        id: 'ORD-2026-8923',
        date: 'May 28, 2026',
        status: 'Processing',
        total: 625000,
        customerName: 'Usman Azeez',
        customerEmail: 'usman@ylinktech.com',
        customerPhone: '0803 123 4567',
        paymentMethod: 'Paystack',
        shippingAddress: '123 Tech Hub Avenue, Ibadan, Oyo State',
        items: [
            { id: 'p4', name: 'Monocrystalline Solar Panel 200W', price: 175000, quantity: 2, imageIcon: 'sun' },
            { id: 'p04', name: 'Monocrystalline Solar Panel 200W', price: 275000, quantity: 4, imageIcon: 'sun' }
        ],
    },
    {
        id: 'ORD-2026-7741',
        date: 'May 20, 2026',
        status: 'Out for Delivery',
        total: 298500,
        customerName: 'Usman Azeez',
        customerEmail: 'usman@ylinktech.com',
        customerPhone: '0803 123 4567',
        paymentMethod: 'Pay on Delivery',
        shippingAddress: '123 Tech Hub Avenue, Ibadan, Oyo State',
        items: [
            { id: 'p3', name: 'Noise-Canceling Earbuds Plus', price: 149250, quantity: 2, imageIcon: 'headphones' },
        ],
    },
    {
        id: 'ORD-2026-5112',
        date: 'April 15, 2026',
        status: 'Delivered',
        total: 1950000,
        customerName: 'Usman Azeez',
        customerEmail: 'usman@ylinktech.com',
        customerPhone: '0803 123 4567',
        paymentMethod: 'Paystack',
        shippingAddress: '123 Tech Hub Avenue, Ibadan, Oyo State',
        items: [
            { id: 'p1', name: 'ProBook X-Series Enterprise Laptop', price: 1950000, quantity: 1, imageIcon: 'laptop' },
        ],
    },
];

const Orders: React.FC = () => {
    const navigate = useNavigate();

    // --- State ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Invoice engine states
    const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
    const [isCompiling, setIsCompiling] = useState<string | null>(null);

    // --- Backend Fetching ---
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setIsLoading(true);
                // Replace with your actual auth-secured endpoint
                const response = await fetch('/api/user/orders');
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('API Error: Falling back to local mock data.', error);
                setOrders(mockOrders);
            } finally {
                // Slight delay for smooth visual transition
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        fetchUserOrders();
    }, []);

    // --- Computed Data ---
    const filteredOrders = useMemo(() => {
        return orders.filter(order => activeTab === 'All' || order.status === activeTab);
    }, [orders, activeTab]);

    const activeCount = orders.filter(o => o.status === 'Processing' || o.status === 'Out for Delivery').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

    // --- Handlers ---
    const toggleOrderDetails = (orderId: string) => setExpandedOrderId(prev => (prev === orderId ? null : orderId));

    const handleDownloadInvoice = (order: Order) => {
        setIsCompiling(order.id);
        setSelectedInvoiceOrder(order);
        setTimeout(() => {
            setIsCompiling(null);
            window.print();
        }, 800);
    };

    const handleNavToTrack = (orderId: string) => {
        navigate(`/orders-track?orderId=${orderId}`);
        setExpandedOrderId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- UI Helpers ---
    const renderItemIcon = (type: 'sun' | 'headphones' | 'laptop') => {
        switch (type) {
            case 'sun': return <span className="text-xl">☀️</span>;
            case 'headphones': return <span className="text-xl">🎧</span>;
            case 'laptop': return <span className="text-xl">💻</span>;
            default: return <Package className="h-5 w-5 text-slate-400" />;
        }
    };

    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case 'Delivered': return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-4 w-4" /> };
            case 'Processing': return { style: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Clock className="h-4 w-4" /> };
            case 'Out for Delivery': return { style: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Truck className="h-4 w-4" /> };
            case 'Cancelled': return { style: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="h-4 w-4" /> };
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

                    {/* Updated Dashboard Stats */}
                    <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Orders</p>
                                <p className="text-xl font-black text-slate-900 leading-none mt-1">{isLoading ? '-' : activeCount}</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Completed</p>
                                <p className="text-xl font-black text-slate-900 leading-none mt-1">{isLoading ? '-' : deliveredCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs / Filters */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
                    {['All', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-5 py-2.5 rounded-2xl text-sm whitespace-nowrap font-bold transition-all duration-300 cursor-pointer border select-none 
                                ${activeTab === tab
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm'
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
                                    You don't have any orders with the status "{activeTab}". Check back later or explore our store to place a new order.
                                </p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const isExpanded = expandedOrderId === order.id;
                                const badgeMeta = getStatusBadge(order.status);

                                return (
                                    <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300 group">

                                        {/* Order Card Header (Always Visible) */}
                                        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white relative z-10">
                                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Order ID</p>
                                                    <p className="font-black text-slate-900">{order.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Date Placed</p>
                                                    <p className="font-bold text-slate-700">{order.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Total Amount</p>
                                                    <p className="font-black text-blue-600">₦{order.total.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-2 ${badgeMeta.style}`}>
                                                    {badgeMeta.icon}
                                                    {order.status}
                                                </span>
                                                <button
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                    className="text-sm font-bold text-blue-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                                                >
                                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                                    <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Details Accordion (Collapsible) */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8">

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                                        {/* Items List */}
                                                        <div className="md:col-span-2 space-y-4">
                                                            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider pb-2 flex items-center gap-2">
                                                                <Package className="h-4 w-4" /> Items in this Order
                                                            </h4>
                                                            {order.items.map(item => (
                                                                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                                                            {renderItemIcon(item.imageIcon)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</p>
                                                                            <p className="text-xs font-bold text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="font-black text-slate-900 text-sm pl-4">
                                                                        ₦{(item.price * item.quantity).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Delivery & Payment Info */}
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider pb-2 mb-2 flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4" /> Destination
                                                                </h4>
                                                                <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                                                    {order.shippingAddress}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider pb-2 mb-2 flex items-center gap-2">
                                                                    <CreditCard className="h-4 w-4" /> Payment
                                                                </h4>
                                                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                                                    <p className="text-sm text-slate-700 font-bold">{order.paymentMethod}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Control Nodes */}
                                                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                                                        {(order.status === 'Processing' || order.status === 'Out for Delivery') && (
                                                            <button onClick={() => handleNavToTrack(order.id)} className="px-6 py-3 bg-blue-600 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer">
                                                                <Compass className="h-4 w-4" /> Track Package
                                                            </button>
                                                        )}

                                                        {order.status === 'Delivered' && (
                                                            <button
                                                                onClick={() => handleDownloadInvoice(order)}
                                                                disabled={isCompiling !== null}
                                                                className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {isCompiling === order.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                                ) : (
                                                                    <Download className="h-4 w-4 text-slate-400" />
                                                                )}
                                                                Download Invoice
                                                            </button>
                                                        )}

                                                        {order.status === 'Delivered' && (
                                                            <button onClick={() => navigate(`/product/${order.items[0].id}`)} className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer">
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

            {/* --- INVOICE PRINT ELEMENT MOUNT --- */}
            {selectedInvoiceOrder && (
                <InvoiceTemplate
                    orderId={selectedInvoiceOrder.id}
                    orderDate={selectedInvoiceOrder.date}
                    customerName={selectedInvoiceOrder.customerName}
                    customerEmail={selectedInvoiceOrder.customerEmail}
                    customerPhone={selectedInvoiceOrder.customerPhone}
                    shippingAddress={selectedInvoiceOrder.shippingAddress}
                    items={selectedInvoiceOrder.items}
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