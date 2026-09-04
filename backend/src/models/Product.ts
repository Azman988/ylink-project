import mongoose, { Schema, Document } from 'mongoose';

// Interfaces for autocompletion
export interface ISpecification {
    label: string;
    value: string;
}

export interface IProductImage {
    url: string;
    public_id: string;
}

// Add Review Interface
export interface IReview {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    overview: string;
    description: string;
    price: number;
    dPrice?: number; // Optional discount price
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

// Create Review Schema
const ReviewSchema = new Schema<IReview>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true });

// Mongoose Schema
const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    overview: {
        type: String,
        required: [true, 'Product overview is required']
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    dPrice: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        enum: ['Laptops', 'Smartphones', 'Accessories', 'Solar', 'Inverters', 'Cameras'],
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
    features: [{ type: String }],
    specifications: [ 
        {
            label: { type: String, required: true },
            value: { type: String, required: true }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    reviews: [ReviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);