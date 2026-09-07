import { BatteryCharging, MapPin, ShieldCheck, Sun, Zap } from "lucide-react"


const Benefits = () => {
    return (
        <div className="lg:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Why Switch to YLink Solar?</h2>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Zero Blackouts</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Seamless transition during grid failures. Keep your essential appliances running 24/7 without the noise of a generator.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <BatteryCharging className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Premium Hardware</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">We use high-efficiency monocrystalline panels and deep-cycle tubular batteries built to withstand heavy daily cycling.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Expert Installation & Support</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Our local engineering team ensures optimal roof placement and safe wiring, backed by our 1-year service warranty.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment Process Box */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                    <Sun className="w-48 h-48 -translate-y-12 translate-x-12" />
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10">What happens next?</h3>
                <ol className="space-y-4 relative z-10 text-slate-300 text-sm">
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">1</span>
                        <span>We review your submitted power requirements.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">2</span>
                        <span>Our engineer visits your property in Ibadan/environs for a load assessment.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">3</span>
                        <span>You receive a customized quote and system design.</span>
                    </li>
                </ol>
            </div>

            {/* Local Support Promise */}
            <div className="lg:hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {/* Background Icon */}
                <div className="absolute -right-6 -top-6 opacity-20 pointer-events-none transition-transform hover:scale-110 duration-700">
                    <MapPin className="w-40 h-40" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl font-extrabold mb-2">Local Support Promise</h3>
                    <p className="text-amber-50 text-sm leading-relaxed mb-6">
                        Our rapid-response engineering team is based right here in Ibadan. We ensure quick deployment, seamless installations, and 24-hour troubleshooting for all our residential and commercial setups across the city.
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm font-bold bg-white/20 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/10">
                        <Zap className="w-4 h-4 text-amber-200" />
                        <span>Fast Dispatch Guaranteed</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Benefits;