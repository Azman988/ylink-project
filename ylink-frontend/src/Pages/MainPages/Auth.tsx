import React, { useState, useEffect } from 'react';
import { 
    Lock, Mail, User, Phone, Eye, EyeOff, Loader2, ArrowRight, 
    CheckCircle2, AlertCircle, Laptop, Sun, Wrench, ShieldCheck, 
    ArrowLeft 
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

type AuthMode = 'signin' | 'signup' | 'forgot_password';

const Auth: React.FC = () => {
    // --- Routing & URL State ---
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Derive current mode from URL parameter, default to signin
    const currentMode = (searchParams.get('mode') as AuthMode) || 'signin';

    // --- Component State ---
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        agreeTerms: false
    });

    // Reset status when mode changes via URL
    useEffect(() => {
        setAuthStatus('idle');
        setErrorMessage('');
        setShowPassword(false);
    }, [currentMode]);

    // --- Handlers ---
    const handleModeSwitch = (mode: AuthMode) => {
        setSearchParams({ mode });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear errors once the user starts typing again
        if (authStatus === 'error') setAuthStatus('idle');
    };

    // --- Validation Engine ---
    const validateForm = (): string | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";

        if (currentMode === 'forgot_password') return null;

        if (formData.password.length < 8) return "Password must be at least 8 characters long.";

        if (currentMode === 'signup') {
            if (formData.name.trim().length < 2) return "Please enter your full name.";
            if (formData.phone.trim().length < 10) return "Please enter a valid phone number.";
            if (!formData.agreeTerms) return "You must accept the Terms of Service & Privacy Policy.";
        }
        return null;
    };

    // --- Submission Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            setAuthStatus('error');
            return;
        }

        setIsLoading(true);
        setAuthStatus('idle');
        setErrorMessage('');

        try {
            // Determine API Endpoint based on URL mode
            // let endpoint = '';
            // let payload = {};

            // if (currentMode === 'signin') {
            //     endpoint = '/api/auth/login';
            //     payload = { email: formData.email, password: formData.password };
            // } else if (currentMode === 'signup') {
            //     endpoint = '/api/auth/register';
            //     payload = { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password };
            // } else {
            //     endpoint = '/api/auth/reset-password-request';
            //     payload = { email: formData.email };
            // }

            /*
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Authentication failed.');
            }
            */

            // Simulation delay for UI feedback
            await new Promise(resolve => setTimeout(resolve, 1500));
            setAuthStatus('success');
            
            // Handle successful routing
            if (currentMode === 'forgot_password') {
                // Keep them on the page to read the success message
                return;
            }

            setTimeout(() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);

        } catch (error: any) {
            setAuthStatus('error');
            setErrorMessage(error.message || 'Network anomaly detected. Please verify your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Dynamic Content Helpers ---
    const getHeaderText = () => {
        if (currentMode === 'signin') return 'Sign In to your Account';
        if (currentMode === 'signup') return 'Create an Account';
        return 'Reset Password';
    };

    const getSubHeaderText = () => {
        if (currentMode === 'signin') return 'Synchronize your shopping cart, pending order structures, and support tickets.';
        if (currentMode === 'signup') return 'Unlock automated repair logging, simplified checkouts, and extended hardware guarantees.';
        return 'Enter your registered email address and we will send you instructions to securely reset your password.';
    };

    return (
        <div className="min-h-screen bg-white flex text-slate-800 font-sans">
            {/* --- LEFT PANEL: E-Commerce Value Stack --- */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between px-12 pt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[90px] -translate-y-1/4 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[90px] translate-y-1/4 -translate-x-1/4"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-end gap-1.5 mb-16 cursor-pointer group w-fit">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-black text-slate-100 tracking-tighter xl:mr-20 lg:mr-14 md:mr-12 mr-6">
                            YLink<span className="text-blue-500">Tech</span>
                        </div>
                    </Link>

                    <h2 className="text-4xl xl:text-5xl font-semibold tracking-tight mb-6 leading-tight">
                        Your no 1 Online Store for <br /> everything hardware.
                    </h2>
                    <p className="text-slate-300 text-md max-w-md mb-10">
                        Create an integrated YLinkTech account to fast-track checkouts, securely save shipping credentials, and orchestrate technical service lifecycles.
                    </p>

                    <div className="space-y-8 max-w-lg">
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10">
                                <ShieldCheck className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-0.5">Express Shopping & Checkout</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Save regional delivery routes across Ibadan and Oyo State for single-click payments.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10">
                                <Wrench className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-0.5">Integrated Hardware Diagnostics</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Submit component repair orders directly and monitor structural workshop fixes in real time.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10">
                                <Sun className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-0.5">Solar Project Coordination</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Track residential load profiles and check customized quotes provided by our renewable engineers.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-500 font-medium text-center mt-12 pb-8">
                    &copy; {new Date().getFullYear()} YLink Tech. Global E-Commerce Architecture.
                </div>
            </div>

            {/* --- RIGHT PANEL: Interactive Form --- */}
            <div className="w-full relative lg:h-screen lg:overflow-y-auto lg:bg-white lg:w-1/2 bg-slate-50 flex items-center justify-center py-24 px-6 sm:px-10">
                
                {/* Mobile Navbar Badge */}
                <div className="lg:hidden flex items-end gap-1.5 cursor-pointer group absolute top-8 left-6 sm:left-10 z-20">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                        <Laptop className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter">
                        YLink<span className="text-blue-500">Tech</span>
                    </div>
                </div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Success States */}
                    {authStatus === 'success' ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                                {currentMode === 'forgot_password' ? 'Reset Link Sent!' : 'Authentication Complete'}
                            </h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                {currentMode === 'forgot_password' 
                                    ? `We've sent a secure recovery link to ${formData.email}. Please check your inbox and spam folder.`
                                    : 'Securely synchronizing your cart elements and operational dashboard...'
                                }
                            </p>
                            
                            {currentMode === 'forgot_password' ? (
                                <button onClick={() => handleModeSwitch('signin')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                                    Return to Sign In
                                </button>
                            ) : (
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Back Button for Forgot Password */}
                            {currentMode === 'forgot_password' && (
                                <button 
                                    onClick={() => handleModeSwitch('signin')}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </button>
                            )}

                            {/* Form Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                                    {getHeaderText()}
                                </h1>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {getSubHeaderText()}
                                </p>
                            </div>

                            {/* Error Notification */}
                            {authStatus === 'error' && (
                                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-sm animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="font-medium">{errorMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {/* Name Input (Signup Only) */}
                                {currentMode === 'signup' && (
                                    <div className="relative animate-in fade-in">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Full Legal Name"
                                            className={`w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border ${authStatus === 'error' && !formData.name && currentMode === 'signup' ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-medium text-slate-900 text-sm`}
                                        />
                                    </div>
                                )}

                                {/* Email Input (All Modes) */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className={`w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border ${authStatus === 'error' && !formData.email ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-medium text-slate-900 text-sm`}
                                    />
                                </div>

                                {/* Phone Input (Signup Only) */}
                                {currentMode === 'signup' && (
                                    <div className="relative animate-in fade-in">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Mobile Number"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-900 text-sm"
                                        />
                                    </div>
                                )}

                                {/* Password Input (Hidden on Forgot Password) */}
                                {currentMode !== 'forgot_password' && (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder={currentMode === 'signup' ? 'Create a strong password' : 'Password'}
                                                className={`w-full pl-12 pr-12 py-3.5 bg-white lg:bg-slate-50 border ${authStatus === 'error' && !formData.password ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-medium text-slate-900 text-sm`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 outline-none cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        
                                        {/* Forgot Password Link - Only on Sign In */}
                                        {currentMode === 'signin' && (
                                            <div className="flex justify-end">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleModeSwitch('forgot_password')}
                                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 outline-none transition-colors cursor-pointer"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Terms Checkbox (Signup Only) */}
                                {currentMode === 'signup' && (
                                    <div className="flex items-start gap-3 pt-2 animate-in fade-in">
                                        <input
                                            id="agreeTerms"
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 mt-1 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="agreeTerms" className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none">
                                            I authorize the transaction data profile and agree to YLinkTech's <Link to="/terms-of-service" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Terms of Service</Link> and <Link to="/privacy-policy" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Privacy Policy</Link>.
                                        </label>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                {currentMode === 'signin' && 'Sign In'}
                                                {currentMode === 'signup' && 'Create Account'}
                                                {currentMode === 'forgot_password' && 'Send Recovery Link'}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Mode Switcher */}
                            {currentMode !== 'forgot_password' && (
                                <div className="mt-8 text-center border-t border-slate-200 pt-8">
                                    <p className="text-sm text-slate-500 font-medium">
                                        {currentMode === 'signin' ? "Don't have an account yet?" : 'Already part of the ecosystem?'}
                                        <button
                                            type="button"
                                            onClick={() => handleModeSwitch(currentMode === 'signin' ? 'signup' : 'signin')}
                                            className="ml-2 font-bold text-slate-900 hover:text-blue-600 transition-colors outline-none cursor-pointer"
                                        >
                                            {currentMode === 'signin' ? 'Register Now' : 'Sign In Here'}
                                        </button>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;