import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';

export const getAdminDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Calculate total revenue (Only from orders marked as 'Delivered' and 'Completed')
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: 'Delivered', paymentStatus: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Get recent orders for the dashboard preview
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .select('orderStatus paymentStatus totalPrice createdAt');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPlatformOrders = async (req: Request, res: Response) => {
    try {
        // Explicitly parse query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;

        // Define strongly typed query object
        const query: Record<string, any> = {};
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Fetch All Orders Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch platform orders.' });
    }
};

export const getAllUsersAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);

        // Explicitly exclude the password field for security
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);

        const count = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: users,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum
        });
    } catch (error) {
        console.error('Fetch All Users Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user profiles.' });
    }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const allowedRoles = ['user', 'manager', 'admin', 'delivery'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role parameter.' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { returnDocument: 'after',
            runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
