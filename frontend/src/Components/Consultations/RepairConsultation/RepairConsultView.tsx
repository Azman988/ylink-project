import { Wrench } from "lucide-react";
import RepairLogForm from "./RepairLogForm";
import RepairBenefits from "./RepairBenefits";


const RepairConsultationView: React.FC = () => {

    return (
        <div className="animate-fade-in">
            <div className="bg-[url('/repair.webp')] bg-cover bg-center bg-no-repeat text-white pt-28 pb-24 sm:px-6 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/75"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-blue-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
                        <Wrench className="w-4 h-4" /> Expert Hardware Lab
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                        Restore Your Devices. <br className="hidden md:block" /> Guaranteed.
                    </h1>
                    <p className="text-slate-300 text-md md:text-lg max-w-xl mx-auto leading-relaxed">
                        Professional component-level repair for laptops, smartphones, and IT infrastructure. Fast turnarounds and certified parts.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto sm:px-6 px-4 -mt-12 relative z-20">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Left: Repair Benefits */}
                    <RepairBenefits />

                    {/* Right: Consultation Form */}
                    <div className="lg:col-span-3">
                        <RepairLogForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairConsultationView;