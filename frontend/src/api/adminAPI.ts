import API from './axios';

// --- Type Definitions ---
export interface Order {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    orderItems: {
        product: string;
        name: string;
    }[];
    orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    items: number;
    itemsPrice: number;
    totalPrice: number;
    paymentMethod?: string;
    paymentStatus?: string;
    paystackReference?: string;
    deliveryPerson?: string;
}

export interface Specification {
    label: string;
    value: string;
}

export interface ProductImage {
    url: string;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    overview: string;
    description: string;
    price: number;
    dPrice?: number;
    category: string;
    stockQuantity: number;
    images: ProductImage[];
    features: string[];
    specifications: Specification[];
    isActive: boolean;
}

export interface UserAccount {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    role?: string;
    isVerified?: boolean;
}

export interface DashboardMetrics {
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    totalRevenue: number;
    recentOrders: Order[];
}

export interface DeliveryDriver {
    _id: string;
    name: string;
    email: string;
    phone?: string;
}

export interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    data: T;
}

// --- Helper Authorization Functions ---
const getUserRole = (): string | null => {
    const role = localStorage.getItem('role');
    if (role) return role;

    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            return user.role || null;
        } catch {
            return null;
        }
    }
    return null;
};

const verifyAdminOrManagerAccess = (): void => {
    const role = getUserRole()?.toLowerCase();
    const allowedRoles = ['admin', 'manager'];

    if (role && !allowedRoles.includes(role)) {
        throw new Error('Access denied. Admin or Manager privileges required.');
    }
};

const verifyAdminAccess = (): void => {
    const role = getUserRole()?.toLowerCase();
    const allowedRoles = ['admin'];

    if (role && !allowedRoles.includes(role)) {
        throw new Error('Access denied. Admin privileges required.');
    }
};

// --- API Service Methods ---
export const adminApi = {
    // Dashboard Analytics Fetching
    getDashboardMetrics: async (): Promise<DashboardMetrics> => {
        verifyAdminOrManagerAccess();
        try {
            const response = await API.get<ApiResponse<DashboardMetrics> | { data: DashboardMetrics }>('/admin/dashboardStats');
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            throw error;
        }
    },

    // Order Fulfillment
    getOrders: async (page = 1, limit = 10, status?: string): Promise<Order[]> => {
        verifyAdminOrManagerAccess();
        try {
            let url = `/admin/orders/all?page=${page}&limit=${limit}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;

            const response = await API.get<ApiResponse<Order[]> | { data: Order[] }>(url);
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error('Error fetching admin orders:', error);
            throw error;
        }
    },

    updateOrderStatus: async (id: string, newStatus: Order['orderStatus']): Promise<Order> => {
        verifyAdminOrManagerAccess();
        try {
            const response = await API.put<ApiResponse<Order> | { data: Order }>(`/orders/${id}/status`, { orderStatus: newStatus });
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error(`Error updating order status for ID ${id}:`, error);
            throw error;
        }
    },

    // Delivery Driver Management
    getDeliveryDrivers: async (): Promise<DeliveryDriver[]> => {
        verifyAdminOrManagerAccess();
        try {
            const response = await API.get<ApiResponse<DeliveryDriver[]> | { data: DeliveryDriver[] }>('/orders/drivers');
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error('Error fetching delivery drivers:', error);
            throw error;
        }
    },

    assignDelivery: async (orderId: string, deliveryPersonId: string): Promise<Order> => {
        verifyAdminOrManagerAccess();
        try {
            const response = await API.patch<ApiResponse<Order> | { data: Order }>(`/orders/${orderId}/assign`, { deliveryPersonId });
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error(`Error assigning delivery for order ID ${orderId}:`, error);
            throw error;
        }
    },

    updateUserRole: async (userId: string, newRole: 'user' | 'manager' | 'admin' | 'delivery') => {
        verifyAdminAccess();

        try {
            const response = await API.put(`/admin/${userId}/role`, { role: newRole });
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error: any) {
            console.error(`Error changing role for user ID ${userId}:`, error);
            throw error;
        }
    },

    // Product fetching and management
    getProducts: async (): Promise<Product[]> => {
        verifyAdminOrManagerAccess();

        try {
            const response = await API.get<ApiResponse<Product[]> | { data: Product[] }>('/products', {
                params: { limit: 1000 }
            });
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error('Error fetching admin products:', error);
            throw error;
        }
    },

    saveProduct: async (productData: Partial<Product> | FormData): Promise<Product> => {
        verifyAdminOrManagerAccess();

        try {
            // Detect if payload is FormData
            const isFormData = productData instanceof FormData;

            // Extract ID safely based on payload type
            const id = isFormData
                ? (productData.get('_id') as string | null)
                : productData._id;

            // Axios automatically detects FormData instances and sets 
            // the correct 'multipart/form-data' header with boundary string
            const response = id
                ? await API.put<ApiResponse<Product> | { data: Product }>(`/products/${id}`, productData)
                : await API.post<ApiResponse<Product> | { data: Product }>('/products', productData);

            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error('Error saving product:', error);
            throw error;
        }
    },

    deleteProduct: async (id: string): Promise<void> => {
        verifyAdminOrManagerAccess();
        try {
            await API.delete(`/products/${id}`);
        } catch (error) {
            console.error(`Error deleting product ID ${id}:`, error);
            throw error;
        }
    },

    // Fetch Users List with Pagination
    getUsers: async (page = 1, limit = 10): Promise<UserAccount[]> => {
        verifyAdminOrManagerAccess();
        try {
            const response = await API.get<ApiResponse<UserAccount[]> | { data: UserAccount[] }>(`/admin/users?page=${page}&limit=${limit}`);
            return 'data' in response.data ? response.data.data : response.data;
        } catch (error) {
            console.error('Error fetching users list:', error);
            throw error;
        }
    }
};