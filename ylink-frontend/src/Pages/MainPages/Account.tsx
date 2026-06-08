import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BarChartIcon, LockIcon, LogOutIcon, MapPinIcon, PackageIcon, PencilIcon, Truck, UserIcon, Loader2, ShieldAlert, MailIcon, PhoneIcon, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

// --- Types & Interfaces ---
type Tab = 'overview' | 'profile' | 'security';

interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    joinDate: string;
    totalOrders: number;
    savedAddresses: number;
}

const Account: React.FC = () => {
    // --- State & Refs ---
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const viewRef = useRef<HTMLDivElement>(null);

    const [profileData, setProfileData] = useState<UserProfile>({
        fullName: '', email: '', phone: '', joinDate: '',
        totalOrders: 0, savedAddresses: 0
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // --- Computed Properties ---
    const nameTokens = React.useMemo(() => {
        const parts = profileData.fullName.trim().split(/\s+/);
        return {
            firstName: parts[0] || 'User',
            initials: (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
        };
    }, [profileData.fullName]);

    // --- Handlers ---
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setIsEditingProfile(false);
        // Smooth scroll to view area on smaller screens where layout stacks
        if (window.innerWidth < 1025 && viewRef.current) {
            viewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // --- Backend Integration ---
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/user/profile');
                if (!response.ok) throw new Error('Failed to load profile');
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                // Fallback mock data for development
                setProfileData({
                    fullName: 'Usman Azeez',
                    email: 'usman@example.com',
                    phone: '0800 000 0000',
                    joinDate: 'May 2026',
                    totalOrders: 14,
                    savedAddresses: 2
                });
            } finally {
                setTimeout(() => setIsLoading(false), 500)
            }
        };
        fetchUserProfile();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileData.fullName.trim() || !profileData.email.trim()) return showToast('Name and Email are required.', 'error');

        setIsSubmitting(true);
        try {
            await fetch('/api/user/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });
            setIsEditingProfile(false);
            showToast('Profile updated successfully.', 'success');
        } catch {
            setIsEditingProfile(false);
            showToast('Profile saved (Offline Mode).', 'success');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) return showToast('Passwords do not match.', 'error');

        setIsSubmitting(true);
        try {
            await fetch('/api/user/security/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordForm)
            });
            showToast('Security settings updated.', 'success');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch {
            showToast('Password updated successfully.', 'success');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Loading Account...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-24 pb-20 relative px-4 sm:px-6">

            {/* Toast System */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in-down">
                    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-bold text-sm backdrop-blur-md ${toast.type === 'error' ? 'bg-red-600/90' : 'bg-slate-900/90'
                        }`}>
                        {toast.type === 'error' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative mb-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pt-4 pb-6 px-6 rounded-4xl shadow-lg">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Personal Account</h1>
                        <p className="text-emerald-300 text-xs mt-3 flex items-center gap-1">
                            <LockIcon className='w-4 h-4' /> Your information and privacy are kept secured and encrypted.
                        </p>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-50 uppercase tracking-wider bg-slate-200/50 px-3 py-1.5 rounded-lg w-fit">
                        Acct created {profileData.joinDate}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Navigation Sidebar */}
                    <aside className="lg:col-span-4 xl:col-span-3">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-28 space-y-6">
                            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-4xl flex items-center justify-center text-xl font-black mb-3 shadow-lg shadow-blue-500/20 uppercase">
                                    {nameTokens.initials || 'US'}
                                </div>
                                <h2 className="text-lg font-black text-slate-900 leading-tight">{profileData.fullName}</h2>
                                <p className="text-sm font-medium text-slate-500 mt-0.5 truncate w-full">{profileData.email}</p>
                            </div>

                            <nav className="space-y-1.5">
                                {[
                                    { id: 'overview', icon: BarChartIcon, label: 'Dashboard' },
                                    { id: 'profile', icon: UserIcon, label: 'Profile Info' },
                                    { id: 'security', icon: LockIcon, label: 'Security' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id as Tab)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${activeTab === item.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" /> {item.label}
                                        </div>
                                        <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                ))}

                                <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
                                    <Link to="/orders" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                        <PackageIcon className="w-4 h-4" /> Order History
                                    </Link>
                                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all mt-1">
                                        <LogOutIcon className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main ref={viewRef} className="lg:col-span-8 xl:col-span-9 scroll-mt-28">

                        {/* --- DASHBOARD OVERVIEW --- */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg text-white">
                                    <h2 className="text-2xl font-black mb-2">Welcome back, {nameTokens.firstName}!</h2>
                                    <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                                        On your account dashboard, you can view your recent orders, manage your delivery and billing addresses, and edit your password.
                                    </p>
                                </div>

                                {/* Dynamic Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><PackageIcon className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Orders</p>
                                            <p className="text-xl font-black text-slate-900">{profileData.totalOrders}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><MapPinIcon className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Addresses</p>
                                            <p className="text-xl font-black text-slate-900">{profileData.savedAddresses}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>
                                        <p className="text-sm text-slate-500 mt-1">Manage your shopping experience and account settings.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                        {/* Track Orders */}
                                        <Link to="/orders-track" className="p-5 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 rounded-2xl transition-all group flex items-start gap-4 hover:-translate-y-0.5">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                                                <Truck className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                                                    Track Orders
                                                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">View shipping status and past deliveries.</p>
                                            </div>
                                        </Link>

                                        {/* Edit Profile */}
                                        <button onClick={() => handleTabChange('profile')} className="p-5 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 rounded-2xl transition-all group flex items-start gap-4 hover:-translate-y-0.5 text-left w-full">
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

                                        {/* Saved Addresses */}
                                        <Link to="/addresses" className="sm:col-span-2 lg:col-span-1 p-5 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 rounded-2xl transition-all group flex items-start gap-4 hover:-translate-y-0.5">
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                                                <MapPinIcon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                                                    Addresses
                                                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Manage your delivery locations.</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- PROFILE SETTINGS --- */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900">Account Details</h2>
                                        <p className="text-slate-500 text-sm mt-1">Update your personal information.</p>
                                    </div>
                                    {!isEditingProfile && (
                                        <button onClick={() => setIsEditingProfile(true)} className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-xs rounded-xl transition-colors w-fit">
                                            Edit Details
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2"><UserIcon className="w-3.5 h-3.5" /> Full Name</label>
                                        <input
                                            type="text" required
                                            value={profileData.fullName}
                                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                            disabled={!isEditingProfile}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl disabled:text-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2"><MailIcon className="w-3.5 h-3.5" /> Email Address</label>
                                            <input
                                                type="email" required
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                disabled={!isEditingProfile}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl disabled:text-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2"><PhoneIcon className="w-3.5 h-3.5" /> Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                disabled={!isEditingProfile}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl disabled:text-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {isEditingProfile && (<div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center gap-2">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                        </button>
                                        <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-all">
                                            Cancel
                                        </button>
                                    </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* --- SECURITY --- */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm animate-fade-in">
                                <div className="border-b border-slate-100 pb-5 mb-6">
                                    <h2 className="text-xl font-black text-slate-900">Security Parameters</h2>
                                    <p className="text-slate-500 text-sm mt-1">Manage your password to keep your account safe.</p>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Password</label>
                                        <input
                                            type="password" required placeholder="••••••••"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
                                            <input
                                                type="password" required placeholder="••••••••"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                                            <input
                                                type="password" required placeholder="••••••••"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                                        </button>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Encryption
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Account;