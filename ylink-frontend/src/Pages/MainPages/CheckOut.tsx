import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, InfoIcon, MapPin, TriangleAlert, Plus, ShieldCheck, ShoppingBag } from 'lucide-react';

import AddressList from '../../Components/MainComponents/CheckOut/AddressList';
import OrderSummary from '../../Components/MainComponents/CheckOut/OrderSummary';
import PaymentMethod from '../../Components/MainComponents/CheckOut/PaymentMethod';
import AddressModal from '../../Components/MainComponents/Address/AddressModal';
import { useCart } from '../../Components/MainComponents/Cart/useCart';
import { usePaystack } from '../../hooks/usePaystack';

export interface Address {
    id: string;
    label: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip?: string;
    isDefault: boolean;
}

interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'info';
}

const CheckOut: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    // --- State Management ---
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('paystack');
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const emptyForm: Omit<Address, 'id'> = {
        label: 'residential',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: 'Oyo',
        isDefault: false,
    };

    const [formData, setFormData] = useState<Omit<Address, 'id'>>(emptyForm);
    const MAX_ADDRESSES = import.meta.env.MAX_ADDRESSES || 2;

    // --- Order Calculations ---
    const subtotal = cartItems.reduce((acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity, 0);
    const shippingFee = 5000; // Flat rate
    const total = subtotal + shippingFee;
    const activeAddress = addresses.find(a => a.id === editingId);

    // --- Fetch Addresses ---
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await fetch('/api/user/addresses');
                if (!response.ok) throw new Error();
                const data = await response.json();
                setAddresses(data);

                const defaultAddr = data.find((a: Address) => a.isDefault);
                if (defaultAddr) setEditingId(defaultAddr.id);
                else if (data.length > 0) setEditingId(data[0].id);
            } catch (err) {
                console.warn('Backend offline, using fallback instance schema array storage context.');
            }
        };
        fetchAddresses();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // --- Paystack Configuration ---
    const { initializePayment } = usePaystack();
    const handlePaystackCheckout = () => {
        if (!activeAddress) {
            showToast("Please add or select a delivery address.", "error");
            return;
        }
        if (cartItems.length === 0) {
            showToast("Your cart is empty.", "error");
            return;
        }
        initializePayment({
            email: activeAddress?.email || '',
            amount: total * 100, // Paystack expects lowest currency unit (Kobo)
            onSuccess: async (reference: any) => {
                showToast("Payment successful! Finalizing order...", "success");
                setIsProcessing(true);

                try {
                    // Send reference to backend for verification and order creation
                    const response = await fetch('/api/orders/verify-paystack', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            reference: reference.reference,
                            addressId: activeAddress?.id,
                            items: cartItems,
                            totalAmount: total,
                        }),
                    });

                    if (!response.ok) throw new Error('Order verification failed');

                    navigate(`/order-received?ref=${reference.reference}`);
                } catch (error) {
                    showToast("Error securing order data. Please contact support.", "error");
                    setIsProcessing(false);
                }
            },
            onCancel: () => {
                showToast("Payment window closed.", "info");
            }
        });
    };

    // --- Standard Checkout (Pay on Delivery) ---
    const handleStandardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeAddress) {
            showToast("Please add or select a delivery address.", "error");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: activeAddress.id,
                    items: cartItems,
                    paymentMethod: 'pod',
                    totalAmount: total,
                }),
            });

            if (!response.ok) throw new Error('Failed to create order');
            const data = await response.json();

            navigate(`/order-received?ref=${data.orderReference || 'pod_success'}`);
        } catch (error) {
            showToast("Failed to submit order. Try again later.", "error");
            setIsProcessing(false);
        }
    };

    // --- Address Modals & Handlers ---
    const handleOpenModal = (address?: Address) => {
        if (address) {
            setFormData(address);
            setEditingId(address.id);
            setIsModalOpen(true);
        } else {
            if (addresses.length >= MAX_ADDRESSES) {
                showToast(`Maximum limit of ${MAX_ADDRESSES} saved addresses reached.`, 'error');
                return;
            }
            setFormData(emptyForm);
            setEditingId(null);
            setIsModalOpen(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error();

            const updatedAddresses = addresses.filter(addr => addr.id !== id);
            if (editingId === id) {
                const fallback = updatedAddresses.find(a => a.isDefault) || updatedAddresses[0];
                setEditingId(fallback ? fallback.id : null);
            }
            setAddresses(updatedAddresses);
            showToast('Address removed successfully', 'success');
        } catch (err) {
            showToast('Error removing address.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 pt-28 relative selection:bg-blue-500 selection:text-white">

            {toast && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down dynamic-toast">
                    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-xs text-white font-bold border ${toast.type === 'error' ? 'bg-rose-600 border-rose-700' : toast.type === 'success' ? 'bg-slate-900 border-slate-950' : 'bg-blue-600 border-blue-700'
                        }`}>
                        {toast.type === 'error' ? <TriangleAlert className="w-4 h-4 shrink-0" /> : toast.type === 'success' ? <CheckIcon className="w-4 h-4 shrink-0" /> : <InfoIcon className="w-4 h-4 shrink-0" />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                            <ShoppingBag className="w-3.5 h-3.5" /> Secure Checkout Gateway
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review and Pay</h1>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200/60 shadow-md px-3 py-2 rounded-xl w-fit">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> End-to-End Encrypted
                    </div>
                </div>

                <form onSubmit={paymentMethod === 'pod' ? handleStandardSubmit : (e) => e.preventDefault()} className="flex flex-col lg:flex-row gap-8 items-start">

                    <div className="w-full lg:w-2/3 space-y-6">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">Delivery Information</h2>
                                        <p className="text-xs text-slate-400 font-medium">Where should we drop off your items?</p>
                                    </div>
                                </div>

                                {addresses.length > 0 && addresses.length < MAX_ADDRESSES && (
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModal()}
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> New Destination
                                    </button>
                                )}
                            </div>

                            {addresses.length === 0 ? (
                                <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-10 text-center flex flex-col items-center justify-center animate-fade-in">
                                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3 border border-slate-200">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 mb-1">No Delivery Address Found</h4>
                                    <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5 font-medium leading-relaxed">
                                        You haven't saved any addresses yet. Add a destination slot to map checkout logistics.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModal()}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-slate-950 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" /> Add Delivery Address
                                    </button>
                                </div>
                            ) : (
                                <AddressList
                                    addresses={addresses}
                                    editingId={editingId}
                                    setEditingId={setEditingId}
                                    handleDelete={handleDelete}
                                    handleOpenModal={handleOpenModal}
                                />
                            )}
                        </div>

                        <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                    </div>

                    <div className="w-full lg:w-1/3 sticky top-28">
                        <OrderSummary
                            cartItems={cartItems}
                            subtotal={subtotal}
                            shippingFee={shippingFee}
                            total={total}
                            paymentMethod={paymentMethod}
                            handlePaystackCheckout={handlePaystackCheckout}
                            isProcessing={isProcessing}
                        />
                    </div>
                </form>
            </div>

            {isModalOpen && (
                <AddressModal
                    editingId={editingId}
                    setIsModalOpen={setIsModalOpen}
                    showToast={showToast}
                    formData={formData}
                    setFormData={setFormData}
                    emptyForm={emptyForm}
                    setEditingId={setEditingId}
                    handleChange={handleChange}
                    addresses={addresses}
                    setAddresses={setAddresses}
                />
            )}
        </div>
    );
};

export default CheckOut;