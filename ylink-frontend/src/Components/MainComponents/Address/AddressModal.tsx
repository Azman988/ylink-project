import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Home, MapPin, XIcon, Check } from "lucide-react";

const NIGERIAN_STATES = [
    'Oyo', 'Lagos', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
];

interface ModalProps {
    showToast: any;
    editingId: string | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    emptyForm: any;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
    handleChange: (e: any) => void;
    addresses: any[];
    setAddresses: React.Dispatch<React.SetStateAction<any[]>>
}

const AddressModal: React.FC<ModalProps> = ({
    editingId, setIsModalOpen, showToast, formData, setFormData, emptyForm, setEditingId, handleChange, addresses, setAddresses
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const MAX_ADDRESSES = import.meta.env.MAX_ADDRESSES || 2;
    const LOCAL_STORAGE_KEY = import.meta.env.LOCAL_STORAGE_KEY || 'user_addresses';

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(emptyForm);
        setEditingId(null);
    };

    // Close state dropdown when clicking outside
    useEffect(() => {
        const checkOutsideClick = (e: MouseEvent) => {
            if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', checkOutsideClick);
        return () => document.removeEventListener('mousedown', checkOutsideClick);
    }, [dropdownOpen]);

    // Update LocalStorage whenever Addresses state updates
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
    }, [addresses, LOCAL_STORAGE_KEY]);

    // Click Outside Backdrop Handler to close Modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    // Select delivery state
    const selectState = (stateName: string) => {
        setFormData((prev: any) => ({ ...prev, state: stateName }));
        setDropdownOpen(false);
    };

    // Unified Form Submit Handler
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Unified Strict Validation
        const { firstName, lastName, email, phone, street, city, state } = formData;
        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !email.includes('@') || !phone?.trim() || !Number(phone.trim()) || !street?.trim() || !city?.trim() || !state?.trim()) {
            showToast('Please fill out all fields properly before saving.', 'error');
            return;
        }

        // 2. Limit Check (ONLY applies when adding a NEW address)
        if (!editingId && addresses.length >= MAX_ADDRESSES) {
            showToast(`Address limit reached. You can only save up to ${MAX_ADDRESSES} addresses.`, 'error');
            return;
        }

        try {
            if (editingId) {
                // --- PUT request (Update Specific Editing ID) ---
                const response = await fetch(`/api/user/addresses/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error();
                const updatedAddress = await response.json();

                setAddresses(prev => prev.map(addr => {
                    if (addr.id === editingId) return updatedAddress;
                    if (formData.isDefault && addr.id !== editingId) return { ...addr, isDefault: false };
                    return addr;
                }));
                showToast('Shipping destination modified successfully', 'success');
            } else {
                // --- POST request (Create) ---
                const payload = { ...formData, isDefault: addresses.length === 0 ? true : formData.isDefault };
                const response = await fetch('/api/user/addresses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error();
                const newAddress = await response.json();

                setAddresses(prev => {
                    const updated = payload.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev;
                    return [...updated, newAddress];
                });
                showToast('New delivery address saved', 'success');
            }
            handleCloseModal();
        } catch (err) {
            showToast('Unable to complete request. Please verify connection networks.', 'error');
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
                    <div>
                        <h2 className="text-base font-black tracking-tight">
                            {editingId ? 'Modify Address Entry' : 'New Address Location'}
                        </h2>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body attached to Unified Submit */}
                <form id="address-checkout-form" onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">

                    {/* Segment Control Grid Selection for Label Type */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'residential', label: 'Home', icon: Home },
                            { id: 'commercial', label: 'Business', icon: Building2 },
                            { id: 'others', label: 'Other', icon: MapPin }
                        ].map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, label: item.id })}
                                className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${formData.label === item.id
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Contact Identity Info Blocks */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text" required name="firstName" value={formData.firstName} onChange={handleChange}
                            placeholder="First Name"
                            className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                        />
                        <input
                            type="text" required name="lastName" value={formData.lastName} onChange={handleChange}
                            placeholder="Last Name"
                            className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                        />
                    </div>

                    <input
                        type="email" required name="email" value={formData.email} onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                    />

                    <input
                        type="tel" required name="phone" value={formData.phone} onChange={handleChange}
                        placeholder="Phone Number (e.g., 0803 123 4567)"
                        className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800 font-mono"
                    />

                    <input
                        type="text" required name="street" value={formData.street} onChange={handleChange}
                        placeholder="Street Address Details (House / Flat / Plot Number)"
                        className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                    />

                    {/* Destination Geolocation Routing Nodes */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text" required name="city" value={formData.city} onChange={handleChange}
                            placeholder="City or Town"
                            className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-slate-800"
                        />

                        {/* Custom Modern Dropdown Menu */}
                        <div className="relative" ref={dropdownRef}>
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

                    {/* Flag Default Assignment */}
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

                {/* Modal Footer Controls */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-5 py-2.5 text-slate-500 bg-white hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="address-checkout-form"
                        className="px-5 py-2.5 bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                        {editingId ? 'Update Address' : 'Save Address'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddressModal;