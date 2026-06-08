import { Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingBag, Zap } from 'lucide-react';
import { useMemo } from 'react';

// --- Types & Mock Data ---
interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
}

const TESTIMONIALS: Testimonial[] = [
    { id: 1, name: "Tunde B.", role: "Software Developer", content: "The solar installation completely changed my remote work setup. Zero downtime, top-tier service." },
    { id: 2, name: "Sarah A.", role: "Business Owner", content: "Fastest gadget delivery in the city. The customer support team actually knows their tech inside out." },
    { id: 3, name: "Emeka O.", role: "Tech Enthusiast", content: "Bought my primary workstation here. The quality and warranty gave me total peace of mind." },
    { id: 4, name: "Aisha F.", role: "Freelancer", content: "YLinkTech's repair service saved my laptop right before a major project deadline. Lifesavers!" },
    { id: 5, name: "David M.", role: "Creative Director", content: "Clean energy and premium tech hardware in one place. I don't shop anywhere else anymore." },
];

export default function CTASection() {
    // --- Authentication Mock ---
    // In production, replace this with your actual authentication hook (e.g., const { user } = useAuth();)
    const user = { fullName: 'Usman Azeez', email: 'azman@gmail.com', isAdmin: true };
    // --- Computed Properties ---
    const nameTokens = useMemo(() => {
        const parts = user.fullName.trim().split(/\s+/);
        return {
            firstName: parts[0] || 'User',
            initials: (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
        };
    }, [user.fullName]);

    // We duplicate the array to create a seamless infinite scroll loop
    const scrollItems = [...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section className="bg-slate-50 py-20 overflow-hidden relative">

            {/* --- TOP: Auto-Scrolling Testimonials --- */}
            <div className="max-w-[100vw] mx-auto mb-20 relative">
                <div className="text-center mb-10 px-6">
                    <h3 className="text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-2">Community Feedback</h3>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Don't just take our word for it</h2>
                </div>

                {/* Left & Right Fade Gradients for smooth entrance/exit */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                {/* Scrolling Track Container */}
                <div className="flex animate-infinite-scroll gap-6 px-6">
                    {scrollItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="w-[320px] sm:w-[380px] shrink-0 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
                        >
                            <div className="flex items-center gap-1 mb-3 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-medium">"{item.content}"</p>
                            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM: Dynamic Call To Action --- */}
            <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
                <div className="bg-slate-950 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden border border-slate-800">

                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    {user ? (
                        /* LOGGED IN VIEW */
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-slate-800 border border-slate-700 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight mb-4">
                                Welcome back, {nameTokens?.firstName}!
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm md:text-base font-medium">
                                We've restocked our inventory with the latest high-performance gear. Ready to upgrade your setup?
                            </p>
                            <div onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/shop" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                    <ShoppingBag className="w-4 h-4" /> Shop New Arrivals
                                </Link>
                                <Link to="/account" className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                    View Dashboard
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* LOGGED OUT VIEW */
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                                Ready to elevate your tech?
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
                                Join thousands of satisfied customers who trust YLink Tech for their daily devices and sustainable energy solutions. Create an account to track orders and save your delivery details.
                            </p>
                            <Link to="/auth/signup" className="w-fit px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 text-sm font-black rounded-xl transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 mx-auto cursor-pointer">
                                Create Your Account <ChevronRight className="w-4 h-4" />
                            </Link>
                            <p className="mt-6 text-xs text-slate-500 font-medium">
                                Already have an account? <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in here</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
}