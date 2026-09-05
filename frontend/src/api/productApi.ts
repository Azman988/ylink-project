import API from './axios';

// Aligning with your MongoDB schema structure
export interface ISpecification {
    label: string;
    value: string;
}

export interface IReview {
    name: string;
    rating: number;
    comment: string;
}

export interface IProductImage {
    url: string;
    public_id: string;
}

export interface ProductDetail {
    _id: string; 
    name: string;
    slug: string;
    overview: string;
    description: string;
    dPrice?: string;
    price: number;
    category: string;
    stockQuantity: number;
    images: IProductImage[];
    features: string[];
    specifications: ISpecification[];
    isActive: boolean;
    reviews: IReview[];   
    rating: number;       
    numReviews: number;
}

export interface GetProductsParams {
    keyword?: string;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc';
    page?: number;
    limit?: number;
}

// Paginated Response Interface
export interface PaginatedProductsResponse {
    success: boolean;
    pagination: {
        totalProducts: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
    };
    data: ProductDetail[];
}

export interface ReviewPayload {
    rating: number;
    comment: string;
}

export const productApi = {
    // Primary Fetch API - Supports Filtering, Sorting & Pagination
    getProducts: async (
        params: GetProductsParams = {}
    ): Promise<PaginatedProductsResponse> => {
        try {
            const response = await API.get<PaginatedProductsResponse>('/products', {
                params, 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Fetch all active products without pagination limits
    getAllProductsUnpaginated: async (): Promise<ProductDetail[]> => {
        try {
            const response = await productApi.getProducts({ limit: 1000 });
            return response.data;
        } catch (error) {
            console.error('Error fetching all unpaginated products:', error);
            throw error;
        }
    },

    // Fetch a single product for the Product Details page
    getProductBySlug: async (slug: string): Promise<ProductDetail> => {
        try {
            const response = await API.get(`/products/${slug}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    },

    // Submit product reviews
    addProductReview: async (productId: string, payload: ReviewPayload) => {
    const response = await API.post(`/products/${productId}/reviews`, payload);
    return response.data;
}
}



