import { ArrowRight, Laptop, Star, Sun } from "lucide-react"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className="relative bg-slate-900 text-white lg:pt-32 pt-38 pb-20 overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-6">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Premium Tech & Solar Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Powering your life. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Connecting your world.
            </span>
          </h1>
          <p className="text-slate-300 text-md sm:text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            From enterprise-grade laptops to reliable solar installations, we provide cutting-edge hardware backed by unmatched, relationship-driven customer support.
          </p>
          <div className="flex flex-col md:flex-row  items-center gap-4 w-full md:gap-6">
            <Link to="/shop" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 w-full flex items-center justify-center text-nowrap gap-2 cursor-pointer">
              Shop Hardware <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/consultation?type=repair" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all w-full text-center text-nowrap cursor-pointer">
              Log Repair Ticket
            </Link>
            <Link to="/consultation" className="px-8 py-4 bg-amber-50/20 text-amber-600 hover:bg-amber-600/20 border border-amber-600 font-bold rounded-xl transition-all w-full text-center text-nowrap cursor-pointer">
              Book Solar Consultation
            </Link>
          </div>
        </div>

        {/* Decorative Sun for Mobile View */}
        <div className="lg:hidden absolute -top-18 end-0 animate-fade-in-up duration-200">
          <Sun className="w-24 h-24 text-amber-400 opacity-80 animate-pulse" />
        </div>

        {/* Hero Visual Mockup */}
        <div className="hidden lg:flex justify-end animate-fade-in-up duration-200">
          <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-slate-800 to-slate-700 rounded-full border-8 border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Decorative elements representing tech & solar */}
            <Sun className="absolute top-12 right-12 w-24 h-24 text-amber-400 opacity-80 animate-pulse" />
            <Laptop className="absolute bottom-12 left-12 w-32 h-32 text-blue-400 opacity-90" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero;