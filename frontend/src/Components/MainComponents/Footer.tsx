import React from "react";
import { MailIcon, MapPin, PhoneIcon, Laptop } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// --- Types ---
interface NavLink {
    label: string;
    path: string;
}

export default function Footer() {
    const { user } = useAuth();

    // --- Configuration Data ---
    const QUICK_LINKS: NavLink[] = [
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/shop' },
        { label: 'Solar', path: '/consultation' }
    ];

    const CUSTOMER_SERVICE: NavLink[] = [
        ...(user ? [{ label: 'My Account', path: '/account' }] : []),
        ...(user ? [{ label: 'My Orders', path: '/orders' }] : []),
        { label: 'Support', path: '/support' }
    ];

    const SOCIAL_LINKS = [
        { icon: FaFacebook, label: 'Facebook', url: 'https://www.facebook.com/1975967899313515', hoverColor: 'hover:text-blue-500' },
        { icon: FaInstagram, label: 'Instagram', url: 'https://www.instagram.com/y_link_tech', hoverColor: 'hover:text-pink-500' },
        { icon: FaTiktok, label: 'TikTok', url: 'https://tiktok.com', hoverColor: 'hover:text-white' }
    ];

    // --- Reusable Sub-components ---
    const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
        <li>
            <Link
                to={to}
                onClick={handleScrollTop}
                className="text-slate-400 hover:text-blue-500 hover:translate-x-1 inline-block transition-all duration-300"
            >
                {children}
            </Link>
        </li>
    );

    return (
        <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 px-6 mt-auto border-t border-slate-900 print:hidden font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                {/* Brand & Contact Info */}
                <div className="lg:col-span-5 pr-0 lg:pr-12">
                    <Link to='/' onClick={handleScrollTop} className="flex items-center gap-3 cursor-pointer group w-fit mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:bg-blue-500 transition-all duration-300">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-black text-white tracking-tight">
                            YLink<span className="text-blue-600">Tech</span>
                        </div>
                    </Link>

                    <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                        Your ultimate tech and energy hub. Premium retail, expert repairs, and reliable solar solutions designed for the modern world.
                    </p>

                    <div className="space-y-4 text-sm font-medium">
                        <div className="flex items-center gap-3 text-slate-300">
                            <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <span>27 Babalegba Street, Eleyele Area,<br />Ibadan, Nigeria</span>
                        </div>
                        <a href="tel:+2348100673097" className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors w-fit">
                            <PhoneIcon className="w-5 h-5 text-emerald-500 shrink-0" /> +234 810 0673 097
                        </a>
                        <a href="mailto:yuppies3310@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors w-fit">
                            <MailIcon className="w-5 h-5 text-blue-500 shrink-0" /> ylinktech7@gmail.com
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-2">
                    <h3 className="text-white font-bold text-base uppercase tracking-wider mb-6">Explore</h3>
                    <ul className="space-y-3.5 text-sm">
                        {QUICK_LINKS.map((link) => (
                            <FooterLink key={link.path} to={link.path}>
                                {link.label}
                            </FooterLink>
                        ))}
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="lg:col-span-2">
                    <h3 className="text-white font-bold text-base uppercase tracking-wider mb-6">Service</h3>
                    <ul className="space-y-3.5 text-sm">
                        {CUSTOMER_SERVICE.map((link) => {
                            return (
                                <FooterLink key={link.label} to={link.path}>
                                    {link.label}
                                </FooterLink>
                            );
                        })}
                    </ul>
                </div>

                {/* Social Media */}
                <div className="lg:col-span-3">
                    <h3 className="text-white font-bold text-base uppercase tracking-wider mb-6">Connect With Us</h3>
                    <ul className="space-y-4 text-sm">
                        {SOCIAL_LINKS.map(({ icon: Icon, label, url, hoverColor }) => (
                            <li key={label}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`w-fit flex items-center gap-3 text-slate-400 ${hoverColor} transition-colors duration-300 font-medium`}
                                >
                                    <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Copyright & Legal */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
                <p>
                    © {new Date().getFullYear()} YLink Tech. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <Link to="/privacy-policy" onClick={handleScrollTop} className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                    <Link to="/terms-of-service" onClick={handleScrollTop} className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}