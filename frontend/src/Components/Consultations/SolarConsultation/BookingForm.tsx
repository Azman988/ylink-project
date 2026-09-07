import React, { useEffect, useRef, useState } from "react";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Home,
    Building2,
    ChevronDown,
    ChevronUp,
    Sun,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { sendBookingEmail } from "../../../utils/emailService";
import { getErrorMessage } from "../../../utils/errorUtils";

// Options for the custom Power Need dropdown
const POWER_NEED_OPTIONS = [
    {
        id: "Light Usage",
        title: "Light Usage",
        description: "Fans, TVs, Laptops, Lighting",
    },
    {
        id: "Medium Usage",
        title: "Medium Usage",
        description: "Includes 1 AC and a Water Pumping Machine",
    },
    {
        id: "Heavy Usage",
        title: "Heavy Usage",
        description: "Multiple ACs, Freezers, Heavy Machinery",
    },
    {
        id: "I am not sure",
        title: "I am not sure",
        description: "Require full load assessment from engineer",
    },
];

const BookingForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        propertyType: "home" as "home" | "business",
        powerNeed: "Medium Usage",
        honeypot: "", // Bot trap
    });

    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { showToast } = useToast();
    const { user } = useAuth();

    // Auto-fill user details if logged in
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
            }));
        }
    }, [user]);

    // Handle clicks outside the custom dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("submitting");
        showToast("Sending your site assessment request...");

        try {
            await sendBookingEmail(formData);
            showToast("Assessment booking confirmed successfully!", "success");
            setFormStatus("success");
        } catch (error) {
            console.error("Booking form submission error:", error);

            // Dynamically retrieves rate limit message or fallback text
            const message = getErrorMessage(
                error,
                "Failed to submit assessment request. Please try again."
            );

            showToast(message, "error");
            setFormStatus("idle");
        }
    };

    const groupStyles = {
        input: "w-full px-4 py-3 text-sm text-slate-500 font-mono bg-slate-50 hover:bg-white border border-slate-200/80 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-200",
        label: "text-sm font-bold text-slate-800 flex items-center gap-2 mb-2",
    };

    return (
        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/50 max-w-3xl mx-auto">
            {formStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3">Booking Confirmed!</h2>
                    <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                        Thank you, <span className="font-bold">{formData.name}</span>. Our engineering team will review your site details and contact you shortly.
                    </p>
                    <button
                        onClick={() => setFormStatus("idle")}
                        className="w-full max-w-sm py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer"
                    >
                        Book Another Assessment
                    </button>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Schedule a Site Assessment</h2>
                        <p className="text-slate-500">Fill out the details below so we can prepare for your consultation.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1: Name & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={groupStyles.label}>
                                    <User className="w-4 h-4 text-slate-400" /> Full Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={groupStyles.input}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className={groupStyles.label}>
                                    <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={groupStyles.input}
                                    placeholder="e.g. 08012345678"
                                />
                            </div>
                        </div>

                        {/* Row 2: Email */}
                        <div>
                            <label className={groupStyles.label}>
                                <Mail className="w-4 h-4 text-slate-400" /> Email Address (Optional)
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={groupStyles.input}
                                placeholder="e.g. john.doe@gmail.com"
                            />
                        </div>

                        {/* Row 3: Installation Address */}
                        <div>
                            <label className={groupStyles.label}>
                                <MapPin className="w-4 h-4 text-slate-400" /> Installation Address
                            </label>
                            <input
                                required
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={groupStyles.input}
                                placeholder="e.g. 123 Main Street, Ibadan"
                            />
                        </div>

                        {/* Row 4: Property Type & Custom Power Need Dropdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Property Type Toggle */}
                            <div>
                                <label className="text-sm font-bold text-slate-800 block mb-2">Property Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, propertyType: "home" }))}
                                        className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${formData.propertyType === "home"
                                            ? "bg-blue-50/50 border-2 border-blue-600 text-blue-600"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Home className="w-4 h-4" /> Home
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, propertyType: "business" }))}
                                        className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${formData.propertyType === "business"
                                            ? "bg-blue-50/50 border-2 border-blue-600 text-blue-600"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Building2 className="w-4 h-4" /> Business
                                    </button>
                                </div>
                            </div>

                            {/* Custom Dropdown: Estimated Power Need */}
                            <div className="relative" ref={dropdownRef}>
                                <label className="text-sm font-bold text-slate-800 block mb-2">
                                    Estimated Power Need
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className={`w-full px-4 py-3.5 text-left bg-slate-50 hover:bg-white border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${isDropdownOpen
                                        ? "border-blue-500 bg-white ring-1 ring-blue-500/20"
                                        : "border-slate-200/80"
                                        }`}
                                >
                                    <span className="font-semibold text-slate-800">{formData.powerNeed}</span>
                                    {isDropdownOpen ? (
                                        <ChevronUp className="w-4 h-4 text-blue-500" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl z-30 overflow-hidden py-1.5 animate-fade-in">
                                        {POWER_NEED_OPTIONS.map((option) => {
                                            const isSelected = formData.powerNeed === option.id;
                                            return (
                                                <div
                                                    key={option.id}
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, powerNeed: option.id }));
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`px-4 py-3 cursor-pointer transition-colors ${isSelected
                                                        ? "bg-blue-50/70"
                                                        : "hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div
                                                        className={`text-sm font-bold ${isSelected ? "text-blue-600" : "text-slate-800"
                                                            }`}
                                                    >
                                                        {option.title}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        {option.description}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden Honeypot Input for Bot Detection (Do not remove className or inline style) */}
                        <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                            <label htmlFor="website">Leave this field blank</label>
                            <input
                                type="text"
                                id="website"
                                name="honeypot"
                                tabIndex={-1}
                                autoComplete="off"
                                value={formData.honeypot}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={formStatus === "submitting"}
                                className="w-full h-14 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-black text-lg rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {formStatus === "submitting" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                                        Confirming Booking...
                                    </>
                                ) : (
                                    <>
                                        Confirm Assessment Booking
                                        <Sun className="w-5 h-5 fill-slate-900 text-slate-900" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-center text-slate-400 max-w-lg mx-auto leading-relaxed">
                            By booking, you agree to our assessment terms. Site visits outside Ibadan metropolis may incur a minor logistics fee.
                        </p>
                    </form>
                </>
            )}
        </div>
    );
};

export default BookingForm;