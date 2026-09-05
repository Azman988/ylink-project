import { useState, useEffect } from 'react';
import { adminApi, type Order } from '../../api/adminAPI';
import { Search, Loader2, Package, ArrowUpRight, Truck } from 'lucide-react';
import AssignDriverModal from '../../Components/AdminComponents/AssignDriverModal';
import { formatPriceWithCurrency } from '../../utils/money';
import { useToast } from '../../context/ToastContext';

export default function OrdersManager() {
    const { showToast } = useToast();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    
    // Modal State for Driver Assignment
    const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

    useEffect(() => { 
        fetchOrders(); 
    }, []);

    // Fetch Orders
    const fetchOrders = async () => {
        showToast("Fetching orders...");

        try {
            setLoading(true);
            const data = await adminApi.getOrders(1, 50);
            setOrders(data);

            showToast("Orders fetched successfully.", 'success');
        } catch (error) {
            console.error("Failed to fetch orders:", error);

            showToast("Failed to fetch orders. Please try again later.", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: Order['orderStatus']) => {
        showToast(`Updating Order Status to ${newStatus}...`);
        // Optimistic UI state update for instant feedback
        const previousOrders = [...orders];
        setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));

        try {
            // Perform the actual backend mutation
            await adminApi.updateOrderStatus(id, newStatus);

            showToast(`Order status updated to ${newStatus} successfully.`, 'success');
        } catch (error) {
            // Revert if the backend fails and notify the user
            console.error("Failed to update status:", error);
            setOrders(previousOrders);
            showToast("Failed to update order status. Please try again.", 'error');
        }
    };

    // Callback to update local state when a driver is successfully assigned
    const handleDriverAssigned = (updatedOrder: Order) => {
        setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    };

    const filteredOrders = orders.filter(order => {
        // Safely access populated user data
        const userName = order.user?.name || '';
        const userId = order.user?._id || '';

        const matchesSearch = 
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = statusFilter === 'All' || order.orderStatus === statusFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Order Fulfillment <Package className="text-slate-400" size={24} />
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Process shipments and mutate global tracking states.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl min-w-[280px] shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Search Order ID or Customer..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:font-normal"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-200/50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto custom-scrollbar">
                        {['All', 'Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                                    <th className="px-6 py-5 font-black">Transaction Hash</th>
                                    <th className="px-6 py-5 font-black">Customer Profile</th>
                                    <th className="px-6 py-5 font-black">Order Placed</th>
                                    <th className="px-6 py-5 font-black">Total Items</th>
                                    <th className="px-6 py-5 font-black">Cart Valuation</th>
                                    <th className="px-6 py-5 font-black">Total Paid</th>
                                    <th className="px-6 py-5 font-black">Payment Method</th>
                                    <th className="px-6 py-5 font-black">Payment Status</th>
                                    <th className="px-6 py-5 font-black">Logistics</th>
                                    <th className="px-6 py-5 font-black text-center">Fulfillment State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-sm font-medium text-slate-400">
                                            No active transactions in this pipeline segment.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-slate-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1">
                                                    {order._id} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                                <span className="block text-xs text-slate-400 font-medium mt-1">
                                                    {order.items} {order.items === 1 ? 'item' : 'items'} via Checkout
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800">{order.user?.name || 'Guest User'}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-1">{order.user?.email || 'N/A'}</p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-black text-slate-900">
                                                {order.orderItems.length || 0}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-black text-slate-900">
                                                {formatPriceWithCurrency(order.itemsPrice || 0)}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-black text-slate-900">
                                                {formatPriceWithCurrency(order.totalPrice || 0)}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-black text-slate-900">
                                                {order.paymentMethod || 'N/A'}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-black text-slate-900">
                                                <p className="text-sm font-bold text-slate-800">{order.paymentStatus || 'N/A'}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-1">{order.paystackReference || 'N/A'}</p>
                                            </td>
                                            
                                            {/* Delivery Driver Assignment Trigger */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setAssigningOrder(order)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer"
                                                >
                                                    <Truck size={14} />
                                                    <span>
                                                        {order.deliveryPerson ? 'Reassign Driver' : 'Assign Driver'}
                                                    </span>
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <select 
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value as Order['orderStatus'])}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider outline-none cursor-pointer appearance-none text-center shadow-sm transition-colors ${
                                                        order.orderStatus === 'Delivered' ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        order.orderStatus === 'Processing' ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200' :
                                                        order.orderStatus === 'Shipped' ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200' : 
                                                        order.orderStatus === 'Pending' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200' :
                                                        'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                                    }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal instance */}
            {assigningOrder && (
                <AssignDriverModal
                    order={assigningOrder}
                    isOpen={!!assigningOrder}
                    onClose={() => setAssigningOrder(null)}
                    onSuccess={handleDriverAssigned}
                />
            )}
        </div>
    );
}