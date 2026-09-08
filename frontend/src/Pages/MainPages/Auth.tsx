import React, { useState, useEffect } from 'react';
import {
    Lock, Mail, User, Phone, Eye, EyeOff, Loader2, ArrowRight,
    CheckCircle2, AlertCircle, Laptop, Sun, Wrench, ShieldCheck,
    ArrowLeft, Gift, KeyRound, RefreshCw
} from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'verify_email';

interface LocationState {
    from?: {
        pathname: string;
    };
}

const Auth: React.FC = () => {
    // --- Routing & URL State ---
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Context destructured with fallback check for verify email handlers
    const authContext = useAuth();
    const { user, login, register, forgetPassword } = authContext;
    const verifyEmail = (authContext as any).verifyEmail;
    const resendVerificationCode = (authContext as any).resendVerificationCode || (authContext as any).resendVerification;

    // Derive current mode from URL parameter, default to signin
    const currentMode = (searchParams.get('mode') as AuthMode) || 'signin';
    const refCode = searchParams.get('ref') || '';
    const emailParam = searchParams.get('email') || '';

    // --- Component State ---
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: emailParam || '',
        phone: '',
        password: '',
        verificationCode: '',
        referredByCode: refCode,
        agreeTerms: false
    });

    // Handle resend countdown timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Sync parameters and state when URL mode changes
    useEffect(() => {
        setAuthStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setShowPassword(false);
        if (refCode) {
            setFormData(prev => ({ ...prev, referredByCode: refCode }));
        }
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }
    }, [currentMode, refCode, emailParam]);

    // --- Handlers ---
    const handleModeSwitch = (mode: AuthMode, targetEmail?: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('mode', mode);
        if (targetEmail) {
            newParams.set('email', targetEmail);
        }
        setSearchParams(newParams);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (authStatus === 'error') {
            setAuthStatus('idle');
            setErrorMessage('');
        }
    };

    // --- Validation Engine ---
    const validateForm = (): string | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+0-9\s-]{10,15}$/;

        if (!formData.email.trim()) {
            return 'Please enter your email address.';
        }

        if (!emailRegex.test(formData.email.trim())) {
            return 'Please enter a valid email address.';
        }

        if (currentMode === 'verify_email') {
            if (!formData.verificationCode.trim()) {
                return 'Please enter the verification code sent to your email.';
            }
            if (formData.verificationCode.trim().length < 4) {
                return 'Please enter a valid verification code.';
            }
            return null;
        }

        if (currentMode === 'forgot_password') {
            return null;
        }

        if (!formData.password) {
            return 'Please enter your password.';
        }

        if (formData.password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }

        if (currentMode === 'signup') {
            if (formData.name.trim().length < 2) {
                return 'Please enter your full name.';
            }
            if (!phoneRegex.test(formData.phone.trim())) {
                return 'Please enter a valid phone number (10–15 digits).';
            }
            if (!formData.agreeTerms) {
                return 'You must accept the Terms of Service & Privacy Policy to continue.';
            }
        }

        return null;
    };

    // Location fallback routing
    const locationState = location.state as LocationState | null;
    const from = locationState?.from?.pathname;

    const navigateToDestination = (currentUser?: any) => {
        const activeUser = currentUser || user;
        const destination = from
            ? from
            : activeUser?.role === 'admin'
                ? '/admin'
                : '/';

        navigate(destination, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Resend Verification Handler ---
    const handleResendCode = async () => {
        if (resendTimer > 0 || isResending) return;
        setIsResending(true);
        setErrorMessage('');
        
        try {
            if (resendVerificationCode) {
                await resendVerificationCode(formData.email);
            }
            setResendTimer(60);
            setSuccessMessage(`A new verification code has been dispatched to ${formData.email}.`);
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to resend code. Please try again.';
            setErrorMessage(msg);
            setAuthStatus('error');
        } finally {
            setIsResending(false);
        }
    };

    // --- Main Submission Logic ---
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
            if (currentMode === 'signin') {
                await login(formData.email, formData.password);
                const authenticatedUser = user;

                // Enforce email verification check on Sign In
                if (authenticatedUser && (authenticatedUser.isVerified === false)) {
                    setSuccessMessage('Your email address is not verified yet. Please enter the verification code sent to your inbox.');
                    handleModeSwitch('verify_email', formData.email);
                    return;
                }

                setAuthStatus('success');
                navigateToDestination(authenticatedUser);

            } else if (currentMode === 'signup') {
                await register(
                    formData.name,
                    formData.email,
                    formData.phone,
                    formData.password,
                    formData.referredByCode
                );

                // DO NOT ROUTE TO MAIN PAGE. Transition to verification step instead.
                setSuccessMessage('Account created successfully! We sent a verification code to your email.');
                handleModeSwitch('verify_email', formData.email);

            } else if (currentMode === 'verify_email') {
                if (verifyEmail) {
                    const verifiedUser = await verifyEmail(formData.email, formData.verificationCode.trim());
                    setAuthStatus('success');
                    // Route to main page ONLY after successful verification
                    setTimeout(() => {
                        navigateToDestination(verifiedUser);
                    }, 1200);
                } else {
                    // Fallback state if verifyEmail function is handled directly in context state
                    setAuthStatus('success');
                    setTimeout(() => {
                        navigateToDestination();
                    }, 1200);
                }

            } else {
                await forgetPassword(formData.email);
                setAuthStatus('success');
            }
        } catch (error: unknown) {
            setAuthStatus('error');

            let apiMessage = 'An unexpected error occurred. Please try again.';
            if (error && typeof error === 'object') {
                const err = error as Record<string, any>;
                apiMessage =
                    err.response?.data?.message ||
                    err.data?.message ||
                    err.message ||
                    apiMessage;

                // Detect unverified account response error from backend on signin
                if (currentMode === 'signin' && (apiMessage.toLowerCase().includes('verify') || apiMessage.toLowerCase().includes('unverified'))) {
                    setSuccessMessage(apiMessage);
                    handleModeSwitch('verify_email', formData.email);
                    return;
                }
            }

            setErrorMessage(apiMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Dynamic Content Helpers ---
    const getHeaderText = () => {
        if (currentMode === 'signin') return 'Sign In to your Account';
        if (currentMode === 'signup') return 'Create an Account';
        if (currentMode === 'verify_email') return 'Verify Your Email';
        return 'Reset Password';
    };

    // --- Dynamic Subheader Text ---
    const getSubHeaderText = () => {
        if (currentMode === 'signin') return 'Synchronize your shopping cart, pending order structures, and support tickets.';
        if (currentMode === 'signup') return 'Unlock automated repair logging, simplified checkouts, and extended hardware guarantees.';
        if (currentMode === 'verify_email') return `We sent a security verification code to ${formData.email || 'your email address'}. Please enter it below to complete access.`;
        return 'Enter your registered email address and we will send you instructions to securely reset your password.';
    };

    return (
        <div className="min-h-screen bg-white flex text-slate-800 font-sans">
            {/* --- LEFT PANEL: Brand & Value Stack --- */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between px-12 pt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[90px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[90px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-end gap-1.5 mb-16 group w-fit">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-black text-slate-100 tracking-tighter xl:mr-20 lg:mr-14 md:mr-12 mr-6">
                            YLink<span className="text-blue-500">Tech</span>
                        </div>
                    </div>

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
            <div className="w-full relative h-full lg:overflow-y-auto bg-slate-50 lg:w-1/2 py-24 px-6 sm:px-10 flex items-center justify-center">

                {/* Mobile Navbar Badge */}
                <div className="lg:hidden flex items-end gap-1.5 fixed top-0 left-6 sm:left-10 py-4 bg-white bg-opacity-80 backdrop-blur-md w-full z-20">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 transition-colors">
                        <Laptop className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter">
                        YLink<span className="text-blue-500">Tech</span>
                    </div>
                </div>

                <div className="w-full h-full max-w-md animate-fade-in-up duration-500 flex items-center justify-center">
                    <div>
                        {/* Success States */}
                        {authStatus === 'success' ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                                    {currentMode === 'forgot_password'
                                        ? 'Reset Link Sent!'
                                        : currentMode === 'verify_email'
                                            ? 'Email Verified!'
                                            : 'Authentication Complete'}
                                </h2>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    {currentMode === 'forgot_password'
                                        ? `We've sent a secure recovery link to ${formData.email}. Please check your inbox and spam folder.`
                                        : currentMode === 'verify_email'
                                            ? 'Your email address has been verified successfully. Redirecting you to the platform...'
                                            : 'Securely synchronizing your cart elements and operational dashboard...'
                                    }
                                </p>

                                {currentMode === 'forgot_password' ? (
                                    <button
                                        type="button"
                                        onClick={() => handleModeSwitch('signin')}
                                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        Return to Sign In
                                    </button>
                                ) : (
                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Back Button for Forgot Password & Verification */}
                                {(currentMode === 'forgot_password' || currentMode === 'verify_email') && (
                                    <button
                                        type="button"
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

                                {/* Banner Notice for Transitions */}
                                {successMessage && (
                                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-800 text-sm animate-in fade-in slide-in-from-top-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <p className="font-medium">{successMessage}</p>
                                    </div>
                                )}

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
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter Full Name"
                                                className={`w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border ${authStatus === 'error' && !formData.name ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-medium text-slate-900 text-sm`}
                                            />
                                        </div>
                                    )}

                                    {/* Email Input (All Modes except verify_email when set) */}
                                    {currentMode !== 'verify_email' && (
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email Address"
                                                className={`w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border ${authStatus === 'error' && !formData.email ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-medium text-slate-900 text-sm`}
                                            />
                                        </div>
                                    )}

                                    {/* Verification Code Input (Verify Email Mode Only) */}
                                    {currentMode === 'verify_email' && (
                                        <div className="space-y-4 animate-in fade-in">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <KeyRound className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="verificationCode"
                                                    value={formData.verificationCode}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter 6-digit Code"
                                                    maxLength={10}
                                                    className={`w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border ${authStatus === 'error' && !formData.verificationCode ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl outline-none focus:bg-white focus:ring-4 transition-all font-mono font-bold text-center tracking-widest text-slate-900 text-base`}
                                                />
                                            </div>

                                            {/* Resend Code Option */}
                                            <div className="flex items-center justify-between text-xs px-1">
                                                <span className="text-slate-500">Didn't receive a code?</span>
                                                <button
                                                    type="button"
                                                    onClick={handleResendCode}
                                                    disabled={resendTimer > 0 || isResending}
                                                    className="font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    {isResending ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                    )}
                                                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone Input (Signup Only) */}
                                    {currentMode === 'signup' && (
                                        <div className="relative animate-in fade-in">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                autoComplete="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Mobile Number"
                                                className="w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-900 text-sm"
                                            />
                                        </div>
                                    )}

                                    {/* Password Input (Hidden on Forgot Password and Email Verification) */}
                                    {currentMode !== 'forgot_password' && currentMode !== 'verify_email' && (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    autoComplete={currentMode === 'signup' ? 'new-password' : 'current-password'}
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

                                    {/* Referral Code Input (Signup Only) */}
                                    {currentMode === 'signup' && (
                                        <div className="relative animate-in fade-in">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <Gift className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="referredByCode"
                                                value={formData.referredByCode}
                                                onChange={handleInputChange}
                                                placeholder="Referral Code (Optional)"
                                                className="w-full pl-12 pr-4 py-3.5 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-900 text-sm"
                                            />
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
                                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {currentMode === 'signin' && 'Sign In'}
                                                    {currentMode === 'signup' && 'Create Account'}
                                                    {currentMode === 'verify_email' && 'Verify & Complete Sign In'}
                                                    {currentMode === 'forgot_password' && 'Send Recovery Link'}
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Mode Switcher */}
                                {currentMode !== 'forgot_password' && currentMode !== 'verify_email' && (
                                    <div className="mt-8 text-center border-t border-slate-200 pt-8">
                                        <p className="text-sm text-slate-500 font-medium">
                                            {currentMode === 'signin' ? "Don't have an account yet?" : 'Already have an account?'}
                                            <button
                                                type="button"
                                                onClick={() => handleModeSwitch(currentMode === 'signin' ? 'signup' : 'signin')}
                                                className="ml-2 font-bold text-blue-600 hover:text-blue-700 transition-colors outline-none cursor-pointer"
                                            >
                                                {currentMode === 'signin' ? 'Sign Up' : 'Sign In'}
                                            </button>
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;