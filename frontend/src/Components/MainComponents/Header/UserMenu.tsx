import { HeadphonesIcon, HomeIcon, LogOutIcon, PackageCheckIcon, PackageIcon, ShieldCogCornerIcon, ShoppingCartIcon, Sun, UserCircle2, UserIcon } from "lucide-react";
import { useEffect, useRef, } from "react";
import { Link, NavLink, } from "react-router-dom";

interface NavBarProps {
    user: any;
    userMenu: boolean;
    setUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
    closeUserMenu: () => void;
    adminNav: () => void;
    logout: () => void;
}

export function UseMenu({ user, userMenu, setUserMenu, closeUserMenu, adminNav, logout }: NavBarProps) {
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenu && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenu, setUserMenu]);

    // Configuration array for DRY mobile links
    const mobileNavLinks = [
        { to: '/', icon: HomeIcon, label: 'Home' },
        { to: '/shop', icon: ShoppingCartIcon, label: 'Shop' },
        { to: '/consultation', icon: Sun, label: 'Solar', isAccent: true },
        ...(user ? [{ to: '/orders', icon: PackageIcon, label: 'My Orders' }] : []),
        { to: '/support', icon: HeadphonesIcon, label: 'Support' }
    ];

    return (
        <div
            ref={userMenuRef}
            className={`absolute top-full mt-3 -right-[9px] sm:right-0 z-50 bg-white rounded-2xl w-64 shadow-xl shadow-slate-200/60 border border-slate-100 p-2 animate-fade-in origin-top-right transition-all`}
        >
            {/* --- USER HEADER --- */}
            <div className='mb-2'>
                {user ? (
                    <Link
                        to="/account"
                        onClick={closeUserMenu}
                        className='flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200 group'
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <UserCircle2 className='w-6 h-6' />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className='text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors'>{user?.name}</p>
                            <p className='text-xs font-medium text-slate-500 truncate'>{user?.email}</p>
                        </div>
                    </Link>
                ) : (
                    <div className="p-2">
                        <Link
                            to="/auth"
                            onClick={closeUserMenu}
                            className='flex items-center justify-center gap-2 py-2.5 w-full rounded-xl bg-blue-600 hover:bg-blue-600/80 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10'
                        >
                            <UserIcon className='w-4 h-4' /> Sign In
                        </Link>
                    </div>
                )}
            </div>

            {/* --- MOBILE NAV LINKS (Hidden on md) --- */}
            <div className='md:hidden mb-2 space-y-2 sm:space-y-0.5 border-b border-slate-100 pb-2'>
                {mobileNavLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={closeUserMenu}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors
                            ${isActive
                                ? 'bg-slate-50 text-blue-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                        `}
                    >
                        <link.icon className={`w-4 h-4 ${link.isAccent ? 'text-amber-500' : 'text-slate-400'}`} />
                        {link.label}
                    </NavLink>
                ))}
            </div>

            {/* --- USER ACCOUNT LINKS --- */}
            {user && user?.role !== 'user' && (
                <div className="flex flex-col pb-2 border-b border-slate-100">
                    {/* Admin Panel */}
                    {user?.role === 'admin' ? (
                        <button
                            onClick={adminNav}
                            className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-600 hover:bg-amber-600/10 bg-amber-50 transition-colors cursor-pointer'
                        >
                            <ShieldCogCornerIcon className='w-4 h-4 text-amber-500' /> Admin Panel
                        </button>
                    ) : user?.role === 'delivery' && (
                        <Link to='/delivery-driver'
                            className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-blue-500 hover:bg-blue-600/10 bg-blue-50 transition-colors cursor-pointer'
                        >
                            <PackageCheckIcon className='w-4 h-4 text-blue-400' /> Delivery Panel
                        </Link>
                    )}
                </div>
            )}

            {/* --- LogOut --- */}
            {user && (
                <div className='pt-2 border-slate-100'>
                    <div
                        onClick={() => {
                            closeUserMenu(); 
                            logout()
                        }}
                        className='flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer'
                    >
                        <LogOutIcon className='w-4 h-4 text-rose-500' /> Log Out
                    </div>
                </div>
            )}
        </div>
    );
}