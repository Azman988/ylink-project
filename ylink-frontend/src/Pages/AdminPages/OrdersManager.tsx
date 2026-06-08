// OrdersManager.tsx
import { useState, useEffect } from 'react';
import { adminApi, type Order } from '../../data/adminAPI';
import { Search, Loader2, Package, ArrowUpRight } from 'lucide-react';

export default function OrdersManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const data = await adminApi.getOrders();
        setOrders(data);
        setLoading(false);
    };

    const handleStatusChange = async (id: string, newStatus: Order['status']) => {
        // Optimistic UI state update before backend validation
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'All' || order.status === statusFilter;
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
                    <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl min-w-[280px] shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
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
                        {['All', 'Processing', 'Shipped', 'Delivered'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusFilter(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${statusFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                                    <th className="px-6 py-5 font-black">Transaction Hash</th>
                                    <th className="px-6 py-5 font-black">Client Profile</th>
                                    <th className="px-6 py-5 font-black">Timeline</th>
                                    <th className="px-6 py-5 font-black">Cart Valuation</th>
                                    <th className="px-6 py-5 font-black text-center">Fulfillment State</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-sm font-medium text-slate-400">
                                            No active transactions in this pipeline segment.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-slate-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1">
                                                    {order.id} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                                <span className="block text-xs text-slate-400 font-medium mt-1">{order.items} {order.items === 1 ? 'item' : 'items'} via Checkout</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-800">{order.customer}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-1">{order.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{order.date}</td>
                                            <td className="px-6 py-4 text-sm font-black text-slate-900">₦{order.total.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider outline-none cursor-pointer appearance-none text-center shadow-sm transition-colors ${
                                                        order.status === 'Delivered' ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        order.status === 'Processing' ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200' :
                                                        order.status === 'Shipped' ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200' : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                                    }`}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
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
        </div>
    );
}