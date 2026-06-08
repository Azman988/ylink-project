import { useEffect, useState } from "react";
import type { Address } from "../../../Pages/MainPages/CheckOut"
import { ChevronDown } from "lucide-react";

interface addressForm {
    showToast: any,
    editingId: string | null,
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>,
    isAddingNew: boolean,
    addresses: Address[],
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>,
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
}

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

// Nigerian States List
const NIGERIAN_STATES = [
    'Oyo', 'Lagos', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
];


const AddressForm = ({ showToast, editingId, setEditingId, isAddingNew, addresses, setAddresses, setIsAddingNew }: addressForm) => {

    // const MAX_ADDRESSES = import.meta.env.MAX_ADDRESSES || 2;
    // const handleSaveAddress = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     // 1. Validation: Prevent saving if required fields are empty
    //     const { firstName, lastName, email, phone, street, city, state } = formData;
    //     if (!firstName.trim() || !lastName.trim() || !email.trim() || !email.includes('@') || !phone.trim() || !street.trim() || !city.trim() || !state.trim()) {
    //         showToast('Please fill in all required address fields properly before saving.', 'error');
    //         return;
    //     }

    //     // 2. Limit Check
    //     if (address.length >= MAX_ADDRESSES) {
    //         showToast('Address limit reached. Please delete one to add a new address.', 'error');
    //         return;
    //     }

    //     const newAddress: Address = {
    //         ...formData,
    //         id: `addr-${Date.now()}`,
    //     };

    //     setAddresses([...address, newAddress]);
    //     setEditingId(newAddress.id);
    //     setIsAddingNew(false);
    //     showToast('Address saved successfully!', 'success');

    //     // Reset Form
    //     setFormData({ label: 'Home', firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', zip: '' });
    // };

    // --- New Address Form State ---

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.street || !formData.city) {
            showToast('Please fill out all fields before saving.', 'error');
            return;
        }

        try {
            if (editingId) {
                // --- PUT request (Update) ---
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
                showToast('New shipping address saved', 'success');
            }
        } catch (err) {
            showToast('Unable to complete request. Please verify connection networks.', 'error');
        }
    };

    const [formData, setFormData] = useState<Omit<Address, 'id'>>(emptyForm);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Effect: Sync Addresses to LocalStorage ---
    // const LOCAL_STORAGE_KEY = import.meta.env.LOCAL_STORAGE_KEY;
    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));

    //     // Auto-select logic and form display
    //     if (addresses.length > 0 && !addresses.find(a => a.id === editingId)) {
    //         setEditingId(addresses[0].id);
    //     } else if (addresses.length === 0) {
    //         setEditingId('');
    //         setIsAddingNew(true);
    //     }
    // }, [addresses, editingId]);

    return (
        <>
            {(isAddingNew || addresses.length === 0) && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">
                            {addresses.length === 0 ? "Enter Delivery Details" : "Add New Address"}
                        </h3>
                    </div>

                    {/* Address Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                        <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street Address Details (House / Flat / Plot Number)" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:col-span-2" />

                        <input type="tel" name="phone" minLength={11} maxLength={11} value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City or Town" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />

                        <div className="relative">
                            <select
                                name="state" value={formData.state} onChange={handleChange}
                                className="w-full px-4 py-3 text-sm bg-slate-50 rounded-lg border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                            >
                                {NIGERIAN_STATES.map(state => (
                                    <option key={state} value={state}>{state} State</option>
                                ))}
                            </select>
                            {/* Chevron Down Icon */}
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                        </div>

                        <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip Code (Optional)" className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>

                </div>
                // <div className="flex gap-3">
                //     <button type="button" onClick={handleSaveAddress} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer">
                //         Save Address
                //     </button>
                //     {address.length > 0 && (
                //         <button type="button" onClick={() => setIsAddingNew(false)} className="px-6 py-3 text-slate-100 bg-red-400 border border-slate-200 sm:text-slate-700 sm:bg-slate-50 hover:bg-red-400 hover:text-slate-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer">
                //             Cancel
                //         </button>
                //     )}
                // </div>
            )}
        </>
    )
}

export default AddressForm;