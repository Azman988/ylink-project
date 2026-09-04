import { Router } from 'express';
import { getCart, syncCartItem, mergeGuestCart, removeCartItem, clearCart, proceedToCheckout } from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // All cart actions require login

router.route('/')
    .get(getCart)
    .post(syncCartItem);

router.post('/merge', mergeGuestCart);

// proceed to checkout 
router.get('/checkout-proceed', proceedToCheckout);

router.delete('/clear', clearCart);
router.delete('/:productId', removeCartItem);

export default router;