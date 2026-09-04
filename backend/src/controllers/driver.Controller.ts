import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';

// Get only orders assigned to the currently logged-in driver
export const getAssignedOrders = async (req: Request, res: Response) => {
    try {
        const driverId = (req as any).user._id || (req as any).user.id; // Assumes authMiddleware populates req.user
        
        const orders = await Order.find({ deliveryPerson: driverId })
            .populate('user', 'name phone address')
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch assigned orders', error });
    }
};

// Confirm delivery using customer verification code
export const markAsDelivered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;
        const orderId = req.params.orderId as string;
        const { verificationCode } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required.' });
        }

        if (!verificationCode) {
            return res.status(400).json({ success: false, message: 'Verification code is required.' });
        }

        // Fetch order WITHOUT mutating it yet
        const order = await Order.findOne({
            _id: orderId,
            deliveryPerson: userId // Restricts update to driver assigned to this order
        });

        // Verify order exists and driver is assigned
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or you are not the assigned delivery driver.'
            });
        }

        // Check if already delivered
        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ 
                success: false, 
                message: 'Order has already been marked as delivered.' 
            });
        }

        // Security Check: Validate code (converts number/string & trims whitespace)
        const storedCode = order.deliveryVerificationCode?.toString().trim();
        const inputCode = verificationCode.toString().trim();

        if (!storedCode || storedCode !== inputCode) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code. Delivery cannot be completed.'
            });
        }

        // Update and persist order changes
        order.orderStatus = 'Delivered';
        order.paymentStatus = 'Completed';
        if ('isDelivered' in order) order.isDelivered = true;
        if ('deliveredAt' in order) order.deliveredAt = new Date();

        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order successfully marked as delivered.',
            data: order
        });
    } catch (error) {
        next(error)

        return res.status(500).json({ message: 'Error confirming delivery', error });
    }
};
