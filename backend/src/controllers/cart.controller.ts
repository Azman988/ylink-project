import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import User from '../models/User';
import Address from '../models/Address';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Helper to format cart JSON payload safely without breaking Mongoose document structure
const formatCartResponse = (cart: any) => {
    const cartObj = cart.toObject ? cart.toObject() : cart;
    cartObj.items = (cartObj.items || []).filter((item: any) => item.product !== null && item.product !== undefined);
    return cartObj;
};

// Helper: Filter out unpurchased items older than 7 days and persist cleanup to DB
const cleanExpiredCartItems = async (cart: any) => {
    const now = Date.now();
    const initialLength = cart.items.length;

    cart.items = cart.items.filter((item: any) => {
        const addedAtTime = new Date(item.addedAt || item.createdAt || now).getTime();
        return (now - addedAtTime) < SEVEN_DAYS_MS;
    });

    if (cart.items.length !== initialLength) {
        await cart.save();
    }
    return cart;
};

// Get current user's cart
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required to retrieve cart'
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        } else {
            await cleanExpiredCartItems(cart);
        }

        await cart.populate('items.product', 'name slug price dPrice overview images inStock stockQuantity');

        res.status(200).json({ success: true, data: cart });
    } catch (error) { 
        next(error); 
    }
};

// Add or update item in cart
export const syncCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID is required to manage cart',
            });
        }

        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, items: [] });

        await cleanExpiredCartItems(cart);

        if (quantity <= 0) {
            cart.items.pull({ product: productId });
            await cart.save();
            await cart.populate('items.product', 'name price images inStock');
            return res.status(200).json({ success: true, data: cart });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        if (product.stockQuantity < quantity) {
            return res.status(400).json({ success: false, message: 'Not enough stock available' });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            // Reset timer on explicitly updated quantity
            cart.items[itemIndex].addedAt = new Date();
        } else {
            cart.items.push({ product: productId, quantity, addedAt: new Date() });
        }

        await cart.save();
        await cart.populate('items.product', 'name price overview images inStock stockQuantity');

        res.status(200).json({ success: true, data: cart });
    } catch (error) { 
        next(error); 
    }
};

// Merge guest cart into user DB cart on login
export const mergeGuestCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;
        const { guestItems } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, items: [] });

        await cleanExpiredCartItems(cart);

        if (Array.isArray(guestItems) && guestItems.length > 0) {
            const now = Date.now();

            // Deduplicate incoming guest payload array
            const sanitizedGuestMap = new Map<string, { quantity: number; addedAt?: string }>();
            for (const item of guestItems) {
                if (!item.productId || typeof item.productId !== 'string') continue;
                const existing = sanitizedGuestMap.get(item.productId);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    sanitizedGuestMap.set(item.productId, { quantity: item.quantity, addedAt: item.addedAt });
                }
            }

            // Merge deduplicated items into DB cart safely
            for (const [productId, guestItem] of sanitizedGuestMap.entries()) {
                const addedAtTime = new Date(guestItem.addedAt || now).getTime();
                if ((now - addedAtTime) >= SEVEN_DAYS_MS) continue;

                const product = await Product.findById(productId);
                if (!product) continue;

                const itemIndex = cart.items.findIndex(p =>
                    String((p.product as any)?._id || p.product) === String(productId)
                );

                if (itemIndex > -1) {
                    const newQty = cart.items[itemIndex].quantity + guestItem.quantity;
                    cart.items[itemIndex].quantity = Math.min(newQty, product.stockQuantity);
                } else {
                    cart.items.push({
                        product: productId as any,
                        quantity: Math.min(guestItem.quantity, product.stockQuantity),
                        addedAt: new Date(guestItem.addedAt || now)
                    });
                }
            }
            await cart.save();
        }

        await cart.populate('items.product', 'name slug price dPrice overview images inStock stockQuantity');

        return res.status(200).json({ success: true, data: formatCartResponse(cart) });
    } catch (error) {
        next(error);
    }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required to manage cart'
            });
        }

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } },
            { returnDocument: 'after' }
        ).populate('items.product', 'name price images inStock');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

// Clear cart
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        let cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { returnDocument: 'after' }
        );

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: cart
        });
    } catch (error) {
        console.error('Clear Cart Controller Error:', error);
        next(error);
    }
};

// Checkout handler
export const proceedToCheckout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty. Add items before proceeding to checkout.'
            });
        }

        await cleanExpiredCartItems(cart);
        await cart.populate('items.product');

        if (cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All items in your cart have expired after 7 days. Please add fresh items.'
            });
        }

        const [user, addresses] = await Promise.all([
            User.findById(userId).select('bonusPoints email name phone'),
            Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 })
        ]);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User account not found' });
        }

        let calculatedSubtotal = 0;
        const checkoutItems = [];

        for (const item of cart.items) {
            const product = item.product as any;

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more products in your cart are no longer available.'
                });
            }

            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} remaining.`
                });
            }

            const activePrice = (product.dPrice && product.dPrice > 0) ? product.dPrice : product.price;
            calculatedSubtotal += activePrice * item.quantity;

            checkoutItems.push({
                product: product._id,
                name: product.name,
                image: product.images?.[0] || '',
                quantity: item.quantity,
                price: activePrice,
                availableStock: product.stockQuantity
            });
        }

        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;
        let estimatedShippingPrice = 3500;

        if (defaultAddress && defaultAddress.city?.toLowerCase() === 'ibadan') {
            estimatedShippingPrice = 1500;
        }

        return res.status(200).json({
            success: true,
            data: {
                checkoutItems,
                subtotal: calculatedSubtotal,
                addresses,
                defaultAddress,
                estimatedShippingPrice,
                availableBonusPoints: user.bonusPoints || 0
            }
        });

    } catch (error) {
        next(error);
    }
};