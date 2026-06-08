// adminApi.ts

export interface Order {
    id: string;
    customer: string;
    email: string;
    date: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: number;
    total: number;
}

export interface Specification {
    label: string;
    value: string;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    shortDescription: string;
    fullDescription: string;
    type: 'retail' | 'service';
    icon: string;
    inStock: boolean;
    features: string[];
    specifications: Specification[];
}

export interface UserAccount {
    id: string;
    name: string;
    email: string;
    joined: string;
}

// Initial Mock Seed Data
const INITIAL_ORDERS: Order[] = [
    { id: "ORD-1045", customer: "Usman Azeez", email: "azman.dev@example.com", date: "2026-06-07", status: "Processing", items: 1, total: 99999 },
    { id: "ORD-1044", customer: "Sarah Adams", email: "sarah@example.com", date: "2026-06-06", status: "Shipped", items: 2, total: 850000 },
    { id: "ORD-1043", customer: "David Mark", email: "d.mark@example.com", date: "2026-06-05", status: "Delivered", items: 1, total: 45000 },
];

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p2',
        name: 'UltraPhone 15 Pro',
        category: 'Smartphones',
        price: 99999,
        shortDescription: 'The latest flagship smartphone with a pro-grade camera system and all-day battery.',
        fullDescription: 'Take control of your power with our comprehensive 5kVA Home Solar Package. Engineered by YLink Tech professionals, this system is designed to provide seamless backup power during outages and significantly reduce your daily electricity costs. We handle everything from site assessment to roof mounting and grid integration, ensuring a safe and highly efficient energy solution tailored to your property.',
        type: 'retail',
        icon: '/images/categories/smartphone.webp',
        inStock: true,
        features: [
            'Professional site assessment and installation',
            'Seamless auto-switch during grid power failures',
            'Surge protection and advanced grounding',
            '1-year free maintenance and 5-year hardware warranty',
        ],
        specifications: [
            { label: 'Inverter Capacity', value: '5kVA / 48V Pure Sine Wave' },
            { label: 'Solar Panels', value: '6x 450W Monocrystalline Half-Cut' },
            { label: 'Battery Storage', value: '4x 200Ah Deep Cycle Tubular Batteries' },
            { label: 'Charge Controller', value: '80A MPPT' },
            { label: 'Installation Time', value: '1 to 2 Business Days' },
        ],
    }
];

const INITIAL_USERS: UserAccount[] = [
    { id: "USR-01", name: "Usman Azeez", email: "azman.dev@example.com", joined: "2026-01-15" },
    { id: "USR-02", name: "Sarah Adams", email: "sarah@example.com", joined: "2026-03-22" },
    { id: "USR-03", name: "David Mark", email: "d.mark@example.com", joined: "2026-05-10" },
    { id: "USR-04", name: "Tunde B.", email: "tunde.b@example.com", joined: "2026-06-01" },
];

const seedStorage = () => {
    if (!localStorage.getItem('yl_orders')) localStorage.setItem('yl_orders', JSON.stringify(INITIAL_ORDERS));
    if (!localStorage.getItem('yl_products')) localStorage.setItem('yl_products', JSON.stringify(INITIAL_PRODUCTS));
    if (!localStorage.getItem('yl_users')) localStorage.setItem('yl_users', JSON.stringify(INITIAL_USERS));
};
seedStorage();

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const adminApi = {
    // Analytics
    getDashboardMetrics: async () => {
        await delay();
        const orders = JSON.parse(localStorage.getItem('yl_orders') || '[]');
        const products = JSON.parse(localStorage.getItem('yl_products') || '[]');
        const users = JSON.parse(localStorage.getItem('yl_users') || '[]');
        return {
            totalOrders: orders.length,
            totalUsers: users.length,
            totalProducts: products.length,
            recentOrders: orders.slice(0, 5) // Top 5 recent
        };
    },

    // Order Fulfillment
    getOrders: async (): Promise<Order[]> => {
        await delay();
        return JSON.parse(localStorage.getItem('yl_orders') || '[]');
    },
    
    updateOrderStatus: async (id: string, newStatus: Order['status']): Promise<Order[]> => {
        await delay();
        const orders: Order[] = JSON.parse(localStorage.getItem('yl_orders') || '[]');
        const updatedOrders = orders.map(order => 
            order.id === id ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('yl_orders', JSON.stringify(updatedOrders));
        return updatedOrders;
    },

    // Products
    getProducts: async (): Promise<Product[]> => {
        await delay();
        return JSON.parse(localStorage.getItem('yl_products') || '[]');
    },
    saveProduct: async (product: Product): Promise<Product[]> => {
        await delay();
        const products: Product[] = JSON.parse(localStorage.getItem('yl_products') || '[]');
        const existingIndex = products.findIndex(p => p.id === product.id);
        
        let updated;
        if (existingIndex >= 0) {
            updated = [...products];
            updated[existingIndex] = product;
        } else {
            updated = [product, ...products];
        }
        
        localStorage.setItem('yl_products', JSON.stringify(updated));
        return updated;
    },
    deleteProduct: async (id: string): Promise<Product[]> => {
        await delay();
        const products: Product[] = JSON.parse(localStorage.getItem('yl_products') || '[]');
        const updated = products.filter(p => p.id !== id);
        localStorage.setItem('yl_products', JSON.stringify(updated));
        return updated;
    }
};