import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Box, Loader2, ArrowUpRight } from 'lucide-react';
import { adminApi, type Order } from '../../data/adminAPI';

export default function DashboardHome({ handleNavigation }: any) {
    const [metrics, setMetrics] = useState({ totalOrders: 0, totalUsers: 0, totalProducts: 0, recentOrders: [] as Order[] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            const data = await adminApi.getDashboardMetrics();
            setMetrics(data);
            setTimeout(() => { setLoading(false); }, 1000)
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen '>
                <div className="fixed flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Loading Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 text-sm mt-1 mb-8">High-level metrics and recent transactional flow.</p>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                        <h2 className="text-4xl font-black text-slate-900">{metrics.totalOrders}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><ShoppingBag size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                        <h2 className="text-4xl font-black text-slate-900">{metrics.totalUsers}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Users size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Products Configured</p>
                        <h2 className="text-4xl font-black text-slate-900">{metrics.totalProducts}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Box size={24} /></div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900 text-lg">Recent Transactions</h3>
                    <button onClick={() => handleNavigation('orders')} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:text-blue-700 transition-colors cursor-pointer">
                        View All <ArrowUpRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold">Order ID</th>
                                <th className="px-6 py-4 font-bold">Customer</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.recentOrders.map(order => (
                                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{order.customer}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">₦{order.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}