import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../models/User';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'user' | 'manager' | 'admin' | 'delivery';
        email: string;
        name: string;
    };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = verify(token, secret) as { id: string };
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            name: user.name
        };

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Session expired or invalid' });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access Denied: Requires one of: ${roles.join(', ')}`
            });
        }
        next();
    };
};