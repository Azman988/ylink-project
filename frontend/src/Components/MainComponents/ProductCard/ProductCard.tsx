import React from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Plus, ShoppingBag, Star } from 'lucide-react';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useCart } from '../../../context/CartContext';
import type { ProductDetail } from '../../../api/productApi';
import { formatPriceWithCurrency } from '../../../utils/money';

interface ProductCardProps {
  product?: ProductDetail | null;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoading }) => {
  const { isInCart, getCartItemQuantity, addToCart, increaseQuantity } = useCart();

  // Render structural alignment wireframe skeleton during load states
  if (isLoading || !product) {
    return <ProductCardSkeleton />;
  }

  const inCart = isInCart(product._id);
  const cartQuantity = getCartItemQuantity(product._id);

  const btnStyles = inCart
    ? 'bg-slate-100 text-blue-600 border border-blue-500/30 shadow-xs hover:bg-slate-200'
    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-md';

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-xl shadow-xs hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 flex flex-col overflow-hidden animate-fade-in-up">
      {/* Structural Route Overlay Link across total item scope */}
      <Link
        to={`/product/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={product.name}
      />

      {/* Media Canvas Block: Full Bleed Aspect-Ratio Image Container */}
      <div className="relative w-full flex items-center justify-center aspect-square bg-slate-100 border-b border-slate-100 overflow-hidden">
        {product.images && product.images.length > 0
          ? (<img
            src={product.images?.[0]?.url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/main.webp';
            }}
          />)
          : (
            <ImageIcon className="w-12 h-12 text-slate-300" />
          )}

        {/* Stock status badge overlay */}
        {product.stockQuantity <= 0 && (
          <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-xs">
            Out of Stock
          </span>
        )}
      </div>

      {/* Meta Frame */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow border-t border-slate-50">
        {/* Rating Stars Bar */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < Math.floor(product.rating || 0);
              return (
                <Star
                  key={index}
                  size={13}
                  className={
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }
                />
              );
            })}
          </div>
          <span className="text-xs font-semibold text-slate-700 ml-0.5">
            {(product.rating || 0).toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-400">
            ({product.numReviews ?? product.reviews?.length ?? 0})
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-1 leading-snug tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-slate-500 text-xs sm:text-sm mb-2.5 flex-grow leading-relaxed line-clamp-2">
          {product.overview}
        </p>

        {/* Pricing / CTA Interaction Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div className="flex flex-col">
            {product.dPrice ? (
              <span className="font-semibold text-red-400 text-xs line-through">
                {formatPriceWithCurrency(product.price)}
              </span>
            ) : null}

            <span className="font-bold text-amber-500 text-base sm:text-lg tracking-tight">
              {formatPriceWithCurrency(product.dPrice ? product.dPrice : product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={
              !inCart
                ? () => addToCart(product._id, product)
                : () => increaseQuantity(product._id)
            }
            className={`relative z-20 p-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center cursor-pointer ${btnStyles}`}
            aria-label={`Add ${product.name} to cart`}
          >
            {inCart && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartQuantity}
              </span>
            )}

            {inCart ? (
              <Plus size={18} className="stroke-[2.5]" />
            ) : (
              <ShoppingBag size={18} className="stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;