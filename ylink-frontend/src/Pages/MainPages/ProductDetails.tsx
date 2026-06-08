// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { type ProductDetail, mockProduct } from '../data/product';
// import { useCart } from '../Components/Cart/useCart';
// import { CheckIcon, Laptop, ShoppingCartIcon } from 'lucide-react';

// // --- Component ---
// const ProductDetails: React.FC = () => {
//     const { id } = useParams();
//     // Access Cart function from Cart context
//     const { handleCartClick, cartItems, addToCart, increaseQuantity, decreaseQuantity, getCartItemQuantity, cartCount, setCartOpen } = useCart()
//     const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
//     const [product, setProduct] = useState<ProductDetail | null>(null);

//     // Fetch dynamic database context if only an ID is passed down
//     const [productsData, setProductsData] = useState<ProductDetail[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     useEffect(() => {

//         const fetchProductData = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await fetch(`/api/products/data`);
//                 if (!response.ok) throw new Error('Network error');
//                 const data = await response.json();
//                 setProductsData(data);
//             } catch (error) {
//                 console.error('Failed to resolve runtime product parameters:', error);
//                 setProductsData(mockProduct)
//             } finally {
//                 setTimeout(() => setIsLoading(false), 1500);
//             }
//         };

//         fetchProductData();
//     }, []);

//     // Fetch product details based on ID from URL params from the backend
//     const fetchProduct = async () => {
//         const match = productsData.find(p => p.id === id);
//         setProduct(match || null);
//     }
//     useEffect(() => {
//         fetchProduct();
//     }, [])

//     if (!product) {
//         return <div className="p-8 text-center">Loading product details...</div>;
//     }

//     // Access Currency symbol from .env or default to ₦
//     const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';
//     const handleAddToCartorQoute = (product: ProductDetail) => {
//         if (product.type === 'retail') {
//             addToCart(product)
//         }
//     };

//     const inCart = cartItems.find((item: { id: any; }): any => item.id === product.id)

//     const closeUserMenu = () => {
//         setCartOpen(false)
//         scrollTo({ top: 0, behavior: 'smooth' })
//     }

//     return (
//         <>
//             <header
//                 className="bg-white shadow-sm py-4 px-6 fixed w-full top-0 z-50">
//                 <div
//                     className="max-w-7xl mx-auto h-[50px] flex items-center justify-between gap-4">
//                     {/* LOGO iCON */}
//                     <Link to='/' onClick={() => closeUserMenu()} className="flex items-end gap-1 cursor-pointer group">
//                         <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
//                             <Laptop className="w-5 h-5 text-white" />
//                         </div>
//                         <div className="text-2xl font-black text-blue-900 tracking-tighter xl:mr-20 lg:mr-14 md:mr-12 mr-8 border-b-5 border-red-400">
//                             YLink<span className="text-blue-500">Tech</span>
//                         </div>
//                     </Link>

//                     {/* Cart btn */}
//                     <button
//                         className='relative p-2 rounded-full cursor-pointer hover:shadow transition-all duration-300'
//                         onClick={handleCartClick}
//                     >
//                         <span className='absolute -top-1 left-6 text-sm text-red-400 font-black'>
//                             {cartCount > 9 ? '9+' : cartCount}
//                         </span>
//                         <ShoppingCartIcon className='size-6.5' />
//                     </button>
//                 </div>
//             </header>

//             <div className="min-h-screen bg-gray-50 text-gray-800 font-sans py-24">
//                 <div className="max-w-7xl mx-auto px-6">

//                     {/* Breadcrumb Navigation */}
//                     <nav className="flex items-center gap-2 text-sm text-gray-500 mt-3 mb-6">
//                         <Link to="/" className="hover:text-blue-600">Home</Link>

//                         <span>/</span>

//                         <Link to="/shop" className="hover:text-blue-600">
//                             Shop
//                         </Link>

//                         <span>/</span>

//                         <Link to={`/shop?category=${product.category}`} className="hover:text-blue-600">
//                             {product.category}
//                         </Link>

//                         <span>/</span>

//                         <span className="text-gray-900 font-medium line-clamp-1 active">{product.name}</span>
//                     </nav>

//                     {/* Top Section: Image and Essential Details */}
//                     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-12">

//                         {/* Left: Product "Image" Gallery */}
//                         <div className="md:w-1/2 bg-slate-100 flex items-center justify-center min-h-[400px] p-12 border-r border-gray-100">
//                             <div className="text-[150px] drop-shadow-xl hover:scale-105 transition-transform duration-300">
//                                 <img src={product.icon} alt={product.name} className='object-fit w-full h-full rounded-xl' />
//                             </div>
//                         </div>

//                         {/* Right: Product Info & Actions */}
//                         <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
//                             <div className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">
//                                 {product.category}
//                             </div>
//                             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
//                                 {product.name}
//                             </h1>

//                             <div className="flex items-center mb-6">
//                                 <span className="text-3xl font-black text-gray-900 mr-4">
//                                     {product.type === 'retail' ? `${currency}${product.price.toLocaleString()}` : `From ${currency}${product.price.toLocaleString()}`}
//                                 </span>
//                                 {product.inStock ? (
//                                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">In Stock</span>
//                                 ) : (
//                                     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Out of Stock</span>
//                                 )}
//                             </div>

//                             <p className="text-gray-600 text-lg mb-8 leading-relaxed">
//                                 {product.shortDescription}
//                             </p>

//                             <ul className="space-y-3 mb-10">
//                                 {product.features?.map((feature, idx: React.Key | null | undefined) => (
//                                     <li key={idx} className="flex items-start text-gray-700">
//                                         <span className="text-blue-500 mr-3 mt-1">✦</span>
//                                         {feature}
//                                     </li>
//                                 ))}
//                             </ul>

//                             <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-auto">
//                                 {/* Quantity Selector (Only show for retail items) */}
//                                 {product.type === 'retail' && (
//                                     <div className="flex items-center border border-gray-300 rounded-xl bg-white w-40">
//                                         <button onClick={() => decreaseQuantity(product.id)} className="px-4 py-3 text-gray-600 hover:text-blue-600 font-bold cursor-pointer">-</button>
//                                         <span className="flex-1 text-center font-bold">{getCartItemQuantity(product.id)}</span>
//                                         <button onClick={() => increaseQuantity(product.id)} className="px-4 py-3 text-gray-600 hover:text-blue-600 font-bold cursor-pointer">+</button>
//                                     </div>
//                                 )}

//                                 {/* Primary CTA */}
//                                 <button
//                                     onClick={() => handleAddToCartorQoute(product)}
//                                     className={`flex-1 px-6 py-3 rounded-xl font-bold text-lg w-full transition-all duration-300 shadow-lg cursor-pointer ${product.type === 'retail' ?
//                                         inCart ? 'bg-green-100 text-green-700 flex items-center justify-center'
//                                             : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
//                                         : 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-500/30'
//                                         }`
//                                     }
//                                 >
//                                     {product.type === 'retail' ?
//                                         inCart ?
//                                             <span className="flex items-center gap-1 font-medium">
//                                                 <CheckIcon />
//                                                 Added
//                                             </span>
//                                             : 'Add to Cart'
//                                         : 'Request a Quote / solar-consultation'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bottom Section: Tabs for Deep Dive Info */}
//                     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
//                         {/* Tab Headers */}
//                         <div className="flex border-b border-gray-200 mb-8 gap-8">
//                             <button
//                                 onClick={() => setActiveTab('description')}
//                                 className={`pb-4 font-bold text-lg transition-colors border-b-2 cursor-pointer ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
//                                     }`}
//                             >
//                                 Full Description
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('specs')}
//                                 className={`pb-4 font-bold text-lg transition-colors border-b-2 cursor-pointer ${activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
//                                     }`}
//                             >
//                                 Technical Specifications
//                             </button>
//                         </div>

//                         {/* Tab Content */}
//                         <div className="min-h-[200px]">
//                             {activeTab === 'description' && (
//                                 <div className="text-gray-600 leading-relaxed text-lg max-w-4xl">
//                                     {product.fullDescription}
//                                 </div>
//                             )}

//                             {activeTab === 'specs' && (
//                                 <div className="max-w-4xl">
//                                     <table className="w-full text-left border-collapse">
//                                         <tbody>
//                                             {product.specifications?.map((spec, idx) => (
//                                                 <tr key={idx} className="border-b border-gray-100 last:border-0">
//                                                     <td className="py-4 pr-6 font-semibold text-gray-900 w-1/3">{spec.label}</td>
//                                                     <td className="py-4 text-gray-600">{spec.value}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div>

//             </div>
//         </>
//     );
// };

// export default ProductDetails;

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckIcon, Laptop, ShoppingCartIcon, ChevronRight, Loader2 } from 'lucide-react';
import { type ProductDetail, mockProduct } from '../../data/product';
import { useCart } from '../../Components/MainComponents/Cart/useCart';
import ProductCard from '../../Components/MainComponents/ProductCard/ProductCard';

// --- Component ---
const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {
        handleCartClick, cartItems, addToCart, increaseQuantity,
        decreaseQuantity, getCartItemQuantity, cartCount, setCartOpen
    } = useCart();

    const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
    const [productsData, setProductsData] = useState<ProductDetail[]>([]);
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';

    // Fetch Global Products Data
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
                setProductsData(mockProduct); // Fallback
            } finally {
                setTimeout(() => setIsLoading(false), 1500);
            }
        };

        fetchProductData();
    }, []);

    // Resolve Current Product from ID once data is loaded
    useEffect(() => {
        if (productsData.length > 0 && id) {
            const match = productsData.find(p => p.id === id);
            setProduct(match || null);
            // Reset tab and scroll to top on product change
            setActiveTab('description');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [id, productsData]);

    // Compute Related Products
    const relatedProducts = useMemo(() => {
        if (!product || !productsData.length) return [];
        return productsData
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4); // Show up to 4 related products
    }, [product, productsData]);

    // --- Handlers & Computed States ---
    const inCart = product ? cartItems.find((item: any) => item.id === product.id) : false;
    const isRetail = product?.type === 'retail';

    const handleAddToCartorQuote = (prod: ProductDetail) => {
        if (prod.type === 'retail' && !inCart) {
            addToCart(prod);
        } else if (prod.type !== 'retail') {
            window.location.href = `/quote?id=${prod.id}`;
        }
    };

    const closeUserMenu = () => {
        setCartOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Renders ---
    // Header remains static across loading states
    const renderHeader = () => (
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-4 px-6 fixed w-full top-0 z-50 transition-all">
            <div className="max-w-7xl mx-auto h-[50px] flex items-center justify-between gap-4">
                <Link to='/' onClick={closeUserMenu} className="flex items-end gap-1 cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
                        <Laptop className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter xl:mr-20 lg:mr-14 md:mr-12 mr-8">
                        YLink<span className="text-blue-600">Tech</span>
                    </div>
                </Link>

                <button
                    className='relative p-2.5 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all duration-300 cursor-pointer shadow-sm'
                    onClick={handleCartClick}
                >
                    {cartCount > 0 && (
                        <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white'>
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                    <ShoppingCartIcon className='w-5 h-5 stroke-[2.5]' />
                </button>
            </div>
        </header>
    );

    if (isLoading) {
        return (
            <>
                {renderHeader()}
                <div className="min-h-screen bg-slate-50 pt-28 pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6"><ProductDetailsSkeleton /></div>
                </div>
            </>
        );
    }

    if (!product && !isLoading) {
        return (
            <>
                {renderHeader()}
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Product Not Found</h2>
                    <p className="text-slate-500 mb-8 max-w-md">The product you are looking for does not exist or has been removed.</p>
                    <Link to="/shop" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">Return to Shop</Link>
                </div>
            </>
        );
    }

    return (
        <>
            {renderHeader()}

            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Breadcrumb Navigation */}
                    <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to={`/shop?category=${product!.category}`} className="hover:text-blue-600 transition-colors">
                            {product!.category}
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900 line-clamp-1">{product!.name}</span>
                    </nav>

                    {/* Top Section: Hero Split */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row mb-8">

                        {/* Left: Image Gallery */}
                        <div className="lg:w-1/2 bg-slate-50 flex items-center justify-center min-h-[400px] p-12 border-b lg:border-b-0 lg:border-r border-slate-200 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src={product!.icon}
                                alt={product!.name}
                                className='relative z-10 object-contain w-full max-w-md h-auto drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out'
                            />
                        </div>

                        {/* Right: Info & Actions */}
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                                    {product!.category}
                                </span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
                                {product!.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-black text-slate-900">
                                    {isRetail ? '' : <span className="text-lg text-slate-500 font-bold mr-1">From</span>}
                                    {currency}{product!.price.toLocaleString()}
                                </span>
                                {product!.inStock ? (
                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide">In Stock</span>
                                ) : (
                                    <span className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide">Out of Stock</span>
                                )}
                            </div>

                            <p className="text-slate-500 text-base mb-8 leading-relaxed">
                                {product!.shortDescription}
                            </p>

                            <div className="space-y-3 mb-10">
                                {product!.features?.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <CheckIcon className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Action Area */}
                            <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-auto pt-6 border-t border-slate-100">
                                {isRetail && (
                                    <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 w-full sm:w-40 p-1">
                                        <button onClick={() => decreaseQuantity(product!.id)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors font-black text-lg">-</button>
                                        <span className="flex-1 text-center font-black text-slate-900">{getCartItemQuantity(product!.id) || 1}</span>
                                        <button onClick={() => increaseQuantity(product!.id)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors font-black text-lg">+</button>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleAddToCartorQuote(product!)}
                                    disabled={isRetail && !!inCart}
                                    className={`flex-1 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md
                                        ${isRetail
                                            ? inCart
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                                                : 'bg-blue-600 text-white hover:bg-slate-900 shadow-md hover:shadow-xl'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-500 hover:text-slate-900 shadow-sm'
                                        }`}
                                >
                                    {isRetail ? (
                                        inCart ? <><CheckIcon className="w-5 h-5 stroke-[3]" /> Added to Cart</> : <><ShoppingCartIcon className="w-5 h-5" /> Add to Cart</>
                                    ) : (
                                        'Request Consultation / Quote'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 lg:p-12 mb-16">
                        <div className="flex border-b border-slate-100 mb-8 gap-8 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-4 font-black text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap
                                    ${activeTab === 'description' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`pb-4 font-black text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap
                                    ${activeTab === 'specs' ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                            >
                                Tech Specs
                            </button>
                        </div>

                        <div className="min-h-[200px] animate-fade-in">
                            {activeTab === 'description' && (
                                <div className="text-slate-600 leading-relaxed text-base max-w-4xl space-y-4">
                                    {product!.fullDescription.split('\n').map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="max-w-4xl border border-slate-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <tbody>
                                            {product!.specifications?.map((spec, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-6 font-bold text-slate-900 w-1/3 bg-slate-50/50">{spec.label}</td>
                                                    <td className="py-4 px-6 text-slate-600">{spec.value}</td>
                                                </tr>
                                            ))}
                                            {(!product!.specifications || product!.specifications.length === 0) && (
                                                <tr><td className="py-8 px-6 text-center text-slate-500">No specifications available.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <section className="pt-8 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">You Might Also Like</h2>
                                <Link to={`/shop?category=${product!.category}`} className="text-sm font-bold text-blue-600 hover:text-slate-900 flex items-center gap-1 transition-colors">
                                    View More <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map(related => (
                                    <ProductCard key={related.id} product={related} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetails;


// --- SKELETON LOADER FOR PRODUCT DETAILS --- //
function ProductDetailsSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Breadcrumbs */}
            <div className="flex gap-2 mb-8">
                <div className="w-16 h-4 bg-slate-200 rounded-md"></div>
                <div className="w-4 h-4 bg-slate-200 rounded-md"></div>
                <div className="w-20 h-4 bg-slate-200 rounded-md"></div>
                <div className="w-4 h-4 bg-slate-200 rounded-md"></div>
                <div className="w-32 h-4 bg-slate-200 rounded-md"></div>
            </div>

            {/* Hero Split */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row mb-8 min-h-[500px]">
                <div className="lg:w-1/2 bg-slate-100 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="w-24 h-6 bg-slate-200 rounded-full mb-4"></div>
                    <div className="w-3/4 h-10 bg-slate-200 rounded-xl mb-6"></div>
                    <div className="w-1/3 h-8 bg-slate-200 rounded-xl mb-8"></div>

                    <div className="space-y-3 mb-10">
                        <div className="w-full h-4 bg-slate-100 rounded-md"></div>
                        <div className="w-full h-4 bg-slate-100 rounded-md"></div>
                        <div className="w-2/3 h-4 bg-slate-100 rounded-md"></div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="w-1/2 h-5 bg-slate-200 rounded-md"></div>
                        <div className="w-2/3 h-5 bg-slate-200 rounded-md"></div>
                        <div className="w-1/2 h-5 bg-slate-200 rounded-md"></div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex gap-4">
                        <div className="w-32 h-14 bg-slate-200 rounded-2xl"></div>
                        <div className="flex-1 h-14 bg-slate-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12">
                <div className="flex gap-8 border-b border-slate-100 mb-8 pb-4">
                    <div className="w-24 h-6 bg-slate-200 rounded-md"></div>
                    <div className="w-32 h-6 bg-slate-100 rounded-md"></div>
                </div>
                <div className="space-y-4">
                    <div className="w-full h-4 bg-slate-100 rounded-md"></div>
                    <div className="w-full h-4 bg-slate-100 rounded-md"></div>
                    <div className="w-4/5 h-4 bg-slate-100 rounded-md"></div>
                </div>
            </div>
        </div>
    );
}