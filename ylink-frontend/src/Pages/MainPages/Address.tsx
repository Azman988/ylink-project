import React, { useState, useEffect } from 'react';
import { MapPinIcon, PhoneIcon, PlusIcon, Loader2, Trash2, Edit2, ShieldAlert, CheckIcon } from 'lucide-react';
import AddressModal from '../../Components/MainComponents/Address/AddressModal';

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
    isDefault: boolean;
}

const AddressBook: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

    // --- Fetch User Addresses ---
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/user/addresses');
                if (!response.ok) throw new Error();
                const data = await response.json();
                setAddresses(data);
            } catch (err) {
                console.warn('Backend offline, using fallback instance schema array storage context.');
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleOpenModal = (address?: Address) => {
        if (address) {
            // Edit Specific Address
            setFormData(address);
            setEditingId(address.id);
            setIsModalOpen(true);
        } else {
            // Add New Address (Enforce Maximum Limit)
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

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error();

            const target = addresses.find(a => a.id === id);
            const updatedAddresses = addresses.filter(addr => addr.id !== id);

            if (target?.isDefault && updatedAddresses.length > 0) {
                updatedAddresses[0].isDefault = true;
            }

            setAddresses(updatedAddresses);
            showToast('Address removed successfully', 'success');
        } catch (err) {
            showToast('Error executing removal operation.', 'error');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const response = await fetch(`/api/user/addresses/${id}/default`, { method: 'PATCH' });
            if (!response.ok) throw new Error();

            setAddresses(prev => prev.map(addr => ({
                ...addr,
                isDefault: addr.id === id,
            })));
            showToast('Primary address updated', 'success');
        } catch (err) {
            showToast('Could not modify core configuration parameters.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 relative">
            {toast && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-60 animate-fade-in-down">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl text-white font-bold text-sm ${toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'
                        }`}>
                        {toast.type === 'error' ? <ShieldAlert className="w-4 h-4" /> : <CheckIcon />}
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Addresses</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Manage delivery locations ({addresses.length}/{MAX_ADDRESSES} slots used)
                        </p>
                    </div>

                    {!isLoading && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-5 py-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <PlusIcon className="w-4 h-4" /> Add New Destination
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm max-w-xl mx-auto">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <MapPinIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">Your address book is empty</h3>
                        <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto mb-6">
                            Save up to {MAX_ADDRESSES} delivery locations for streamlined checkout processing structures.
                        </p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Add First Address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`bg-white rounded-3xl border p-6 transition-all flex flex-col justify-between relative group animate-fade-in-up ${address.isDefault ? 'border-blue-600 shadow-md ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                    }`}
                            >
                                <div>
                                    <div className="flex justify-between items-center gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl capitalize tracking-wide border border-slate-200">
                                                {address.label === 'commercial' ? 'Business' : address.label === 'residential' ? 'Home' : 'Other'}
                                            </span>
                                            {address.isDefault && (
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-blue-100">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-black text-slate-900 text-lg mb-1">
                                        {address.firstName} {address.lastName}
                                    </h3>

                                    <div className="space-y-1 text-slate-600 text-sm font-medium leading-relaxed">
                                        <p className="text-slate-400 text-xs font-bold mb-3">{address.email}</p>
                                        <p className="text-slate-800 font-bold">{address.street}</p>
                                        <p>{address.city}, {address.state} State</p>
                                        <p className="text-slate-400 text-xs mt-4 flex items-center gap-1.5 font-mono bg-slate-50 p-2 rounded-xl w-fit border border-slate-100">
                                            <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> {address.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleOpenModal(address)}
                                            className="text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>

                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="text-blue-600 hover:text-slate-900 transition-colors cursor-pointer"
                                        >
                                            Use as Primary
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default AddressBook;