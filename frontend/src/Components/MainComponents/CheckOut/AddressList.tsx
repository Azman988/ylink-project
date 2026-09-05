import { PlusIcon, Trash2 } from "lucide-react";
import type { Address } from "../../../Pages/MainPages/CheckOut";

interface AddressListProps {
    addresses: Address[];
    editingId: string | null;
    handleOpenModal: () => void;
    setEditingId: (id: string | null) => void;
    handleDelete: (idToDelete: string, e: React.MouseEvent) => void;
}

const AddressList = ({ addresses, editingId, handleOpenModal, setEditingId, handleDelete }: AddressListProps) => {

    const MAX_ADDRESSES = import.meta.env.MAX_ADDRESSES || 2;
    const canAddMoreAddresses = addresses.length < MAX_ADDRESSES;

    return (
        <div className="space-y-4 mb-6">
            {addresses.map((addr) => (
                <div
                    key={addr.id}
                    onClick={() => setEditingId(addr.id)}
                    className={`flex flex-col sm:flex-row sm:items-start p-5 border rounded-xl cursor-pointer transition-all relative ${editingId === addr.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-200 bg-white'
                        }`}
                >
                    <div className="flex items-center mb-2 sm:mb-0">
                        <input
                            type="radio"
                            name="selectedAddress"
                            checked={editingId === addr.id}
                            readOnly
                            className="w-5 h-5 mt-1 pointer-events-none"
                        />
                    </div>
                    <div className="ml-0 sm:ml-4 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{addr.firstName} {addr.lastName}</p>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                {addr.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{addr.street}, {addr.city}, {addr.state}</p>
                        <p className="text-sm text-gray-600 mt-1">{addr.email} • {addr.phone}</p>
                    </div>

                    <div className="flex flex-col gap-2 items-end justify-between h-full absolute right-5 top-5 sm:relative sm:right-0 sm:top-0">
                        {editingId === addr.id && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full mb-3 sm:mb-0">
                                Selected
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={(e) => handleDelete(addr.id, e)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors mt-auto flex items-center gap-1 text-sm font-semibold cursor-pointer"
                        >
                            <span>
                                <Trash2 size="20" />
                            </span> <span className="hidden sm:inline">
                                Delete
                            </span>
                        </button>
                    </div>
                </div>
            ))}

            {canAddMoreAddresses && (
                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-blue-600 font-semibold hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <span className="text-xl">
                        <PlusIcon />
                    </span> Add a new address
                </button>
            )}
        </div>
    )
}

export default AddressList;