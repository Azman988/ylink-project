import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Box, Loader2, ArrowUpRight, Wallet } from 'lucide-react';
import { adminApi, type DashboardMetrics } from '../../api/adminAPI';
import { formatPrice, formatPriceWithCurrency } from '../../utils/money';

interface DashboardHomeProps {
    handleNavigation: (path: any) => void;
}

export default function DashboardHome({ handleNavigation }: DashboardHomeProps) {
    // Strictly typed state matching your exact schema
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await adminApi.getDashboardMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to load dashboard metrics:", error);
            } finally {
                setTimeout(() => { setLoading(false); }, 1000);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className="fixed flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    // Helper for rendering status badges based on exact union type
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-100 text-emerald-700';
            case 'Out for Delivery': return 'bg-teal-100 text-teal-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Cancelled': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1 mb-8">High-level metrics and recent transactional flow.</p>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Revenue</p>
                        <h2 className="text-3xl font-black text-slate-900">{formatPriceWithCurrency(metrics.totalRevenue)}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Wallet size={24} /></div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                        <h2 className="text-3xl font-black text-slate-900">{metrics.totalOrders.toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><ShoppingBag size={24} /></div>
                </div>

                {/* Total Users Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Users</p>
                        <h2 className="text-3xl font-black text-slate-900">{metrics.totalUsers.toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Users size={24} /></div>
                </div>

                {/* Total Products Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Products</p>
                        <h2 className="text-3xl font-black text-slate-900">{metrics.totalProducts.toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Box size={24} /></div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900 text-lg">
                        Recent Transactions
                    </h3>

                    <button onClick={() => handleNavigation('orders')} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:text-blue-700 transition-colors cursor-pointer">
                        View All <ArrowUpRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <th className="px-6 py-4 font-bold">Order Hash</th>
                                <th className="px-6 py-4 font-bold">Client Profile</th>
                                <th className="px-6 py-4 font-bold">Order Placed</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Valuation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {metrics.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-slate-400">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            ) : (
                                metrics.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-black text-slate-900">
                                            {order._id.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">{order.user?.name || 'Guest User'}</p>
                                            <p className="text-xs text-slate-500 font-medium">{order.user?.email || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">
                                            ₦{formatPrice(order.totalPrice)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}