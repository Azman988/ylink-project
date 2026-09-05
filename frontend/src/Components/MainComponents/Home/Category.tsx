import { Laptop, Smartphone, Sun, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

const Category = () => {
    return (
        <div className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Explore Our Divisions</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Whether you're upgrading your workspace or transitioning to renewable energy, we have the expertise to deliver perfection.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <Laptop className="w-8 h-8 mb-4 text-blue-600" />, title: 'Laptops & PCs', desc: 'Enterprise and creator-focused workstations.', color: 'hover:border-blue-300', link: '/shop?category=Laptops' },
                    { icon: <Smartphone className="w-8 h-8 mb-4 text-purple-600" />, title: 'Smartphones', desc: 'Latest flagship devices and accessories.', color: 'hover:border-purple-300', link: '/shop?category=Smartphones' },
                    { icon: <Sun className="w-8 h-8 mb-4 text-amber-500" />, title: 'Solar Energy', desc: 'Monocrystalline panels and hybrid inverters.', color: 'hover:border-amber-300', link: '/consultation?type=solar' },
                    { icon: <Wrench className="w-8 h-8 mb-4 text-emerald-600" />, title: 'Expert Repairs', desc: 'Component-level diagnostics and restoration.', color: 'hover:border-emerald-300', link: '/consultation?type=repair' },
                ].map((cat, i) => (
                    <Link 
                        key={i} to={cat.link} onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
                        className={`bg-white relative p-8 rounded-3xl border border-slate-200 shadow-sm transition-all duration-300 cursor-pointer group ${cat.color}`}>
                        <span className="flex items-center justify-center absolute top-5 right-5">{cat.icon}</span>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Category;