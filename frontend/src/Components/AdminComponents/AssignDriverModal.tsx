import React, { useState, useEffect } from 'react';
import { Truck, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { adminApi, type DeliveryDriver, type Order } from '../../api/adminAPI';

interface AssignDriverModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedOrder: Order) => void;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
    order,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<string>(order.deliveryPerson || '');
    const [isLoadingDrivers, setIsLoadingDrivers] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            fetchDrivers();
            setSelectedDriverId(order.deliveryPerson || '');
            setError('');
        }
    }, [isOpen, order]);

    const fetchDrivers = async () => {
        setIsLoadingDrivers(true);
        try {
            const data = await adminApi.getDeliveryDrivers();
            setDrivers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load delivery personnel.');
        } finally {
            setIsLoadingDrivers(false);
        }
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDriverId) {
            setError('Please select a delivery driver.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const updatedOrder = await adminApi.assignDelivery(order._id, selectedDriverId);
            onSuccess(updatedOrder);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to assign delivery driver.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden relative">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Assign Delivery Personnel</h2>
                            <p className="text-xs text-slate-400 font-medium">Order ID: #{order._id.slice(-6)}</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <form onSubmit={handleAssign} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Select Delivery Driver
                        </label>
                        
                        {isLoadingDrivers ? (
                            <div className="flex items-center justify-center py-6 border border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                <span className="text-xs font-medium">Loading available personnel...</span>
                            </div>
                        ) : (
                            <select
                                value={selectedDriverId}
                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                            >
                                <option value="">-- Choose a Personnel --</option>
                                {drivers.map((driver) => (
                                    <option key={driver._id} value={driver._id}>
                                        {driver.name} ({driver.email})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoadingDrivers || !selectedDriverId}
                            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Confirm Assignment</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignDriverModal;