import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEffect, useRef } from 'react';

interface ProtectedRouteProps {
    adminOnly?: boolean;
}

export const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
    const location = useLocation();
    const { isAuthenticated, user, isLoading } = useAuth();
    const { showToast } = useToast();
    const hasToastedRef = useRef(false);

    useEffect(() => {
        // Trigger toast ONCE when auth check resolves and user is not authenticated
        if (!isLoading && !isAuthenticated && !hasToastedRef.current) {
            hasToastedRef.current = true;
            showToast('Please log in to continue.', 'error');
        }
    }, [isLoading, isAuthenticated, showToast]);

    // Unauthenticated user -> Redirect cleanly (NO showToast here!)
    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Admin / Manager Role Check
    if (adminOnly) {
        const hasAccess = user?.role === 'admin' || user?.role === 'manager';
        if (!hasAccess) {
            return <Navigate to="/" replace />;
        }
    }

    // Render protected child routes
    return <Outlet />;
};