import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct,updateProduct, deleteProduct, createProductReview } from '../controllers/product.controller';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public routes (anyone can view products)
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Protected Admin route (only authenticated admins can upload products)
router.post( '/', protect, authorizeRoles('admin', 'manager'),
    upload.array('images', 5),
    createProduct
);

// Update Product - Allowed for Admins and Managers
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateProduct);

// Delete Product - Strictly Allowed for Admins Only
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

// User Protected Routes
// Anyone who is logged in can leave a review
router.post('/:id/reviews', protect, createProductReview);

export default router;