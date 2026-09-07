import { useState, useEffect } from 'react';
import { PackageCheck, KeyRound, Loader2, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { orderApi, type DriverOrder } from '../../../api/orderApi';
import { useToast } from '../../../context/ToastContext';
import { formatPriceWithCurrency } from '../../../utils/money';

export default function DriverOrdersView() {
    const { showToast } = useToast();

    const [orders, setOrders] = useState<DriverOrder[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<DriverOrder | null>(null);
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadAssignedOrders();
    }, []);

    const loadAssignedOrders = async () => {
        showToast('Fetching your assigned deliveries...');

        try {
            setLoading(true);
            const data = await orderApi.getAssignedOrders();
            setOrders(data);

            showToast('Assigned deliveries loaded successfully.', 'success');
        } catch (err) {
            console.error('Error fetching driver orders:', err);

            showToast('Failed to fetch assigned deliveries.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelivery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder || !code.trim()) return;

        try {
            setSubmitting(true);
            setErrorMessage('');
            const updatedOrder = await orderApi.markAsDelivered(selectedOrder._id, code);

            showToast('Delivery confirmed successfully.', 'success');

            // Update UI state
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            closeModal();
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || 'Verification failed. Please check the code.');

            showToast('Failed to confirm delivery.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setCode('');
        setErrorMessage('');
    };

    return (
        <div className="max-w-4xl mx-auto min-h-screen bg-slate-50 text-slate-800 font-sans py-15 my-10 px-6">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    Assigned Deliveries <PackageCheck className="text-blue-600" size={24} />
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage and complete assigned customer orders.</p>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white h-100 border border-slate-200 rounded-2xl p-12 flex items-center justify-center text-slate-500">
                    No active deliveries assigned to you right now.
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-bold text-slate-900">#{order._id.slice(-8)}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${order.orderStatus === 'Delivered'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                        }`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="text-sm font-semibold text-slate-800">{order.user?.name || 'Customer'}</div>
                                {order.shippingAddress && (
                                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <MapPin size={14} className="shrink-0 text-slate-400" />
                                        <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</span>
                                    </div>
                                )}
                                {order.user?.phone && (
                                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Phone size={14} className="shrink-0 text-slate-400" />
                                        <span>{order.user.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                                <span className="font-bold text-slate-900">
                                    {order.paymentStatus === 'Completed' 
                                        ? 'Payment Completed'
                                        :  `To be paid: ${formatPriceWithCurrency(order.totalPrice)}`
                                    }
                                </span>

                                {order.orderStatus === 'Delivered' ? (
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                        <CheckCircle2 size={16} /> Delivered
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                                    >
                                        <KeyRound size={14} /> Enter Delivery Code
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Verification Code Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <KeyRound size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-lg">Confirm Delivery</h3>
                                <p className="text-slate-500 text-xs">Order #{selectedOrder._id.slice(-8)}</p>
                            </div>
                        </div>

                        <form onSubmit={handleConfirmDelivery} className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Ask <strong className="text-slate-900">{selectedOrder.user?.name}</strong> for their 6-digit confirmation PIN to complete delivery.
                            </p>

                            {errorMessage && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Customer Verification Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="e.g. 482910"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || code.length < 4}
                                    className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Delivery'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}