import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon, Loader, List, Laptop, ShoppingCartIcon, UserIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseMenu } from './UserMenu';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

export function Header() {
    // --- Router Hooks ---
    const navigate = useNavigate()
    const location = useLocation();

    // --- States ---
    const [userMenu, setUserMenu] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState(false);

    // --- Contexts ---
    const { cartOpen, setCartOpen, cartCount } = useCart();
    const { user, logout } = useAuth();

    // --- Derived States ---
    const isCheckoutPage = location.pathname.startsWith('/checkout');

    // Auto-close cart side nav if user navigates to checkout page
    useEffect(() => {
        if (isCheckoutPage && cartOpen) {
            setCartOpen(false);
        }
    }, [location.pathname, isCheckoutPage, cartOpen, setCartOpen]);

    // --- Handlers ---
    const adminNav = () => {
        setIsloading(true)
        setTimeout(() => { navigate('/admin') }, 1500)
    }

    // LogOut and navigate to home 
    const closeUserMenu = () => {
        setUserMenu(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Configuration ---
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/consultation', label: 'Solar', isAccent: true },
        ...(user ? [{ path: '/orders', label: 'Orders' }] : []),
        { path: '/support', label: 'Support' }
    ];

    if (isLoading) {
        return (
            <div className="fixed min-w-screen min-h-screen z-100 bg-slate-50 flex flex-col items-center justify-center gap-4">
                <Loader className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Switching Page to Admin mode...</p>
            </div>
        );
    }

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-3 px-4 sm:px-6 fixed w-full top-0 z-50 transition-all print:hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* --- LOGO --- */}
                <Link to='/' onClick={closeUserMenu} className="flex items-end gap-1.5 cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-colors shrink-0">
                        <Laptop className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter xl:mr-20 lg:mr-14 md:mr-12 mr-6">
                        YLink<span className="text-blue-600">Tech</span>
                    </div>
                </Link>

                {/* --- DESKTOP NAVIGATION --- */}
                <nav className='hidden md:flex items-center gap-1 lg:gap-2'>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeUserMenu}
                            className={({ isActive }) => `
                                px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                                ${item.isAccent
                                    ? isActive ? 'bg-amber-50 text-amber-600' : 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'
                                    : isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }
                            `}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* --- ACTIONS & USER PROFILE --- */}
                <div className='flex items-center gap-3 sm:gap-4'>

                    {/* Cart Button */}
                    <button
                        onClick={() => setCartOpen(true)}
                        disabled={isCheckoutPage}
                        className='relative p-2.5 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all duration-300 cursor-pointer shadow-sm border border-slate-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-slate-200 disabled:hover:text-slate-600'
                    >
                        {cartCount > 0 && (
                            <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-sm ring-1 ring-white'>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                        <ShoppingCartIcon className='w-5 h-5 stroke-[2.5]' />
                    </button>

                    {/* User Controls */}
                    <div className='relative flex items-center'>
                        {user ? (
                            <button
                                className='flex items-center gap-2 p-1 pr-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer group'
                                onClick={() => setUserMenu(!userMenu)}
                            >
                                <div className='w-8 h-8 bg-blue-600 text-white font-black text-sm rounded-full flex items-center justify-center shadow-inner uppercase'>
                                    {user.name.charAt(0)}
                                </div>
                                <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${userMenu ? 'rotate-180' : ''}`} />
                            </button>
                        ) : (
                            <>
                                <Link to='/auth' className='hidden md:flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-slate-900 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer'>
                                    <UserIcon className='w-4 h-4' />
                                    Sign In
                                </Link>

                                {/* Mobile Menu Toggle */}
                                <button
                                    className='block md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors ml-2 cursor-pointer border border-slate-100'
                                    onClick={() => setUserMenu(!userMenu)}
                                >
                                    {userMenu ? <X className='w-6 h-6' /> : <List className='w-6 h-6' />}
                                </button>
                            </>
                        )}

                        {/* User Menu Dropdown Component */}
                        {userMenu && (
                            <UseMenu
                                user={user}
                                userMenu={userMenu}
                                setUserMenu={setUserMenu}
                                closeUserMenu={closeUserMenu}
                                logout={logout}
                                adminNav={adminNav}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}