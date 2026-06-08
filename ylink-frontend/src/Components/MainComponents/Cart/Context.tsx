import { createContext } from "react"

interface  cartFunctions {
    handleCartClick: () => void,
    cartItems: any,
    addToCart: (product: any) => void,
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    removeFromCart: (id: string) => void,
    updateCartItem: (id: string, quantity: number) => void,
    clearCart: () => void,
    cartTotal: number,
    cartCount: number,
    cartOpen: boolean,
    setCartOpen: (open: boolean) => void,
    getCartItem: (id: string) => any,
    getCartItemQuantity: (id: string) => number;
}

export const CartContext = createContext<cartFunctions | undefined>(undefined)


