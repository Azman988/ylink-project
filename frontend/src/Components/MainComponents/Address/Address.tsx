import React, { useState, useEffect } from 'react';
import { MapPinIcon, PhoneIcon, PlusIcon, Trash2, Edit2 } from 'lucide-react';
import AddressModal from './AddressModal';
import AddressBookSkeleton from './AddressBookSkeleton';
import { addressApi, type Address, type AddressPayload } from '../../../api/addressApi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

type Edit = {
  allowEdit?: boolean;
};

const AddressBook = ({ allowEdit = true }: Edit) => {
  const { checkAuth } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const emptyForm: AddressPayload = {
    street: '',
    city: '',
    state: 'Oyo',
    phone: '',
    isDefault: false,
  };

  const [formData, setFormData] = useState<AddressPayload>(emptyForm);
  const MAX_ADDRESSES = Number(import.meta.env.VITE_MAX_ADDRESSES) || 2;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const data = await addressApi.getAddresses();
        setAddresses(data);
      } catch (err) {
        showToast('Failed to load saved addresses', 'error');
        setAddresses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setFormData({
        street: address.street,
        city: address.city,
        state: address.state,
        phone: address.phone,
        isDefault: address.isDefault || false,
      });
      setEditingId(address._id);
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

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      await addressApi.deleteAddress(id);
      const target = addresses.find(a => a._id === id);
      const updatedAddresses = addresses.filter(addr => addr._id !== id);

      if (target?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      setAddresses(updatedAddresses);
      await checkAuth();
      showToast('Address removed successfully', 'success');
    } catch (err) {
      showToast('Error removing address.', 'error');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressApi.setDefaultAddress(id);
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr._id === id,
        }))
      );
      showToast('Primary address updated', 'success');
    } catch (err) {
      showToast('Could not update default address.', 'error');
    }
  };

  // Render skeleton state directly during loading
  if (isLoading) {
    return <AddressBookSkeleton />;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-5 bg-slate-100/50 border border-slate-50 rounded-xl">
        <div className="pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Saved Addresses
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {allowEdit
                ? `Manage delivery locations (${addresses.length}/${MAX_ADDRESSES} slots used)`
                : `Choose where to deliver your package (${addresses.length}/${MAX_ADDRESSES} available)`}
            </p>
          </div>

          {addresses.length < MAX_ADDRESSES ? (
            <button
              onClick={
                allowEdit
                  ? () => handleOpenModal()
                  : (e) => {
                      e.preventDefault();
                      navigate('/account?tab=addresses');
                    }
              }
              className="px-5 py-3 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-2xl text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" /> Add New Address
            </button>
          ) : (
            <MapPinIcon className="h-full w-10 text-blue-500 hidden sm:block" />
          )}
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <MapPinIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Your address book is empty
            </h3>
            <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto mb-6">
              Save up to {MAX_ADDRESSES} delivery locations for faster checkout.
            </p>
            <button
              onClick={
                allowEdit
                  ? () => handleOpenModal()
                  : (e) => {
                      e.preventDefault();
                      navigate('/account?tab=addresses');
                    }
              }
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm rounded-xl shadow-md transition-all duration-300 cursor-pointer"
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white rounded-3xl border p-6 transition-all flex flex-col justify-between relative group animate-fade-in-up ${
                  address.isDefault
                    ? 'border-blue-600 shadow-md ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Delivery Point
                      </span>
                    </div>
                    {address.isDefault && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-blue-100">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-slate-600 text-sm font-medium leading-relaxed">
                    <p className="text-slate-900 font-black text-base">{address.street}</p>
                    <p className="text-slate-600 font-medium">
                      {address.city}, {address.state} State
                    </p>
                    <p className="text-slate-500 text-xs mt-3 flex items-center gap-1.5 font-mono bg-slate-50 p-2 rounded-xl w-fit border border-slate-100">
                      <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> {address.phone}
                    </p>
                  </div>
                </div>

                <div
                  className={`${
                    allowEdit && 'mt-6 pt-4 border-t border-slate-100 justify-between'
                  } flex items-center text-xs font-bold ${!allowEdit && 'justify-end'}`}
                >
                  {allowEdit && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleOpenModal(address)}
                        className="text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}

                  {!address.isDefault && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSetDefault(address._id);
                      }}
                      className="mt-1 text-blue-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && allowEdit && (
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
    </>
  );
};

export default AddressBook;