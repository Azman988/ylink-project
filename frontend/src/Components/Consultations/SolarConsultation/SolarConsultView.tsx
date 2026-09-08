import { Sun } from "lucide-react";
import Benefits from "./SolarBenefits";
import BookingForm from "./BookingForm";

const SolarConsultationView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="bg-[url('/solar-panel.webp')] bg-cover bg-center bg-no-repeat text-white pt-28 pb-24 sm:px-6 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-amber-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
                        <Sun className="w-4 h-4" /> Energy Independence
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                        Power Your World. <br className="hidden md:block" /> Uninterrupted.
                    </h1>
                    <p className="text-slate-300 text-md md:text-lg max-w-xl mx-auto leading-relaxed">
                        Take control of your energy needs with custom solar and inverter solutions designed for homes and businesses across Oyo State.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto sm:px-6 px-4 -mt-12 relative z-20">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Left: Benefits */}
                    <Benefits />

                    {/* Right: Booking Form */}
                    <div className="lg:col-span-3">
                        <BookingForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolarConsultationView