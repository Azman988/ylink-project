import { CheckCircle2, Cpu, Lock, PenTool, ShieldCheck, Wrench } from "lucide-react"

const RepairBenefits = () => {
    return (
        <div className="lg:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Why Choose YLink Repairs?</h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Advanced Diagnostics</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">We don't just guess. We perform deep board-level diagnostics to find the exact hardware fault.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <PenTool className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Genuine Components</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">From screens to motherboard chips, we source certified replacement parts to ensure longevity.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Post-Repair Warranty</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Every repair ticket is backed by our standard service warranty. If the fix fails, we cover it.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                    <Wrench className="w-48 h-48 -translate-y-10 translate-x-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10">How our workshop operates</h3>
                <ol className="space-y-4 relative z-10 text-slate-300 text-sm">
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">1</span>
                        <span>Book an appointment describing your device issue.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">2</span>
                        <span>Bring your device in (or arrange courier) for an official diagnostic check.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">3</span>
                        <span>Approve the final repair quote and let our technicians handle the rest.</span>
                    </li>
                </ol>
            </div>

            {/* Strict Data Privacy */}
            <div className="lg:hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden border border-slate-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                    <Lock className="w-48 h-48" />
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 mb-5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Confidential
                    </div>

                    <h3 className="text-xl font-extrabold mb-3">Strict Data Privacy</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Your personal files, photos, and accounts are completely secure. We adhere to a rigorous zero-snooping policy during hardware diagnostics, ensuring your data remains untouched while your device is in our lab.
                    </p>

                    <div className="flex items-center gap-3 text-sm font-bold bg-slate-800/50 border border-slate-600 w-fit px-4 py-3 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        <span>Lab Certified Secure</span>
                    </div>
                </div>
            </div>

            {/* Desktop Filler: Quality Parts Teaser */}
            {/* <div className="hidden lg:flex bg-white border border-slate-200 rounded-3xl p-6 items-center gap-5 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Cpu className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">OEM Replacement Parts</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">We source original components to ensure maximum device longevity.</p>
                </div>
            </div> */}
        </div>
    )
}

export default RepairBenefits;