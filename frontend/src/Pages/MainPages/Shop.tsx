import React, { useEffect, useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Sparkles,
    SlidersHorizontal,
    Layers,
    Search,
    ArrowRight,
    ChevronDown,
    ArrowUpDown,
    X,
    Loader2
} from 'lucide-react';
import ProductCard from '../../Components/MainComponents/ProductCard/ProductCard';
import { productApi, type GetProductsParams, type ProductDetail } from '../../api/productApi';

// --- Types ---
type Category = 'All' | 'Laptops' | 'Smartphones' | 'Accessories' | 'Solar' | 'Inverters' | 'Cameras';
type SortOption = 'newest' | 'price_asc' | 'price_desc';

const categories: Category[] = [
    'All',
    'Laptops',
    'Smartphones',
    'Accessories',
    'Solar',
    'Inverters',
    'Cameras',
];

const ITEMS_PER_PAGE = 10;

const Shop: React.FC = () => {
    const [params, setParams] = useSearchParams();

    // URL State Params
    const categoryParam = (params.get('category') as Category) || 'All';
    const searchParam = params.get('search') || '';
    const sortParam = (params.get('sort') as SortOption) || 'newest';

    // Data & Pagination States
    const [productsData, setProductsData] = useState<ProductDetail[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [totalProducts, setTotalProducts] = useState<number>(0);

    // Search input state
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>(searchParam);
    const words = ['hp', 'new in', 'oraimo', 'earbuds', 'battery', 'laptop', 'inverter', 'charger', 'play station', 'power bank', 'smartphone'];

    // Keep local input field synced when URL search parameter changes directly
    useEffect(() => {
        setInputValue(searchParam);
    }, [searchParam]);

    // Cycle placeholder terms
    useEffect(() => {
        if (words.length === 0) return;
        const timer = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [words.length]);

    // Core API Fetch function
    const fetchProducts = async (targetPage: number, append = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }

        try {
            const queryParams: GetProductsParams = {
                category: categoryParam === 'All' ? undefined : categoryParam,
                search: searchParam || undefined,
                sort: sortParam,
                page: targetPage,
                limit: ITEMS_PER_PAGE,
            };

            const response = await productApi.getProducts(queryParams);

            // Support array response or object with pagination metadata ({ data, total })
            const items: ProductDetail[] = Array.isArray(response.data)
                ? response.data
                : response.data || [];
            const { totalProducts, totalPages } = response.pagination || {};

            if (append) {
                setProductsData((prev) => [...prev, ...items]);
            } else {
                setProductsData(items);
            }

            setTotalProducts(totalProducts ?? items.length);
            setHasMore(targetPage < (totalPages ?? 1) && items.length > 0);
        } catch (error) {
            console.error('Failed to fetch products from backend:', error);
            setIsLoading(true)
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Re-fetch whenever filters in URL change (resetting to Page 1)
    useEffect(() => {
        setPage(1);
        fetchProducts(1, false);
    }, [categoryParam, searchParam, sortParam]);

    // Handle category tab change
    const handleCategoryChange = (category: Category) => {
        const updatedParams = new URLSearchParams(params);
        if (category === 'All') {
            updatedParams.delete('category');
        } else {
            updatedParams.set('category', category);
        }
        setParams(updatedParams);
    };

    // Handle Sort selection
    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value as SortOption;
        const updatedParams = new URLSearchParams(params);
        if (newSort === 'newest') {
            updatedParams.delete('sort');
        } else {
            updatedParams.set('sort', newSort);
        }
        setParams(updatedParams);
    };

    // Search Submit handler
    const handleSearchSubmit = (queryToSearch?: string) => {
        const targetQuery = (queryToSearch !== undefined ? queryToSearch : inputValue).trim();
        const updatedParams = new URLSearchParams(params);

        if (targetQuery) {
            updatedParams.set('search', targetQuery);
        } else {
            updatedParams.delete('search');
        }
        setParams(updatedParams);
    };

    // Input Key Press handler
    const handleAutoSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!inputValue.trim()) {
                const autoTerm = words[currentWordIndex];
                setInputValue(autoTerm);
                handleSearchSubmit(autoTerm);
            } else {
                handleSearchSubmit();
            }
        } else if (e.key === 'Escape') {
            clearSearch();
        }
    };

    const clearSearch = () => {
        setInputValue('');
        handleSearchSubmit('');
    };

    // Load More Handler
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
    };

    return (
        <main className="min-h-screen w-full max-w-full bg-slate-50 text-slate-800 font-sans pb-24 overflow-x-hidden">
            {/* --- HERO HEADER SECTION --- */}
            <div className="relative bg-[url('/shop.webp')] bg-cover bg-center bg-no-repeat text-white pt-30 px-6 mb-23">
                {/* overlay */}
                <div className="absolute inset-0 bg-black/75"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-blue-400 text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-amber-400" /> Premium Catalog
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                        Shop retails like <span className="text-amber-400">wholesale</span>.
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-md md:text-xl font-normal leading-relaxed">
                        Browse premium retail tech, book immediate hardware repairs, or explore customized sustainable power solutions.
                    </p>
                </div>

                {/* --- FILTER CONTROL BAR --- */}
                <div
                    className="transform translate-y-1/2 bg-white rounded-3xl lg:py-4 py-3 px-5 border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4 animate-fade-in-up"
                    style={{ animationDelay: '0.1s' }}
                >
                    {/* Categories Horizontal Scroll */}
                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-hidden">
                        <div className="pr-2.5 border-r border-slate-200 shrink-0">
                            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="flex gap-2 py-0.5 overflow-x-auto scrollbar-none w-full justify-start">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-3.5 py-1.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer border select-none whitespace-nowrap ${categoryParam === category
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                        : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 hover:shadow-xs'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Controls: Sort & Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                        {/* --- SORT / PRICE DROPDOWN --- */}
                        <div className="relative w-full sm:w-48 shrink-0">
                            <div className="absolute top-1/2 left-3.5 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                                <ArrowUpDown size={15} />
                            </div>
                            <select
                                value={sortParam}
                                onChange={handleSortChange}
                                className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-200/70 border border-transparent hover:border-slate-300 rounded-full text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                            >
                                <option value="newest">Sort: Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                            <div className="absolute top-1/2 right-3.5 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                                <ChevronDown size={15} />
                            </div>
                        </div>

                        {/* --- SEARCH INPUT BAR --- */}
                        <div className="relative w-full h-fit overflow-hidden rounded-full bg-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            {inputValue === '' && words.length > 0 && (
                                <div className="absolute top-0 left-0 w-full pl-11 pr-4 py-2 text-xs sm:text-sm text-nowrap font-normal text-slate-400 pointer-events-none flex items-center h-full">
                                    Search "<strong className="text-amber-500">{words[currentWordIndex]}</strong>"
                                </div>
                            )}

                            <input
                                type="text"
                                className="w-full h-full pl-11 pr-10 py-2 text-sm font-normal text-slate-700 appearance-none bg-transparent border-none outline-none focus:outline-none focus:ring-0"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleAutoSearch}
                            />

                            {inputValue !== '' ? (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleSearchSubmit()}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                    <ArrowRight size={17} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CATALOG CONTENT --- */}
            <div className="max-w-7xl mx-auto px-6 relative z-20">
                {/* Active Filter State Label */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-slate-400 text-sm font-bold uppercase tracking-wider animate-fade-in px-2">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>Showing: </span>
                        <span className="text-blue-600 font-semibold">{categoryParam} Items</span>
                        {searchParam && (
                            <span className="text-slate-600 normal-case bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                                "{searchParam}"
                            </span>
                        )}
                    </div>
                    {totalProducts > 0 && (
                        <span className="text-xs font-semibold text-slate-500 normal-case">
                            {productsData.length} of {totalProducts} Products
                        </span>
                    )}
                </div>

                {/* Product Grid Area */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <ProductCard key={index} isLoading={true} />
                        ))}
                    </div>
                ) : productsData.length > 0 ? (
                    <>
                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 animate-fade-in-up"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {productsData.map((product) => (
                                <ProductCard key={product._id} product={product} isLoading={false} />
                            ))}
                        </div>

                        {/* --- PAGINATION LOAD MORE BUTTON --- */}
                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold text-sm rounded-full shadow-xs hover:shadow-md transition-all duration-300 disabled:opacity-60 cursor-pointer"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                            Loading products...
                                        </>
                                    ) : (
                                        <>
                                            Load More Products
                                            <ChevronDown className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Elegant Empty State Container */
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-xl mx-auto shadow-sm animate-fade-in">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-slate-100">
                            <Layers className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Items Found</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
                            We couldn't find any products matching your current filters or search query.
                        </p>
                        <button
                            onClick={() => {
                                setInputValue('');
                                setParams(new URLSearchParams());
                            }}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Shop;
