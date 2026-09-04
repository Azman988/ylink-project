import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: [1, 'Quantity cannot be less than 1'],
        default: 1 
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const CartSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    items: [CartItemSchema]
}, { timestamps: true });

// Document TTL index: Clean up completely empty/inactive carts after 7 days
CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.model('Cart', CartSchema);