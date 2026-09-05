import API from './axios';

export interface OrderPayload {
    orderItems: {
        product: string;
        quantity: number;
    }[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        phoneNumber: string;
    };
    paymentMethod: string;
}

export interface Order {
    _id: string;
    createdAt: string;
    orderStatus: string;
    totalPrice: number;
    orderItems: Array<{
        _id: string;
        image: string
        product: { _id: string; name: string; slug: string; price: number; };
        name: string;
        price: number;
        quantity: number;
    }>;
    user: { name: string; email: string; phone: string };
    shippingAddress: { street: string; city: string; state: string };
    shippingPrice: number;
    paymentMethod: string;
}

export interface DriverOrder {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
    };
    totalPrice: number;
    orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    shippingAddress: { street: string; city: string; state: string };
    createdAt: string;
    deliveredAt?: string;
    paymentStatus?: string;
}

export const orderApi = {
    // Submits the order and returns the Paystack authorization URL
    createOrder: async (orderData: OrderPayload) => {
        try {
            const response = await API.post('/orders/create', orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Fetches the logged-in user's past orders
    getMyOrders: async () => {
        try {
            const response = await API.get('/orders/my-orders');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },

    verifyPaystackPayment: async (reference: string) => {
        try {
            const response = await API.get(`/orders/verify-paystack?reference=${reference}`);
            return response.data.data;
        } catch (error) {
            console.error('Error verifying Paystack payment:', error);
            throw error;
        }
    },

    getOrderDetails: async (orderId: string) => {
        try {
            const response = await API.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    // Fetch real-time tracking updates for a specific order
    trackOrder: async (orderId: string) => {
        try {
            const response = await API.get(`/orders/${orderId}/track`);
            return response.data.data;
        } catch (error) {
            console.error('Error tracking order:', error);
            throw error;
        }
    },

    // Driver's order handlers
    // Fetch assigned orders for specific driver
    getAssignedOrders: async (): Promise<DriverOrder[]> => {
        try {
            const response = await API.get(`/orders/driver-orders`);
            console.log('Assigned orders response:', response.data);
            return response.data.data || response.data; // Handle both ApiResponse and direct data formats
        } catch (error) {
            console.error('Error fetching assigned driver orders:', error);
            throw error;
        }
    },

    // Mark an order as fully delivered (* Required Roles: Delivery)
    markAsDelivered: async (orderId: string, verificationCode: string) => {
        try {
            const response = await API.patch(`/orders/${orderId}/deliver`, {
                verificationCode
            });
            return response.data.order || response.data.data; // Handle both ApiResponse and direct data formats
        } catch (error) {
            console.error('Error marking order as delivered:', error);
            throw error;
        }
    }
};