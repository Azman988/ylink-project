import { Router } from 'express';
import { getAdminDashboardStats, getAllPlatformOrders, getAllUsersAdmin, updateUserRole } from '../controllers/admin.controller';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Protect all admin routes
router.use(protect);

// GET /api/admin/
router.get('/dashboardStats', authorizeRoles('admin', 'manager'), getAdminDashboardStats);
router.get('/orders/all', authorizeRoles('admin', 'manager'), getAllPlatformOrders);
router.get('/users', authorizeRoles('admin'), getAllUsersAdmin);

// Only Admins can change user roles
router.put('/:userId/role', protect, authorizeRoles('admin'), updateUserRole);

export default router;