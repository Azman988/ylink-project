import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    CheckIcon,
    ShoppingCartIcon,
    ChevronRight,
    Loader2,
    Minus,
    Plus,
    Star,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    ImageIcon,
} from 'lucide-react';
import ProductCard from '../../Components/MainComponents/ProductCard/ProductCard';
import { ShareLink } from '../../utils/ShareLink';
import { useCart } from '../../context/CartContext';
import { productApi, type ProductDetail, type ReviewPayload } from '../../api/productApi';
import { formatPriceWithCurrency } from '../../utils/money';

const ProductDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { isInCart, addToCart, increaseQuantity, decreaseQuantity, getCartItemQuantity } = useCart();

    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);

    // Review Submission State
    const [reviewRating, setReviewRating] = useState<number>(5);
    const [reviewComment, setReviewComment] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
    
    // Fetch Product and Related Items dynamically by Slug
    useEffect(() => {
        if (!slug) return;

        const fetchProductData = async () => {
            try {
                setIsLoading(true);
                const data = await productApi.getProductBySlug(slug);
                setProduct(data);
                setMainImage(data?.images?.[0]?.url || null);
                setActiveTab('description');

                // Dynamically fetch related products in the same category
                if (data?.category) {
                    const res = await productApi.getProducts({ category: data.category, limit: 6 });
                    const items = res.data || [];
                    setRelatedProducts(items.filter((p) => p._id !== data._id).slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to resolve dynamic product data:', error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    // Handle Review Submission
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !reviewComment.trim()) return;

        setIsSubmittingReview(true);
        setReviewError(null);
        setReviewSuccess(false);

        try {
            const payload: ReviewPayload = {
                rating: reviewRating,
                comment: reviewComment.trim(),
            };
            await productApi.addProductReview(product._id, payload);

            // Refresh product details to show updated reviews list and average rating
            const refreshedProduct = await productApi.getProductBySlug(slug!);
            setProduct(refreshedProduct);
            setReviewComment('');
            setReviewSuccess(true);
            setTimeout(() => setReviewSuccess(false), 4000);
        } catch (err: any) {
            console.error('Failed to submit product review:', err);
            setReviewError(
                err?.response?.data?.message || 'Failed to submit review. Please try again.'
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const inCart = product && isInCart(product?._id);
    const itemQtyInCart = product ? getCartItemQuantity(product._id) : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 pt-28 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <ProductDetailsSkeleton />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Product Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    The product you are looking for does not exist or has been removed.
                </p>
                <Link
                    to="/shop"
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md"
                >
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <Link to="/" className="hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <Link to="/shop" className="hover:text-blue-600 transition-colors">
                        Shop
                    </Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <Link
                        to={`/shop?category=${encodeURIComponent(product.category)}`}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {product.category}
                    </Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* Top Hero Showcase */}
                <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row mb-8">
                    {/* Left: Image Gallery */}
                    <div className="lg:w-1/2 bg-slate-50 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 p-4 sm:p-6 gap-4">
                        <div className="w-full aspect-square max-h-[460px] flex items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-100">
                            {mainImage || product.images?.[0]?.url ? (
                                <img
                                    src={mainImage || product.images?.[0]?.url || '/placeholder-product.webp'}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center transition-all duration-300"
                                />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-slate-300" />
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex items-center gap-3 w-full overflow-x-auto py-2 px-1 scrollbar-thin">
                                {product.images.map((imgSrc, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setMainImage(imgSrc.url)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${mainImage === imgSrc.url
                                            ? 'border-blue-600 ring-2 ring-blue-600/20'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <img
                                            src={imgSrc.url}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="relative lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold tracking-wider uppercase rounded-full">
                                    {product.category}
                                </span>
                                <ShareLink
                                    url={window.location.href}
                                    title={`Check out ${product.name}`}
                                    text={product.overview}
                                />
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
                                {product.name}
                            </h1>

                            {/* Rating Summary Header */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-0.5 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star
                                            key={idx}
                                            size={16}
                                            className={
                                                idx < Math.floor(product.rating || 0)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'fill-slate-200 text-slate-200'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-800">
                                    {(product.rating || 0).toFixed(1)}
                                </span>
                                <span className="text-slate-300">•</span>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                                >
                                    {product.numReviews ?? product.reviews?.length ?? 0} Customer Reviews
                                </button>
                            </div>

                            {/* Price Display */}
                            <div className="flex items-baseline gap-3 mb-6">
                                {product.dPrice && (
                                    <span className="font-semibold text-red-400 text-lg line-through">
                                        {formatPriceWithCurrency(product.price)}
                                    </span>
                                )}
                                <span className="font-black text-amber-500 text-3xl tracking-tight">
                                    {formatPriceWithCurrency(product.dPrice ? product.dPrice : product.price)}
                                </span>
                            </div>

                            <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                                {product.overview}
                            </p>

                            {/* Features List */}
                            {product.features && product.features.length > 0 && (
                                <div className="space-y-2.5 mb-8">
                                    {product.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions Block */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch gap-4">
                            {inCart ? (
                                <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 w-full sm:w-44 p-1">
                                    <button
                                        onClick={() => decreaseQuantity(product._id)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors font-bold cursor-pointer"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-black text-slate-900">
                                        {itemQtyInCart}
                                    </span>
                                    <button
                                        onClick={() => increaseQuantity(product._id)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors font-bold cursor-pointer"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : null}

                            <button
                                type="button"
                                onClick={() => {
                                    if (!inCart) addToCart(product._id, product);
                                }}
                                className={`flex-1 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${inCart
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                                    : 'bg-blue-600 text-white hover:bg-blue-600/80'
                                    }`}
                            >
                                {inCart ? (
                                    <>
                                        <CheckIcon className="w-5 h-5 stroke-[3]" /> Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabbed Navigation Section */}
                <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 lg:p-12">
                    <div className="flex border-b border-slate-100 mb-8 gap-8 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'description'
                                ? 'border-blue-600 text-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'specs'
                                ? 'border-blue-600 text-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Tech Specs
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${activeTab === 'reviews'
                                ? 'border-blue-600 text-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Customer Reviews ({product.reviews?.length || 0})
                        </button>
                    </div>

                    <div className="animate-fade-in">
                        {/* Tab 1: Description */}
                        {activeTab === 'description' && (
                            <div className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-4xl space-y-4">
                                {product.description ? (
                                    product.description.split('\n').map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p>{product.overview}</p>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Specs */}
                        {activeTab === 'specs' && (
                            <div className="max-w-4xl border border-slate-200/80 rounded-2xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {product.specifications?.map((spec, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors text-sm"
                                            >
                                                <td className="py-3.5 px-6 font-semibold text-slate-900 w-1/3 bg-slate-50/50">
                                                    {spec.label}
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-600">{spec.value}</td>
                                            </tr>
                                        ))}
                                        {(!product.specifications || product.specifications.length === 0) && (
                                            <tr>
                                                <td className="py-8 px-6 text-center text-slate-500 text-sm">
                                                    No specifications available for this product.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Tab 3: Dynamic Reviews & Submission Form */}
                        {activeTab === 'reviews' && (
                            <div className="max-w-4xl space-y-12">
                                {/* Review Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50/60 rounded-2xl border border-slate-100">
                                    <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/80 pb-4 md:pb-0">
                                        <span className="text-4xl font-black text-slate-900 mb-1">
                                            {(product.rating || 0).toFixed(1)}
                                        </span>
                                        <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <Star
                                                    key={idx}
                                                    size={16}
                                                    className={
                                                        idx < Math.floor(product.rating || 0)
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-slate-200 text-slate-200'
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">
                                            Based on {product.reviews?.length || 0} review(s)
                                        </span>
                                    </div>

                                    {/* Submission Form */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-600" /> Write a Review
                                        </h3>
                                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                                            {/* Interactive Rating Stars Input */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                                    Your Rating
                                                </label>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewRating(star)}
                                                            className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                                                        >
                                                            <Star
                                                                size={22}
                                                                className={
                                                                    star <= reviewRating
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'fill-slate-200 text-slate-200'
                                                                }
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className='mb-1.5'>
                                                <textarea
                                                    rows={3}
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder="Share your thoughts about this product..."
                                                    required
                                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition-colors"
                                                />
                                            </div>

                                            <div className='w-full flex flex-col items-end justify-end gap-3'>
                                                {reviewError && (
                                                    <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
                                                        <AlertCircle className="w-4 h-4" /> {reviewError}
                                                    </div>
                                                )}

                                                {reviewSuccess && (
                                                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                                                        <CheckCircle2 className="w-4 h-4" /> Review submitted successfully!
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingReview || !reviewComment.trim()}
                                                    className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                                >
                                                    {isSubmittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                                                    Submit Review
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Existing Reviews List */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Feedback</h3>
                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((rev, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-start gap-4"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-2">
                                                    {rev.name.charAt(0)}
                                                </div>
                                                <div className='flex-grow'>
                                                    <div className="w-full flex items-center justify-between mb-2">
                                                        <span className="font-bold text-slate-800 text-sm">{rev.name}</span>
                                                        <div className="flex items-center gap-0.5 text-amber-400">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={12}
                                                                    className={
                                                                        i < rev.rating
                                                                            ? 'fill-amber-400 text-amber-400'
                                                                            : 'fill-slate-200 text-slate-200'
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                                        {rev.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">
                                            No reviews yet. Be the first to review this product!
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="pt-8 border-t border-slate-200/80 mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Related Products</h2>
                            <Link
                                to={`/shop?category=${encodeURIComponent(product.category)}`}
                                className="text-xs font-bold text-blue-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                            >
                                View More <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related._id} product={related} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;

/* --- SKELETON LOADER FOR PRODUCT DETAILS --- */
function ProductDetailsSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Breadcrumbs */}
            <div className="flex gap-2 mb-8">
                <div className="w-16 h-4 bg-slate-200 rounded-md" />
                <div className="w-4 h-4 bg-slate-200 rounded-md" />
                <div className="w-20 h-4 bg-slate-200 rounded-md" />
            </div>

            {/* Hero Split */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row mb-8 min-h-[480px]">
                <div className="lg:w-1/2 bg-slate-100 flex items-center justify-center min-h-[380px]">
                    <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-4">
                    <div className="w-24 h-5 bg-slate-200 rounded-full" />
                    <div className="w-3/4 h-8 bg-slate-200 rounded-xl" />
                    <div className="w-1/3 h-6 bg-slate-200 rounded-lg" />
                    <div className="space-y-2 py-4">
                        <div className="w-full h-3.5 bg-slate-100 rounded-md" />
                        <div className="w-full h-3.5 bg-slate-100 rounded-md" />
                        <div className="w-2/3 h-3.5 bg-slate-100 rounded-md" />
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                        <div className="w-full h-12 bg-slate-200 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}