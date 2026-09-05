// import { useState, useEffect } from 'react';
// import { adminApi, type UserAccount } from '../../api/adminAPI';
// import { Search, Loader2, Mail, Calendar, ShieldCheck } from 'lucide-react';
// import { useToast } from '../../context/ToastContext';

// export default function UsersManager() {
//     const { showToast } = useToast();

//     const [users, setUsers] = useState<UserAccount[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [updatingId, setUpdatingId] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => { 
//         fetchUsers(); 
//     }, []);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const data = await adminApi.getUsers();
//             setUsers(data);
//         } catch (error) {
//             console.error("Failed to fetch users:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRoleChange = async (userId: string, newRole: 'user' | 'manager' | 'admin' | 'delivery') => {
//         setUpdatingId(userId);
//         try {
//             const updatedUser = await adminApi.updateUserRole(userId, newRole);
//             setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
//             showToast(`Role updated to ${newRole.toUpperCase()}`, 'success');
//         } catch (error: any) {
//             showToast(error.response?.data?.message || 'Failed to update user role', 'error');
//         } finally {
//             setUpdatingId(null);
//         }
//     };

//     const filteredUsers = users.filter(user =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="animate-in fade-in duration-300">
//             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
//                 <div>
//                     <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
//                         Customer Directory <ShieldCheck className="text-slate-400" size={24} />
//                     </h1>
//                     <p className="text-slate-500 text-sm mt-1">Cross-reference client accounts and lifetime value metrics.</p>
//                 </div>

//                 <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full sm:w-[320px] shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
//                     <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
//                     <input
//                         type="text"
//                         placeholder="Search CRM by name or email..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:font-normal"
//                     />
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="flex h-[400px] items-center justify-center">
//                     <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredUsers.length === 0 ? (
//                         <div className="col-span-full py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl text-slate-400 font-medium">
//                             No user profiles found.
//                         </div>
//                     ) : (
//                         filteredUsers.map((user) => (
//                             <div key={user._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 group relative overflow-hidden">
//                                 <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

//                                 <div className="flex items-start justify-between mb-5">
//                                     <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-slate-900/20">
//                                         {user.name.charAt(0)}
//                                     </div>
//                                     <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
//                                         {user._id}
//                                     </span>
//                                 </div>

//                                 <h3 className="font-black text-slate-900 text-lg mb-1">{user.name}</h3>

//                                 <div className="mt-5 space-y-3 pt-5 border-t border-slate-100">
//                                     <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
//                                         <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-500 transition-colors"><Mail size={14} /></div>
//                                         <a href={`mailto:${user.email}`} className="hover:text-emerald-600 transition-colors truncate">{user.email}</a>
//                                     </div>
//                                     <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
//                                         <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-500 transition-colors"><Calendar size={14} /></div>
//                                         Account initiated {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

import { useState, useEffect } from 'react';
import { adminApi, type UserAccount } from '../../api/adminAPI';
import {
    Search,
    Loader2,
    Mail,
    Calendar,
    ShieldCheck,
    Shield,
    Truck,
    User,
    UserCheck,
    Phone
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function UsersManager() {
    const { showToast } = useToast();

    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (error: any) {
            console.error("Failed to fetch users:", error);
            showToast(error.response?.data?.message || 'Failed to load user directory', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'user' | 'manager' | 'admin' | 'delivery') => {
        setUpdatingId(userId);
        try {
            const updatedUser = await adminApi.updateUserRole(userId, newRole);
            setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
            showToast(`Role updated to ${newRole.toUpperCase()}`, 'success');
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to update user role', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const query = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.phone && user.phone.includes(query)) ||
            (user.role && user.role.toLowerCase().includes(query))
        );
    });

    const getRoleBadgeStyle = (role?: string) => {
        switch (role) {
            case 'admin':
                return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Shield };
            case 'manager':
                return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: UserCheck };
            case 'delivery':
                return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Truck };
            default:
                return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: User };
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        User & Staff Directory <ShieldCheck className="text-emerald-500" size={24} />
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage user roles, assign delivery drivers, and review platform accounts.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full sm:w-[320px] shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search name, email, phone or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[350px] gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-500">Loading directory accounts...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl text-slate-400 font-medium">
                            No user profiles match your search criteria.
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const roleStyle = getRoleBadgeStyle(user.role);
                            const RoleIcon = roleStyle.icon;

                            return (
                                <div
                                    key={user._id}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 group relative flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Accent Background Decoration */}
                                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50/60 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>

                                    <div className="relative z-10">
                                        {/* Avatar & Role Badge */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shadow-md shadow-slate-900/10">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>

                                            {/* Current Role Badge */}
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[11px] font-black uppercase tracking-wider ${roleStyle.bg}`}>
                                                <RoleIcon className="w-3.5 h-3.5" />
                                                {user.role || 'user'}
                                            </span>
                                        </div>

                                        {/* User Identity */}
                                        <h3 className="font-black text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                                            {user.name}
                                        </h3>
                                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                                            ID: {user._id}
                                        </p>

                                        {/* Details Section */}
                                        <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100">
                                            {/* Email */}
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                                                <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                    <Mail size={14} />
                                                </div>
                                                <a href={`mailto:${user.email}`} className="hover:text-emerald-600 transition-colors truncate">
                                                    {user.email}
                                                </a>
                                            </div>

                                            {/* Phone (if available) */}
                                            {user.phone && (
                                                <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                                                    <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                        <Phone size={14} />
                                                    </div>
                                                    <a href={`tel:${user.phone}`} className="hover:text-emerald-600 transition-colors">
                                                        {user.phone}
                                                    </a>
                                                </div>
                                            )}

                                            {/* Registration Date */}
                                            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                                                <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                    <Calendar size={14} />
                                                </div>
                                                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Selector Control */}
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                            Assign Role
                                        </span>

                                        {updatingId === user._id ? (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 px-3 py-1.5">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Updating...
                                            </div>
                                        ) : (
                                            <select
                                                value={user.role || 'user'}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value as any)}
                                                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all hover:bg-slate-100"
                                            >
                                                <option value="user">Customer (User)</option>
                                                <option value="delivery">Delivery Driver</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}