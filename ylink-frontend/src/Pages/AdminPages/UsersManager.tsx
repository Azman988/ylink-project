// UsersManager.tsx
import { useState, useEffect } from 'react';
import { type UserAccount } from '../../data/adminAPI';
import { Search, Loader2, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function UsersManager() {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // Retrieving directly from the established mock structure
        const data = JSON.parse(localStorage.getItem('yl_users') || '[]');
        setUsers(data);
        setLoading(false);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Customer Directory <ShieldCheck className="text-slate-400" size={24} />
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Cross-reference client accounts and lifetime value metrics.</p>
                </div>
                
                <div className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full sm:w-[320px] shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search CRM by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:font-normal"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl text-slate-400 font-medium">
                            No profiles align with current search parameters.
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-slate-900/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                                        {user.id}
                                    </span>
                                </div>
                                
                                <h3 className="font-black text-slate-900 text-lg mb-1">{user.name}</h3>
                                
                                <div className="mt-5 space-y-3 pt-5 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-500 transition-colors"><Mail size={14} /></div>
                                        <a href={`mailto:${user.email}`} className="hover:text-emerald-600 transition-colors truncate">{user.email}</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                        <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:text-emerald-500 transition-colors"><Calendar size={14} /></div>
                                        Account initiated {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}