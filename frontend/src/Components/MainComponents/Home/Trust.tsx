import { Headphones, ShieldCheck, Truck } from "lucide-react"

const Trust = () => {
    return (
        <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4 sm:py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center md:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="flex items-center gap-4 justify-center py-4 md:py-0">
                        <Truck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Swift Nationwide Delivery</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Fast routing across Nigeria</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center py-4 md:pt-0">
                        <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Certified Hardware</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Full manufacturer warranties</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center py-4 md:py-0">
                        <Headphones className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Customer-First Support</h4>
                            <p className="text-xs text-slate-500 mt-0.5">We prioritize long-term relation</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trust;