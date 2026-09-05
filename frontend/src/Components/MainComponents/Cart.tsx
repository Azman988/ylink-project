import { ArrowRightIcon, Trash2Icon, XIcon, ShoppingBag, Minus, Plus, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { useCart, type CartItem } from "../../context/CartContext.tsx";
import { formatPriceWithCurrency } from "../../utils/money.ts";

export function Cart({ mobile }: any) {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, decreaseQuantity, getCartItemQuantity, increaseQuantity, clearCart, cartTotal, cartOpen, setCartOpen } = useCart();
    
    return (
        <>
            {/* Backdrop Blur Overlay */}
            {cartOpen && (
                <div
                    onClick={() => setCartOpen(false)}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 animate-fade-in"
                />
            )}

            {/* Cart Drawer / Bottom Sheet */}
            <div
                className={`fixed bottom-0 right-0 z-[80] transition-transform duration-500 ease-out bg-white flex flex-col shadow-2xl
                ${cartOpen ?
                        mobile
                            ? 'translate-y-0 left-0 rounded-t-3xl max-h-screen'
                            : 'top-0 translate-x-0 h-full w-[450px]' :
                        mobile
                            ? 'translate-y-full left-0 rounded-t-3xl'
                            : 'translate-x-full top-0 h-full w-[450px]'} 
                ${mobile
                        ? 'sm:hidden'
                        : 'hidden sm:flex'}`}
            >
                {/* --- Header --- */}
                <div className="relative shrink-0 px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-30">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center border border-slate-100">
                            <ShoppingBag size="20" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-bold text-md tracking-wide text-slate-900 leading-none">
                                SHOPPING CART
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wider">
                                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setCartOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-100 transition-colors duration-300 cursor-pointer"
                    >
                        <XIcon className="size-5" />
                    </button>

                    {/* Note for quick checkout */}
                    {cartItems.length > 0 && (
                        <div className="absolute -bottom-10 left-0 right-0 z-20 w-full text-center font-semibold p-3 bg-yellow-50 border border-yellow-200 text-sm text-slate-600 text-nowrap overflow-x-scroll scrollbar-none">
                            <p className="text-sm animate-infinite-scroll">
                                Unpurchased items in your cart will be automatically removed after 7 days you add them!
                            </p>
                        </div>
                    )}
                </div>

                {/* --- Content Area --- */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/50 p-6 relative">
                    {cartItems.length > 0 ? (
                        <div className="flex flex-col space-y-4 mt-8">
                            {cartItems.map((item: CartItem) => (
                                <div
                                    key={item.product._id}
                                    className="group relative flex items-stretch bg-white border border-slate-200 rounded-2xl hover:shadow-xs transition-shadow duration-300 overflow-hidden"
                                >
                                    {/* Overlay Link - Sits strictly under the buttons */}
                                    <div onClick={() => {
                                        navigate(`/product/${item.product.slug}`);
                                        setCartOpen(false);
                                        scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                        className="absolute inset-0 z-10"
                                    />

                                    {/* Item Image */}
                                    <div className="min-w-[130px] max-w-[130px] h-[140px] bg-slate-50 p-0.5 border-r border-slate-100 flex items-center justify-center ">
                                        {item.product.images && item.product.images.length > 0
                                            ? <img
                                                src={item.product.images[0]?.url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/main.webp';
                                                }}
                                            />
                                            : (
                                                <ImageIcon className="w-12 h-12 text-slate-300" />
                                            )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="p-3 w-full flex flex-col justify-between">

                                        <div>
                                            <h6 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 pr-6 group-hover:text-blue-600 transition-colors">
                                                {item.product.overview}
                                            </h6>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex gap-1 items-baseline">
                                                    {item.product.dPrice && (
                                                        <p className="font-semibold text-xs text-rose-500 line-through">
                                                            {formatPriceWithCurrency(item.product.price)}
                                                        </p>
                                                    )}

                                                    <p className="font-bold text-emerald-600 text-sm">
                                                        {formatPriceWithCurrency(item.product.dPrice ? item.product.dPrice : item.product.price)}
                                                    </p>
                                                </div>

                                                {item.product.isActive ? (
                                                    <span className="text-emerald-600 text-xs font-medium animate-pulse">In Stock🔥</span>
                                                ) : (
                                                    <span className="text-rose-800 text-xs font-medium animate-pulse">Out of Stock</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions Row */}
                                        <div className="flex items-center justify-between w-full mt-3">
                                            {/* Quantity Control */}
                                            <div className="relative z-20 flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        decreaseQuantity(item.product._id);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all cursor-pointer font-bold"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-slate-900">
                                                    {getCartItemQuantity(item.product._id)}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        increaseQuantity(item.product._id);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all cursor-pointer font-bold"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromCart(item.product._id);
                                                }}
                                                className="relative z-20 p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-100 transition-colors duration-300 rounded-lg cursor-pointer"
                                                title="Remove Item"
                                            >
                                                <Trash2Icon className="size-5" />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 -mt-10">
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mb-5 text-slate-300">
                                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                            </div>
                            <h6 className="text-xl font-extrabold text-slate-900 mb-2">
                                Your cart is empty
                            </h6>
                            <p className="text-slate-500 text-sm max-w-[250px] mb-8 leading-relaxed">
                                Looks like you haven't added any item to your cart yet.
                            </p>
                            <button
                                onClick={() => {
                                    navigate('/shop')
                                    setCartOpen(false)
                                    scrollTo({ top: 250, behavior: 'smooth' })
                                }}
                                className="bg-blue-600 text-slate-100 hover:shadow-blue-600/20 hover:bg-blue-600/80 font-bold py-3 px-8 rounded-2xl transition-colors duration-300 cursor-pointer shadow-md shadow-slate-900/10"
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}
                </div>

                {/* --- Footer --- */}
                {cartItems.length > 0 && (
                    <div className="shrink-0 bg-white border-t border-slate-100 px-6 py-3 z-30 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">

                        <div className="flex items-end justify-between mb-5">
                            <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm">
                                Total Est.:
                            </p>
                            <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {formatPriceWithCurrency(cartTotal)}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    navigate('/checkout');
                                    setCartOpen(false);
                                    scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full font-semibold text-base py-2 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm shadow-slate-900/10 bg-blue-600 text-slate-100 hover:shadow-blue-600/20 hover:bg-blue-600/80"
                            >
                                Proceed to Checkout
                                <ArrowRightIcon size="18" />
                            </button>

                            <button
                                onClick={() => {
                                    clearCart()
                                    setCartOpen(false)
                                }}
                                className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-100 transition-colors duration-300 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer outline-none shadow-sm"
                            >
                                <Trash2Icon className="size-4" /> Clear Cart
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </>
    )
}