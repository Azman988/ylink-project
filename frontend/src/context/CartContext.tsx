import { createContext, useState, useEffect, useCallback, type ReactNode, useContext } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import type { ProductDetail } from '../api/productApi';
import { useToast } from './ToastContext';

export interface CartItem {
    _id: string;
    product: ProductDetail;
    quantity: number;
    addedAt?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    setCartItems: (items: CartItem[]) => void;
    addToCart: (productId: string, productData?: ProductDetail) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateCartItem: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    cartCount: number;
    cartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    getCartItemQuantity: (productId: string) => number;
    getCartItem: (productId: string) => CartItem | undefined;
    isInCart: (productId: string) => boolean;
    fetchCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

const GUEST_CART_KEY = 'guest_cart_items';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Utility to extract stored guest items and discard expired ones
const getValidGuestItems = (): CartItem[] => {
    try {
        const stored = localStorage.getItem(GUEST_CART_KEY);
        if (!stored) return [];

        const parsed: CartItem[] = JSON.parse(stored);
        const now = Date.now();

        const validItems = parsed.filter((item) => {
            const addedAtTime = new Date(item.addedAt || now).getTime();
            return (now - addedAtTime) < SEVEN_DAYS_MS;
        });

        if (validItems.length !== parsed.length) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(validItems));
        }

        return validItems;
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState<boolean>(false);
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const getProductId = (item: CartItem): string => {
        if (!item?.product) return '';
        return typeof item.product === 'object' ? item.product._id : (item.product as string);
    };

    // Fetch or Merge Cart based on authentication
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems(getValidGuestItems());
            return;
        }

        try {
            const localGuestItems = getValidGuestItems();

            // If guest items exist upon login, merge them into DB
            if (localGuestItems.length > 0) {
                // Remove local storage IMMEDIATELY to block concurrent duplicate requests
                localStorage.removeItem(GUEST_CART_KEY);

                const payload = localGuestItems
                    .map(item => ({
                        productId: getProductId(item),
                        quantity: item.quantity,
                        addedAt: item.addedAt
                    }))
                    .filter(item => Boolean(item.productId));

                if (payload.length > 0) {
                    try {
                        const mergeResponse = await API.post('/cart/merge', { guestItems: payload });
                        const items = mergeResponse.data?.data?.items || mergeResponse.data?.items || [];
                        setCartItems(Array.isArray(items) ? items : []);
                        return;
                    } catch (mergeError) {
                        console.error('Failed to merge guest cart:', mergeError);
                    }
                }
            }

            // Normal user fetch
            const response = await API.get('/cart');
            const items = response.data?.data?.items || response.data?.items || [];
            setCartItems(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setCartItems([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add to Cart (Handles both Guest & Logged-in flows)
    const addToCart = async (productId: string, productData?: ProductDetail) => {
        showToast('Adding Item to Cart...');
        const previousCartItems = [...cartItems];

        if (!isAuthenticated) {
            const currentGuestItems = getValidGuestItems();
            const existingIndex = currentGuestItems.findIndex(i => getProductId(i) === productId);
            let updatedGuestItems: CartItem[] = [];

            if (existingIndex > -1) {
                updatedGuestItems = currentGuestItems.map((item, idx) =>
                    idx === existingIndex
                        ? { ...item, quantity: item.quantity + 1, addedAt: new Date().toISOString() }
                        : item
                );
            } else {
                const newItem: CartItem = {
                    _id: `guest-${Date.now()}`,
                    product: productData || {
                        _id: productId,
                        name: 'Item',
                        slug: '',
                        overview: '',
                        description: '',
                        dPrice: '',
                        price: 0,
                        category: '',
                        stockQuantity: 99,
                        images: [],
                        features: [],
                        specifications: [],
                        isActive: true,
                        reviews: [],
                        rating: 0,
                        numReviews: 0
                    },
                    quantity: 1,
                    addedAt: new Date().toISOString()
                };
                updatedGuestItems = [...currentGuestItems, newItem];
            }

            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedGuestItems));
            setCartItems(updatedGuestItems);
            showToast('Item added to guest cart', 'success');
            return;
        }

        // Authenticated flow (Optimistic update)
        setCartItems((prev) => {
            const index = prev.findIndex((item) => getProductId(item) === productId);
            if (index > -1) {
                const copy = [...prev];
                copy[index] = { ...copy[index], quantity: copy[index].quantity + 1, addedAt: new Date().toISOString() };
                return copy;
            }
            const newItem: CartItem = {
                _id: `temp-${Date.now()}`,
                product: productData || { _id: productId } as any,
                quantity: 1,
                addedAt: new Date().toISOString()
            };
            return [...prev, newItem];
        });

        try {
            await API.post('/cart', { productId, quantity: 1 });
            showToast('Item added successfully', 'success');
            await fetchCart();
        } catch (error) {
            console.error('Error adding item:', error);
            showToast('Error adding Item to cart', 'error');
            setCartItems(previousCartItems);
            throw error;
        }
    };

    // Update Quantity
    const updateCartItem = async (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) return removeFromCart(productId);

        showToast('Updating quantity...');
        const previousCartItems = [...cartItems];

        if (!isAuthenticated) {
            const currentGuestItems = getValidGuestItems();
            const updated = currentGuestItems.map(item =>
                getProductId(item) === productId
                    ? { ...item, quantity: newQuantity, addedAt: new Date().toISOString() }
                    : item
            );
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
            setCartItems(updated);
            showToast('Item updated successfully', 'success');
            return;
        }

        setCartItems(prev =>
            prev.map(item => getProductId(item) === productId ? { ...item, quantity: newQuantity } : item)
        );

        try {
            await API.post('/cart', { productId, quantity: newQuantity });
            showToast('Item updated successfully', 'success');
        } catch (error) {
            console.error('Error updating cart:', error);
            showToast('Error updating Item', 'error');
            setCartItems(previousCartItems);
            throw error;
        }
    };

    // Remove Item
    const removeFromCart = async (productId: string) => {
        showToast('Removing Item...');
        const previousCartItems = [...cartItems];

        if (!isAuthenticated) {
            const updated = getValidGuestItems().filter(item => getProductId(item) !== productId);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
            setCartItems(updated);
            showToast('Item removed', 'success');
            return;
        }

        setCartItems(prev => prev.filter(item => getProductId(item) !== productId));

        try {
            await API.delete(`/cart/${productId}`);
            showToast('Item successfully removed', 'success');
        } catch (error) {
            console.error('Error removing item:', error);
            setCartItems(previousCartItems);
            throw error;
        }
    };

    // Clear Cart
    const clearCart = async () => {
        showToast('Clearing Cart...');
        const previousCartItems = [...cartItems];

        if (!isAuthenticated) {
            localStorage.removeItem(GUEST_CART_KEY);
            setCartItems([]);
            showToast('Cart cleared', 'success');
            return;
        }

        setCartItems([]);

        try {
            await API.delete('/cart/clear');
            showToast('Cart cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing cart:', error);
            showToast('Error clearing cart', 'error');
            setCartItems(previousCartItems);
            throw error;
        }
    };

    const isInCart = (productId: string): boolean => {
        return cartItems.some((item) => getProductId(item) === productId);
    };

    const getCartItem = (productId: string): CartItem | undefined => {
        return cartItems.find((item) => getProductId(item) === productId);
    };

    const getCartItemQuantity = (productId: string): number => {
        const item = getCartItem(productId);
        return item ? item.quantity : 0;
    };

    const increaseQuantity = (productId: string) => {
        const current = getCartItemQuantity(productId);
        updateCartItem(productId, current + 1);
    };

    const decreaseQuantity = (productId: string) => {
        const current = getCartItemQuantity(productId);
        if (current > 1) {
            updateCartItem(productId, current - 1);
        } else {
            removeFromCart(productId);
        }
    };

    const cartTotal = cartItems.reduce((total, item) => {
        if (!item.product) return total;
        const price = typeof item.product.dPrice === 'number' && item.product.dPrice > 0
            ? item.product.dPrice 
            : (item.product.price || 0);
        return total + price * item.quantity;
    }, 0);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                removeFromCart,
                updateCartItem,
                clearCart,
                cartTotal,
                cartCount,
                cartOpen,
                setCartOpen,
                increaseQuantity,
                decreaseQuantity,
                getCartItemQuantity,
                getCartItem,
                isInCart,
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}