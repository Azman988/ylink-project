import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { CloudinaryImage, deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinary';
import Order from '../models/Order';

// --- CREATE PRODUCT ---
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name, overview, description, price, dPrice,
            category, stockQuantity, features, specifications
        } = req.body;

        // Generate URL-friendly slug
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Enforce uniqueness
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ success: false, message: 'Product with this name already exists.' });
        }

        console.log(req)

        const files = req.files as Express.Multer.File[];
        let images: CloudinaryImage[] = [];

        // Upload files to Cloudinary and return { url, public_id } objects
        if (files && files.length > 0) {
            images = await Promise.all(
                files.map((file) => uploadBufferToCloudinary(file.buffer, 'ylink-products'))
            );
        }

        // Parse Arrays sent via FormData (FormData sends arrays/objects as JSON strings)
        let parsedFeatures = [];
        let parsedSpecs = [];

        try {
            if (features) {
                parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
            }
            if (specifications) {
                parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            }
        } catch (err) {
            console.error("Failed to parse features or specifications JSON");
        }

        // Create Product
        const product = await Product.create({
            name,
            slug,
            overview,
            description,
            price: Number(price),
            dPrice: dPrice ? Number(dPrice) : undefined,
            category,
            stockQuantity: Number(stockQuantity),
            features: parsedFeatures,
            specifications: parsedSpecs,
            images
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// Update a Product (Price, Stock, Description, etc.)
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        console.log(req.body, product)

        // Update the product with new data from the request body
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after', // Returns the newly updated document
            runValidators: true // Ensures the updated data still follows the Schema rules
        });

        res.status(200).json({ success: true, data: product });
    } catch (error) { next(error); }
};

// Delete a Product & its Cloudinary Images
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete all associated images from Cloudinary
        if (product.images && product.images.length > 0) {
            const imageDeletionPromises = product.images.map(image => {
                if (image.public_id) {
                    return deleteFromCloudinary(image.public_id);
                }
            });

            // Run all deletion requests in parallel for speed
            await Promise.all(imageDeletionPromises);
        }

        // Delete the product from storage
        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product has been permanently deleted.'
        });
    } catch (error) { next(error); }
};

// --- GET PRODUCTS (SEARCH & FILTER) ---
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { keyword, category, minPrice, maxPrice, sort, page, limit } = req.query;

        let andConditions: any[] = [{ isActive: true }];

        // Search logic updated for new schema fields
        if (keyword) {
            const searchRegex = { $regex: keyword as string, $options: 'i' };
            andConditions.push({
                $or: [
                    { name: searchRegex },
                    { overview: searchRegex },
                    { description: searchRegex },
                    { category: searchRegex },
                    { features: searchRegex },
                    { "specifications.value": searchRegex }
                ]
            });
        }

        // Exact category match
        if (category) andConditions.push({ category: category as string });

        // Price Filtering (Check against dPrice if it exists, otherwise price)
        if (minPrice || maxPrice) {
            const min = minPrice ? Number(minPrice) : undefined;
            const max = maxPrice ? Number(maxPrice) : undefined;

            andConditions.push({
                // Condition 1: dPrice exists and matches range
                $or: [
                    {
                        dPrice: {
                            $exists: true,
                            $ne: null,
                            ...(min !== undefined && { $gte: min }),
                            ...(max !== undefined && { $lte: max })
                        }
                    },
                    // Condition 2: dPrice does not exist, so check regular price
                    {
                        dPrice: { $exists: false },
                        price: {
                            ...(min !== undefined && { $gte: min }),
                            ...(max !== undefined && { $lte: max })
                        }
                    }
                ]
            });
        }

        // Combine into final query object
        const query = { $and: andConditions };

        // Sorting logic
        let sortOptions: any = {};
        switch (sort) {
            case 'newest': sortOptions.createdAt = -1; break;
            case 'oldest': sortOptions.createdAt = 1; break;
            case 'price_low': sortOptions.price = 1; break;
            case 'price_high': sortOptions.price = -1; break;
            default: sortOptions.createdAt = -1; break;
        }

        // Pagination logic
        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 12;
        const skip = (pageNumber - 1) * pageSize;

        const [products, totalProducts] = await Promise.all([
            Product.find(query).sort(sortOptions).skip(skip).limit(pageSize),
            Product.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            pagination: {
                totalProducts,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalProducts / pageSize),
                pageSize
            },
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Fetch a single product by ID for the details page
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;

        // Query by slug field instead of Mongo _id
        const product = await Product.findOne({ slug });

        if (!product || !product.isActive) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// --- Reviews --- 
export const createProductReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = (req as any).user._id || (req as any).user.id; 

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        // Verify user purchased the product and order status is 'Delivered'
        const hasPurchasedAndDelivered = await Order.findOne({
            user: userId,
            orderStatus: 'Delivered',
            'orderItems.product': productId,
        });

        if (!hasPurchasedAndDelivered) {
            return res.status(400).json({
                success: false,
                message: 'You can only review products you have purchased and received.',
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === userId.toString()
        );

        if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Product already reviewed' });

        // create review object
        const review = {
            user: userId,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        // Add review to array
        product.reviews.push(review as any);

        // Update total review number
        product.numReviews = product.reviews.length;

        // Calculate average rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) { next(error); }
};
