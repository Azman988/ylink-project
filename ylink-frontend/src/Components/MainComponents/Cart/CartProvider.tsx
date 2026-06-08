import { useState } from "react"
import { CartContext } from "./Context.tsx"
import { useNavigate } from "react-router-dom"
import type { CartItem, ProductDetail } from "../../../data/product.tsx"

export function CartProvider({ children }: { children: React.ReactNode }) {
    // Initialize cart items from localStorage or as an empty array
    const [cartItems, setCartItems] = useState<CartItem[]>( () => {
        try {
            const storedCart = localStorage.getItem('cartItems')
            return storedCart ? (JSON.parse(storedCart) as CartItem[]) : []
        } catch {
            return []
        }
    })
    const navigate = useNavigate()

    // Handle cart button click: navigate to shop and open cart
    const handleCartClick = () => {
        navigate('/shop')
        setCartOpen(true)
        scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Add item to cart or update quantity if it already exists
    const addToCart = (product: ProductDetail) => {
        const existingItem = cartItems.find((item: CartItem) => item.id === product.id)
        let updatedCart: CartItem[]

        if (existingItem) {
            updatedCart = cartItems.map((item: CartItem) =>
                item.id === product.id ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            )
        } else {
            updatedCart = [...cartItems, { ...product as ProductDetail, quantity: 1 }]
        }

        setCartItems(updatedCart)
        localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    }

    // Get item quantity in cart
    const getCartItemQuantity = (id: string) => {
        const item = cartItems.find((item: CartItem) => item.id === id)
        return item ? item.quantity : 0
    }

    // Remove item from cart
    const removeFromCart = (id: string) => {
        const updatedCart = cartItems.filter((item: CartItem) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }

    // Update item quantity in cart
    const updateCartItem = (id: string, quantity: number) => {
        const updatedCart = cartItems.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
        )
        setCartItems(updatedCart)
        localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    }

    // Get cart item by ID
    const getCartItem = (id: string): CartItem | undefined => {
        return cartItems.find((item: CartItem) => item.id === id)
    }

    // Increase item quantity in cart
    const increaseQuantity = (id: string) => {
        const current = getCartItem(id)?.quantity ?? 0;
        updateCartItem(id, current + 1)
    }

    // Decrease item quantity in cart
    const decreaseQuantity = (id: string) => {
        const current = getCartItem(id)?.quantity ?? 1;
        updateCartItem(id, Math.max(1, current - 1))
    }

    // Clear all items from cart
    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem('cartItems')
    }

    // Calculate total price and item count in cart
    const cartTotal = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)

    // Calculate total item count in cart
    const cartCount = cartItems.reduce((count: number, item: CartItem) => count + item.quantity, 0)

    // State to manage cart visibility
    const [cartOpen, setCartOpen] = useState<boolean>(false)

    // Provide cart state and functions to the context
    return <CartContext.Provider value={{ handleCartClick, cartItems, addToCart, removeFromCart, updateCartItem, clearCart, cartTotal, cartCount, cartOpen, setCartOpen, increaseQuantity, decreaseQuantity, getCartItemQuantity, getCartItem }}>
        {children}
    </CartContext.Provider>
}