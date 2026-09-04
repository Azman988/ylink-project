import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, verifyPaystackPayment, trackOrder, assignDelivery, updateOrderStatus, getAvailableDrivers } from '../controllers/order.controller';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
import { getAssignedOrders, markAsDelivered } from '../controllers/driver.Controller';

const router = Router();

// Public route for creating an order
router.post('/create', protect, createOrder);

// Payment verification route
router.get('/verify-paystack', verifyPaystackPayment);

// User routes
router.get('/my-orders', protect, getMyOrders);

// Get drivers list
router.get(
    '/drivers',
    protect,
    authorizeRoles('admin', 'manager'),
    getAvailableDrivers
);

// Drivers get and upate order assigned to them
router.get('/driver-orders', protect, authorizeRoles('delivery'), getAssignedOrders);

// User can get a specific order by ID
router.get('/:id', protect, getOrderById);

// Track a specific order
router.get('/:id/track', protect, trackOrder);

// Fulfillment routes
// Assign delivery driver
router.patch('/:orderId/assign', protect, authorizeRoles('admin', 'manager'), assignDelivery);

// Update order status (Admin and Manager only)
router.put('/:id/status', protect, authorizeRoles('admin', 'manager'), updateOrderStatus);

// Delivery driver can mark order as delivered
router.patch('/:orderId/deliver', protect, authorizeRoles('delivery'), markAsDelivered);


export default router;