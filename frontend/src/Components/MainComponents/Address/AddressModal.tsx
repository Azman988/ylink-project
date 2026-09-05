import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, XIcon, Check } from "lucide-react";
import { addressApi, type Address, type AddressPayload } from '../../../api/addressApi';
import { useAuth } from '../../../context/AuthContext';

const NIGERIAN_STATES = [
    'Oyo', 'Lagos', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
];

interface ModalProps {
    showToast: (message: string, type: 'success' | 'error') => void;
    editingId: string | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formData: AddressPayload;
    setFormData: React.Dispatch<React.SetStateAction<AddressPayload>>;
    emptyForm: AddressPayload;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    addresses: Address[];
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

const AddressModal: React.FC<ModalProps> = ({
    editingId,
    setIsModalOpen,
    showToast,
    formData,
    setFormData,
    emptyForm,
    setEditingId,
    handleChange,
    addresses,
    setAddresses,
}) => {
    const { checkAuth } = useAuth();
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const MAX_ADDRESSES = Number(import.meta.env.VITE_MAX_ADDRESSES) || 2;

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(emptyForm);
        setEditingId(null);
    };

    useEffect(() => {
        const checkOutsideClick = (e: MouseEvent) => {
            if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', checkOutsideClick);
        return () => document.removeEventListener('mousedown', checkOutsideClick);
    }, [dropdownOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const selectState = (stateName: string) => {
        setFormData(prev => ({ ...prev, state: stateName }));
        setDropdownOpen(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const { phone, street, city, state } = formData;
        if (!phone?.trim() || !street?.trim() || !city?.trim() || !state?.trim()) {
            showToast('Please fill out all mandatory address fields.', 'error');
            return;
        }

        if (!editingId && addresses.length >= MAX_ADDRESSES) {
            showToast(`Address limit reached. You can only save up to ${MAX_ADDRESSES} addresses.`, 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingId) {
                const updatedAddress = await addressApi.updateAddress(editingId, formData);

                setAddresses(prev => prev.map(addr => {
                    if (addr._id === editingId) return updatedAddress;
                    if (formData.isDefault && addr._id !== editingId) return { ...addr, isDefault: false };
                    return addr;
                }));
                showToast('Address modified successfully', 'success');
            } else {
                const payload: AddressPayload = {
                    ...formData,
                    isDefault: addresses.length === 0 ? true : formData.isDefault,
                };
                const newAddress = await addressApi.addAddress(payload);

                setAddresses(prev => {
                    const updated = payload.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev;
                    return [...updated, newAddress];
                });

                // Re-fetch user profile
                await checkAuth()
                showToast('New delivery address saved', 'success');
            }
            handleCloseModal();
        } catch (err) {
            showToast('Unable to complete request. Please verify connection network.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        >
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-fade-in-up duration-300 max-h-[90vh]">

                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                    <h2 className="text-base font-black tracking-tight">
                        {editingId ? 'Modify Address Entry' : 'New Address Location'}
                    </h2>
                    <button
                        onClick={handleCloseModal}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-300 cursor-pointer"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form id="address-checkout-form" onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">

                    {/* Street Address Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Street Address</label>
                        <input
                            type="text"
                            required
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="House / Flat / Plot Number & Street"
                            className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                        />
                    </div>

                    {/* Phone Number Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Contact Phone</label>
                        <input
                            type="tel"
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g., 0803 123 4567"
                            className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800 font-mono"
                        />
                    </div>

                    {/* City and State Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">City / Town</label>
                            <input
                                type="text"
                                required
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City or Town"
                                className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                            />
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-xs font-bold text-slate-500 mb-1">State</label>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none flex items-center justify-between font-bold text-slate-700 hover:border-slate-300 text-left transition-all cursor-pointer"
                            >
                                <span className="truncate">{formData.state ? `${formData.state} State` : 'Select State'}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 z-50 w-full bg-white rounded-2xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto py-1 custom-scrollbar animate-fade-in">
                                    {NIGERIAN_STATES.map((state) => (
                                        <button
                                            key={state}
                                            type="button"
                                            onClick={() => selectState(state)}
                                            className={`w-full px-4 py-2.5 text-sm font-bold flex items-center justify-between text-left transition-colors cursor-pointer ${formData.state === state
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <span>{state} State</span>
                                            {formData.state === state && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Default Assignment Checkbox */}
                    {addresses.length > 0 && (
                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 bg-white rounded-lg border-slate-300 focus:ring-blue-600 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Make this my primary delivery address</span>
                            </label>
                        </div>
                    )}
                </form>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-white text-slate-600 hover:text-rose-600 border border-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="address-checkout-form"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddressModal;