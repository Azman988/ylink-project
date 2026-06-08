// --- Interfaces ---
interface Specification {
    label: string;
    value: string;
}

export interface ProductDetail {
    id: string;
    name: string;
    category: string;
    price: any;
    dPrice?: string | number;
    shortDescription: string;
    fullDescription: string;
    type: 'retail' | 'service';
    icon: string;
    features: string[];
    specifications: Specification[];
    inStock: boolean;
}

export type CartItem = ProductDetail & {
    quantity: number;
}

// --- Mock Data (Simulating a fetched product) ---
export const mockProduct: ProductDetail[] = [
    {
        id: 'p1',
        name: 'ProBook X-Series',
        category: 'Laptops',
        price: 1299992,
        dPrice: 1200000,
        shortDescription: 'High-performance laptop for developers and creative professionals. 16GB RAM, 1TB SSD.',
        fullDescription: 'Take control of your power with our comprehensive 5kVA Home Solar Package. Engineered by YLink Tech professionals, this system is designed to provide seamless backup power during outages and significantly reduce your daily electricity costs. We handle everything from site assessment to roof mounting and grid integration, ensuring a safe and highly efficient energy solution tailored to your property.',
        type: 'retail',
        icon: 'laptop.webp',
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
    }, {
        id: 'p2',
        name: 'UltraPhone 15 Pro',
        category: 'Smartphones',
        price: 99999,
        shortDescription: 'The latest flagship smartphone with a pro-grade camera system and all-day battery.',
        fullDescription: 'Take control of your power with our comprehensive 5kVA Home Solar Package. Engineered by YLink Tech professionals, this system is designed to provide seamless backup power during outages and significantly reduce your daily electricity costs. We handle everything from site assessment to roof mounting and grid integration, ensuring a safe and highly efficient energy solution tailored to your property.',
        type: 'retail',
        icon: '/smartphone.webp',
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
    }, {
        id: 'p3',
        name: 'Noise-Canceling Earbuds Plus',
        category: 'Accessories',
        price: 1991298,
        shortDescription: 'Immersive sound with active noise cancellation and sweat resistance for workouts.',
        fullDescription: 'Experience immersive sound with our Noise-Canceling Earbuds Plus. Featuring active noise cancellation and sweat resistance, they are perfect for workouts and daily use.',
        type: 'retail',
        icon: '/audio.webp',
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
    }, {
        id: 'p4',
        name: '5kVA Home Solar Package',
        category: 'Solar/Inverters',
        price: '3500',
        shortDescription: 'Complete, reliable home solar setup designed to eliminate grid dependency and keep your essential appliances running 24/7.',
        fullDescription: 'Take control of your power with our comprehensive 5kVA Home Solar Package. Engineered by YLink Tech professionals, this system is designed to provide seamless backup power during outages and significantly reduce your daily electricity costs. We handle everything from site assessment to roof mounting and grid integration, ensuring a safe and highly efficient energy solution tailored to your property.',
        type: 'service',
        icon: '/solar.webp',
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
    }, {
        id: 'p5',
        name: '10kVA Custom Inverter Build',
        category: 'Solar/Inverters',
        price: '1800',
        shortDescription: 'Heavy-duty custom inverter built to handle industrial or large-scale residential power loads.',
        fullDescription: 'Our 10kVA Custom Inverter Build is designed for heavy-duty applications, providing reliable power backup for industrial or large-scale residential use.',
        type: 'service',
        icon: 'solar-panel.webp',
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
    }, {
        id: 'p6',
        name: 'Laptop Screen Replacement',
        category: 'Repairs',
        price: '150',
        shortDescription: 'Fast, professional screen replacement for all major laptop brands. 90-day warranty included.',
        fullDescription: 'Our Laptop Screen Replacement service offers fast and professional screen repairs for all major laptop brands. With a 90-day warranty included, we ensure your device is in safe hands.',
        type: 'service',
        icon: '☀️',
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
    }, {
        id: 'p7',
        name: 'Smartphone Battery Swap',
        category: 'Repairs',
        price: '75',
        shortDescription: 'Restore your phone’s battery life to 100% with our OEM-quality battery replacements.',
        fullDescription: 'Our Smartphone Battery Swap service restores your phone’s battery life to 100% with OEM-quality replacements, ensuring your device performs like new.',
        type: 'service',
        icon: '🪫',
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
    }, {
        id: 'p8',
        name: 'Gamer Elite Laptop',
        category: 'Laptops',
        price: 1899,
        shortDescription: 'Ultimate gaming powerhouse with RTX 4080 graphics, 32GB RAM, and a 240Hz display.',
        fullDescription: 'Experience gaming like never before with our Gamer Elite Laptop. Equipped with RTX 4080 graphics, 32GB RAM, and a 240Hz display, it delivers unparalleled performance for both gaming and creative work.',
        type: 'retail',
        icon: '🕹️',
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
    },
];