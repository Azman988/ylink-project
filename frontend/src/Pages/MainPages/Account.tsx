import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BarChartIcon, LockIcon, MapPinIcon, PackageIcon,
  PencilIcon, Truck, UserIcon, Loader2, MailIcon,
  PhoneIcon, ShieldCheck, ChevronRight,
  TrashIcon
} from 'lucide-react';
import { ShareLink } from '../../Components/Others/ShareLink';
import AddressBook from '../../Components/MainComponents/Address/Address';
import { useAuth } from '../../context/AuthContext';
import { orderApi, type Order } from '../../api/orderApi';
import { useToast } from '../../context/ToastContext';
import { SkeletonCard, AccountSkeleton } from '../../Components/MainComponents/Account/AccountSkeleton';

type Tab = 'overview' | 'profile' | 'addresses';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  coupon: number;
  referralCode?: string;
  createdAt: string;
  totalOrders: number;
  savedAddresses: number;
}

const Account: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isLoading: isAuthLoading, deleteAccount, updateProfile } = useAuth();
  const { showToast, confirmAction } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);

  // Handle tab selection from URL query parameters
  useEffect(() => {
    if (searchParams.has('tab')) {
      setActiveTab(searchParams.get('tab') as Tab);
    }
  }, [searchParams]);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize local form inputs when editing begins or when user updates
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Fetch orders when component mounts
  const fetchUserOrders = useCallback(async () => {
    setIsOrdersLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data || []);
    } catch (err: any) {
      console.error('API Error fetching user orders:', err);
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Compute profile values safely with fallback defaults
  const profileData: UserProfile = useMemo(() => {
    return {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      coupon: user?.bonusPoints || 0,
      referralCode: user?.referralCode || '',
      createdAt: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A',
      totalOrders: orders.length,
      savedAddresses: user?.addresses?.length || 0
    };
  }, [user, orders]);

  // Derived user initials and first name
  const nameTokens = useMemo(() => {
    const parts = (profileData.name || 'User').trim().split(/\s+/);
    return {
      firstName: parts[0] || 'User',
      initials: ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'US'
    };
  }, [profileData.name]);

  // Handle tab change and update URL query parameters
  const handleTabChange = (tab: Tab) => {
    setSearchParams((prev) => {
      prev.set('tab', tab);
      return prev;
    });
    setIsEditingProfile(false);
    if (window.innerWidth < 1025 && viewRef.current) {
      viewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Account Deletion Handler
  const handleDeleteAccount = async () => {
    // Standard quick call with default values
    const confirmed = await confirmAction({
      title: 'Delete Account?',
      message: 'This action is permanent and cannot be undone. All your saved data will be erased.',
      confirmText: 'Yes, Delete',
      cancelText: 'Keep Account',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      showToast('Deleting account...', 'idle');

      if (deleteAccount) {
        await deleteAccount();
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      showToast('Failed to delete account. Please try again.', 'error');
    }
  };

  // Profile Update Handler
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     // Standard quick call with default values
    const confirmed = await confirmAction({
      title: 'Update Profile?',
      message: 'Are you sure you want to update your profile information? You won\'t be able to change it again for the next 14 days.',
      confirmText: 'Yes, Update',
      cancelText: 'Cancel',
      variant: 'info',
    });

    if (!confirmed) return;


    if (!formData.name.trim() || !formData.email.trim()) {
      return showToast('Name and Email are required fields.', 'error');
    }

    showToast('Saving changes...');
    setIsSubmitting(true);
    try {
      if (updateProfile) {
        await updateProfile({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });
      }
      setIsEditingProfile(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update profile.', error);
      showToast(error.response?.data?.message ?? 'Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Referral Link generator
  const shareData = useMemo(() => {
    const code = profileData?.referralCode?.trim();

    const shareUrl = new URL('/auth', window.location.origin);
    shareUrl.searchParams.set('mode', 'signup');
    if (code) {
      shareUrl.searchParams.set('ref', code);
    }

    const shareTitle = code
      ? `Create an account and use my referral code (${code}) to earn rewards!`
      : 'Create an account and start earning rewards!';

    return { url: shareUrl.toString(), title: shareTitle };
  }, [profileData?.referralCode]);

  // Wireframe Skeleton view during auth check
  if (isAuthLoading) {
    return <AccountSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-24 pb-20 relative px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="relative mb-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pt-4 pb-6 px-6 rounded-4xl shadow-lg">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Personal Account</h1>
            <p className="text-emerald-300 text-xs mt-3 flex items-center gap-1">
              <LockIcon className="w-4 h-4" /> Your information and privacy are kept secured and encrypted.
            </p>
          </div>

          {/* Creation Date Badge */}
          <div className="text-[10px] font-semibold text-slate-50 uppercase tracking-wider bg-slate-200/20 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit">
            Acct created {profileData.createdAt}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Nav Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-28 space-y-6">
              {/* Profile Avatar & Primary Info */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-4xl flex items-center justify-center text-xl font-black mb-3 shadow-lg shadow-blue-500/20 uppercase">
                  {nameTokens.initials}
                </div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  {profileData.name || 'User'}
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5 truncate w-full">
                  {profileData.email || 'No email provided'}
                </p>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {[
                  { id: 'overview', icon: BarChartIcon, label: 'Dashboard' },
                  { id: 'profile', icon: UserIcon, label: 'Profile Info' },
                  { id: 'addresses', icon: MapPinIcon, label: 'Addresses' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as Tab)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${activeTab === item.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
                  <Link
                    to="/orders"
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <PackageIcon className="w-4 h-4" /> Order History
                  </Link>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all mt-1 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main ref={viewRef} className="lg:col-span-8 xl:col-span-9 scroll-mt-28">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg text-white">
                  <ShareLink title={shareData.title} url={shareData.url} />

                  <h2 className="text-2xl font-black mb-2">
                    Welcome back, {nameTokens.firstName}!
                  </h2>
                  <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                    On your account dashboard, you can get your referral link, view your recent orders, manage your delivery and billing addresses, and edit your account profile.
                  </p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  {/* Total Orders Stat */}
                  {isOrdersLoading ? (
                    <SkeletonCard />
                  ) : (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <PackageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Orders</p>
                        <p className="text-xl font-black text-slate-900">{profileData.totalOrders}</p>
                      </div>
                    </div>
                  )}

                  {/* Coupons Stat */}
                  {isOrdersLoading ? (
                    <SkeletonCard />
                  ) : (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <PackageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Coupons</p>
                        <p className="text-xl font-black text-slate-900">{profileData.coupon}</p>
                      </div>
                    </div>
                  )}

                  {/* Saved Addresses Stat */}
                  {isOrdersLoading ? (
                    <SkeletonCard />
                  ) : (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <MapPinIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Addresses</p>
                        <p className="text-xl font-black text-slate-900">{profileData.savedAddresses}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage your shopping experience and account settings.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <Link
                      to="/orders-track"
                      className="p-5 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 rounded-2xl transition-all group flex items-start gap-4 hover:-translate-y-0.5"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                        <Truck className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                          Track Orders
                          <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">View live shipping status updates.</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => handleTabChange('profile')}
                      className="p-5 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 rounded-2xl transition-all group flex items-start gap-4 hover:-translate-y-0.5 text-left w-full cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                        <PencilIcon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                          Edit Profile
                          <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Update your name, email, and phone.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Editing Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Account Details</h2>
                    <p className="text-slate-500 text-sm mt-1">Update your personal details, limited to once bi-weekly.</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-xs rounded-xl transition-colors duration-200 w-fit cursor-pointer"
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl disabled:text-slate-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <MailIcon className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl disabled:text-slate-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <PhoneIcon className="w-3.5 h-3.5" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl disabled:text-slate-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500 font-semibold mt-5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Password Securely Encrypted
                  </div>

                  {/* Actions Bar */}
                  {isEditingProfile && (
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 font-bold text-sm rounded-xl transition-all disabled:opacity-70 flex items-center gap-2 ${isSubmitting
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                          }`}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Update Details'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || ''
                          });
                        }}
                        className="px-6 py-3 border border-slate-300 bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold text-sm rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'addresses' && (
              <div className="sm:p-4 animate-fade-in">
                <AddressBook />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;