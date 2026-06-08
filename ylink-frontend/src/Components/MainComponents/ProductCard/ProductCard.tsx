import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ShoppingBag } from 'lucide-react';
import { useCart } from '../Cart/useCart';
import type { ProductDetail } from '../../../data/product';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductCardProps {
    product?: ProductDetail | null;
    isLoading?: boolean;
}

const ProductCard = ({ product: product, isLoading }: ProductCardProps) => {
    const { cartItems, addToCart } = useCart();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';

    // Render structural alignment wireframe skeleton during load states
    if (isLoading || !product) {
        return <ProductCardSkeleton />;
    }

    const inCart = cartItems.find((item: any) => item.id === product.id);
    const isRetail = product.type === 'retail';

    const handleActionClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Defends card layout overlay route navigation links
        if (isRetail && !inCart) {
            addToCart(product);
        } else if (!isRetail) {
            // Context placeholder for custom quotation hooks if required later
            window.location.href = `/quote?id=${product.id}`;
        }
    };

    // Configuration map processing to keep core JSX template completely DRY
    const btnStyles = isRetail
        ? inCart
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
            : 'bg-blue-600 text-white hover:bg-slate-900 shadow-md shadow-slate-900/10 hover:shadow-slate-900/20'
        : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 shadow-sm';

    return (
        <div className="group relative bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden animate-fade-in-up">

            {/* Structural Route Overlay Link across total item scope */}
            <Link to={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={product.name} />

            {/* Media Canvas Block */}
            <div className="relative h-56 bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                    src={product.icon}
                    alt={product.name}
                    loading="lazy"
                    className="relative z-10 w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out"
                />
            </div>

            {/* Meta Frame */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3.5">
                    <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                        {product.category}
                    </span>
                </div>

                <h3 className="text-md font-bold text-slate-900 mb-1.5 leading-tight tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                    {product.name}
                </h3>

                <p className="text-slate-500 text-sm mb-4 flex-grow leading-relaxed line-clamp-2">
                    {product.shortDescription}
                </p>

                {/* Pricing / CTA Interaction Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                            {isRetail ? 'Price' : 'Starting At'}
                        </span>
                        <span className="text-lg font-black text-slate-900">
                            {currency}{product.price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleActionClick}
                        disabled={isRetail && !!inCart}
                        className={`relative z-20 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${btnStyles}`}
                    >
                        {isRetail ? (
                            inCart ? <CheckIcon size="18" className="stroke-[3]" /> : <ShoppingBag size="18" className="stroke-[3]" />
                        ) : (
                            'Get Quote'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;