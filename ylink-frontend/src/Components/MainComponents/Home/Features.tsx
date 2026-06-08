import { FileText, MessageSquareHeart, PackageSearch, Truck } from "lucide-react";

const Features = () => {
    return (
        <div className="bg-slate-900 py-24 text-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight mb-4">A Seamless Digital Experience</h2>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                We've upgraded our platform to give you complete control. Transparency and user satisfaction are at the core of our new customer portal.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                                    <PackageSearch className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Live Order Tracking</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Watch your package move from our distribution hub in Ibadan straight to your doorstep with real-time milestone updates.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Instant Digital Invoicing</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Access your complete purchase history and download beautifully formatted, print-ready PDF invoices at any time.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                                    <MessageSquareHeart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Empathetic Support Hub</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Our support team specializes in conflict resolution and rapid assistance. Raise a ticket, and consider it solved.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Dashboard Mockup UI */}
                    <div className="bg-slate-800 rounded-3xl border border-slate-700 p-2 shadow-2xl relative">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-40"></div>
                        <div className="bg-slate-50 rounded-[22px] overflow-hidden">
                            {/* Mini mock of the tracking UI you just built */}
                            <div className="p-6 border-b border-slate-200 bg-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">Order ORD-2026-7741</h3>
                                <p className="text-xs text-slate-500">Arriving: June 4, 2026</p>
                            </div>
                            <div className="p-6 bg-slate-50 space-y-4">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <CheckCircleMock /> <div className="h-0.5 flex-1 bg-slate-200"></div>
                                    <CheckCircleMock /> <div className="h-0.5 flex-1 bg-slate-200"></div>
                                    <Truck className="w-6 h-6 text-blue-600" /> <div className="h-0.5 flex-1 bg-slate-200"></div>
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6">
                                    <p className="text-sm font-bold text-slate-800 mb-1">Currently in Transit</p>
                                    <p className="text-xs text-slate-500">Package has left the main distribution facility.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper component for the mockup UI
const CheckCircleMock = () => (
  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-200">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  </div>
);

export default Features;