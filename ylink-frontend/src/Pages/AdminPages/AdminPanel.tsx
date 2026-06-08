import { useState } from 'react';
import { 
    LayoutDashboard, 
    Box, 
    ShoppingCart, 
    Users, 
    Menu, 
    X, 
    Bell, 
    LogOut,
    Laptop,
    Loader
} from 'lucide-react';

// Import your operational views
import DashboardHome from './DashboardHome';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import UsersManager from './UsersManager';
import { useNavigate } from 'react-router-dom';

export type AppState = 'dashboard' | 'products' | 'orders' | 'users';

export default function AdminLayout() {
    const [currentView, setCurrentView] = useState<AppState>('dashboard');
    const [mobileOpen, setMobileOpen] = useState(false);

    
    const navigate = useNavigate()
    const [isLoading, setIsloading] = useState(false);

    // --- Handlers ---
    const pageSwitch = () => {
        setIsloading(true)
        setTimeout(() => { navigate('/') }, 1500)
    }

    const handleNavigation = (view: AppState) => {
        setCurrentView(view);
        setMobileOpen(false); // Auto-close mobile menu on selection
    };

    // Helper to format the header title based on current view
    const getViewTitle = () => {
        switch (currentView) {
            case 'dashboard': return 'Dashboard / System Overview';
            case 'products': return 'Dashboard / Product Engineering';
            case 'orders': return 'Dashboard / Order Fulfillment';
            case 'users': return 'Dashboard / Customer Directory';
            default: return 'YLink Admin Console';
        }
    };

    if (isLoading) {
        return (
            <div className="fixed min-w-screen min-h-screen z-100 bg-slate-50 flex flex-col items-center justify-center gap-4">
                <Loader className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">Switching Page to Main mode...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
            
            {/* Mobile Overlay Backdrop */}
            {mobileOpen && (
                <div 
                    onClick={() => setMobileOpen(false)} 
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity" 
                />
            )}

            {/* Premium Navigation Sidebar */}
            <aside className={`
                fixed top-0 left-0 bottom-0 w-64 bg-slate-950 text-slate-300 z-50 flex flex-col justify-between transition-transform duration-300 ease-[0.25,1,0.5,1] lg:relative lg:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div>
                    <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60">
                        <span className="text-white font-black tracking-tight text-lg flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-inner shadow-white/20"><Laptop /></div>
                            YLink Console
                        </span>
                        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"><X size={20} /></button>
                    </div>

                    <nav className="p-4 space-y-1.5 overflow-y-auto">
                        <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 mt-2">Core Engines</p>
                        
                        <button onClick={() => handleNavigation('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentView === 'dashboard' ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 cursor-pointer'}`}>
                            <LayoutDashboard size={18} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} /> System Overview
                        </button>
                        
                        <button onClick={() => handleNavigation('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentView === 'products' ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 cursor-pointer'}`}>
                            <Box size={18} strokeWidth={currentView === 'products' ? 2.5 : 2} /> Product Engineering
                        </button>

                        <button onClick={() => handleNavigation('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentView === 'orders' ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 cursor-pointer'}`}>
                            <ShoppingCart size={18} strokeWidth={currentView === 'orders' ? 2.5 : 2} /> Order Fulfillment
                        </button>

                        <button onClick={() => handleNavigation('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentView === 'users' ? 'bg-blue-600/10 text-blue-500 shadow-sm' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 cursor-pointer'}`}>
                            <Users size={18} strokeWidth={currentView === 'users' ? 2.5 : 2} /> Customer Directory
                        </button>
                    </nav>
                </div>
                
                <div className="p-6 border-t border-slate-800/60 bg-slate-950/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-sm border border-slate-700">UA</div>
                            <div>
                                <p className="text-sm font-bold text-white leading-tight">Admin User</p>
                                <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                                </p>
                            </div>
                        </div>
                        <button onClick={pageSwitch} className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer" title="End Session">
                            <LogOut size={18} />
                        </button>
                    </div>
                    <p className='text-slate-200 text-sm text-center mt-3'>v.0.1.2</p>
                </div>
            </aside>

            {/* Application Flow Viewport */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600 cursor-pointer"><Menu size={20} /></button>
                        <div className="hidden lg:flex items-center text-sm font-black text-slate-400 uppercase tracking-wider">
                            {getViewTitle()}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-5 pointer-events-none">
                        <div className="hidden sm:flex items-center px-4 py-2 bg-slate-100/50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-full transition-all cursor-text text-slate-400 w-64">
                            <span className="text-xs font-medium">Admin Panel</span>
                            <span className="ml-auto text-[10px] font-bold border border-slate-200 rounded px-1.5 py-0.5 bg-white shadow-sm">⌘K</span>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative z-10 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto">
                        {currentView === 'dashboard' && <DashboardHome handleNavigation={handleNavigation} />}
                        {currentView === 'products' && <ProductsManager />}
                        {currentView === 'orders' && <OrdersManager />}
                        {currentView === 'users' && <UsersManager />}
                    </div>
                </main>
            </div>
        </div>
    );
}