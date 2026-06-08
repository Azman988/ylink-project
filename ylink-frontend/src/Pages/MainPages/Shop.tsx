import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, SlidersHorizontal, Layers } from 'lucide-react';
import { mockProduct, type ProductDetail } from '../../data/product';
import ProductCard from '../../Components/MainComponents/ProductCard/ProductCard';

// --- Type ---
type Category = 'All' | 'Laptops' | 'Smartphones' | 'Accessories' | 'Solar/Inverters' | 'Repairs';
const categories: Category[] = [
    'All',
    'Laptops',
    'Smartphones',
    'Accessories',
    'Solar/Inverters',
    'Repairs',
];

// --- Component ---
const Shop: React.FC = () => {
    // const [productsData, setProductsData] = useState<ProductDetail[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [params, setParams] = useSearchParams();

    // Fetch dynamic database context if only an ID is passed down
    const [productsData, setProductsData] = useState<ProductDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {

        const fetchProductData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/products/data`);
                if (!response.ok) throw new Error('Network error');
                const data = await response.json();
                setProductsData(data);
            } catch (error) {
                console.error('Failed to resolve runtime product parameters:', error);
                setProductsData(mockProduct)
            } finally {
                setTimeout(() => setIsLoading(false), 1500);
            }
        };

        fetchProductData();
    }, []);

    // Update active category based on URL param (if present)
    const categoryParam = params.get('category');
    useEffect(() => {
        if (categoryParam && categories.includes(categoryParam as Category)) {
            setActiveCategory(categoryParam as Category);
        } else {
            setActiveCategory('All');
        }
    }, [categoryParam]);

    // Handle filter click and synchronize with URL parameters
    const handleCategoryChange = (category: Category) => {
        setActiveCategory(category);
        if (category === 'All') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        setParams(params);
    };

    // Filter products based on selected category
    const filteredProducts = productsData?.filter(
        (product) => activeCategory === 'All' || product.category === activeCategory
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[400px] left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
            <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/4"></div>

            {/* --- HERO HEADER SECTION --- */}
            <div className="bg-slate-900 text-white pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-blue-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-amber-400" /> Premium Catalog
                    </div>
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
                        Our Products & Services
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl font-normal leading-relaxed">
                        Browse our premium retail tech, book immediate hardware repairs, or explore customized sustainable power solutions.
                    </p>
                </div>
            </div>

            {/* --- MAIN CATALOG CONTENT --- */}
            <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">

                {/* Filter Control Box */}
                <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-xl shadow-slate-200/40 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-2.5 text-slate-900 self-start md:self-auto">
                        <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-sm uppercase tracking-wider text-slate-500">Filter By Category</span>
                    </div>

                    {/* Pill Buttons Container */}
                    <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-start md:justify-end">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer border select-none
                                    ${activeCategory === category
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                                        : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-white hover:border-blue-500 hover:text-blue-600 hover:shadow-sm'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Filter State Label */}
                <div className="flex items-center gap-2 mb-6 text-slate-400 text-sm font-bold uppercase tracking-wider animate-fade-in px-2">
                    <Layers className="w-4 h-4" />
                    <span>Showing: </span>
                    <span className="text-blue-600 font-semibold">{activeCategory} Items</span>
                    <span className="text-slate-700 font-normal">({filteredProducts.length})</span>
                </div>

                {/* Product Grid Area */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} isLoading={isLoading} />
                        ))}
                    </div>
                ) : (
                    /* Elegant Empty State Container */
                    <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl p-8 max-w-xl mx-auto shadow-sm animate-fade-in">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-slate-100">
                            <Layers className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Items Found</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                            We currently do not have matching products listed under this filter. Try adjusting your parameters or contact support.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Shop;