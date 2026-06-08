import { ArrowRightIcon, Trash2Icon, XIcon, ShoppingBag } from "lucide-react";
import { useCart } from "./useCart.tsx"
import { Link, useNavigate } from "react-router-dom"
import type { CartItem } from '../../../data/product.tsx'

export function Cart({ mobile }: any) {
    const { cartItems, removeFromCart, decreaseQuantity, getCartItemQuantity, increaseQuantity, clearCart, cartTotal, cartOpen, setCartOpen } = useCart();

    const handleShopFromCart = () => {
        setCartOpen(false)
        scrollTo({ top: 210, behavior: 'smooth' })
    }

    const handleClearCart = () => {
        clearCart()
        setCartOpen(false)
    }

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '₦'

    const navigate = useNavigate();
    const handleCheckOut = () => {
        navigate('/checkout');
        setCartOpen(false);
        scrollTo({ top: 0, behavior: 'smooth' });
    }

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
                className={`fixed bottom-0 right-0 z-[80] transition-transform duration-500 ease-out bg-white flex flex-col shadow-2xl overflow-hidden
                ${cartOpen ?
                    mobile ? 'translate-y-0 left-0 rounded-t-3xl max-h-screen' : 
                    'top-0 translate-x-0 h-full w-[450px]' : 
                    mobile ? 'translate-y-full left-0 rounded-t-3xl' :
                    'translate-x-full top-0 h-full w-[450px]'} 
                ${mobile ? 'sm:hidden' : 'hidden sm:flex'}`}
            >
                {/* --- Header --- */}
                <div className="shrink-0 px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center border border-slate-100">
                            <ShoppingBag size="20" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                                Your Cart
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setCartOpen(false)} 
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <XIcon className="size-5" />
                    </button>
                </div>

                {/* --- Content Area --- */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/50 p-6">
                    {cartItems.length > 0 ? (
                        <div className="flex flex-col space-y-4">
                            {cartItems.map((item: CartItem) => (
                                <div 
                                    key={item.id} 
                                    className="group relative flex items-stretch bg-white h-[140px] border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* Overlay Link - Sits strictly under the buttons */}
                                    <Link to={`/product/${item.id}`} className="absolute inset-0 z-10" />

                                    {/* Item Image */}
                                    <div className="min-w-[120px] max-w-[120px] bg-slate-50 p-3 border-r border-slate-100 flex items-center justify-center">
                                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    </div>

                                    {/* Item Details */}
                                    <div className="p-4 w-full flex flex-col justify-between">
                                        
                                        <div>
                                            <h6 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 pr-6 group-hover:text-blue-600 transition-colors">
                                                {item.shortDescription}
                                            </h6>
                                            <p className="font-extrabold text-blue-600 mt-1 text-sm">
                                                {currency}{item.price.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Actions Row */}
                                        <div className="flex items-center justify-between w-full mt-2">
                                            {/* Quantity Control */}
                                            <div className="relative z-20 flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); decreaseQuantity(item.id); }} 
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all cursor-pointer font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-slate-900">
                                                    {getCartItemQuantity(item.id)}
                                                </span>
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); increaseQuantity(item.id); }} 
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all cursor-pointer font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={(e) => { e.preventDefault(); removeFromCart(item.id); }} 
                                                className="relative z-20 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                                Looks like you haven't added any tech upgrades to your cart yet.
                            </p>
                            <button
                                onClick={handleShopFromCart}
                                className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-600 transition-colors duration-300 cursor-pointer shadow-md shadow-slate-900/10"
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}
                </div>

                {/* --- Footer --- */}
                {cartItems.length > 0 && (
                    <div className="shrink-0 bg-white border-t border-slate-100 px-6 py-4 z-30 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
                        
                        <div className="flex items-end justify-between mb-5">
                            <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm">
                                Subtotal
                            </p>
                            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {currency}{cartTotal.toLocaleString()}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleCheckOut} 
                                className="w-full bg-blue-600 hover:bg-slate-900 text-white font-bold text-base py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20"
                            >
                                Proceed to Checkout 
                                <ArrowRightIcon size="18" />
                            </button>
                            
                            <button 
                                onClick={handleClearCart}
                                className="w-full py-3 text-slate-500 hover:text-white font-bold text-sm rounded-xl transition-colors cursor-pointer outline-none bg-red-50 hover:bg-red-500 shadow-sm"
                            >
                                Clear Cart
                            </button>
                        </div>
                        
                    </div>
                )}
            </div>
        </>
    )
}