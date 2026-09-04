import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Cart from '../models/Cart';
import axios from 'axios';

// Create Order by user
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, applyBonusPoints } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items provided' });
        }

        let calculatedItemsPrice = 0;
        const verifiedOrderItems = [];

        // Verify prices and inventory against the database
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.name} not found`
                });
            }

            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}.`
                });
            }

            const activePrice = (product.dPrice && product.dPrice > 0) ? product.dPrice : product.price;
            calculatedItemsPrice += activePrice * item.quantity;

            const productImage =
                (typeof product.images?.[0] === 'object' ? product.images[0]?.url : product.images?.[0])
                || item.image
                || '';

            verifiedOrderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: activePrice,
                image: productImage
            });
        }

        // Calculate Shipping
        const shippingPrice = shippingAddress.city?.toLowerCase() === 'ibadan' ? 1500 : 3500;
        let totalPrice = calculatedItemsPrice + shippingPrice;

        // User verification and Bonus Points
        const user = await User.findById((req as any).user.id);
        if (!user || !user.email) {
            return res.status(400).json({ success: false, message: 'Valid user email is required for checkout.' });
        }

        let discountAmount = 0;
        if (applyBonusPoints && user.bonusPoints > 0) {
            discountAmount = Math.min(user.bonusPoints, totalPrice);
            totalPrice -= discountAmount;

            user.bonusPoints -= discountAmount;
            await user.save();
        }

        const deliveryVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create the Order
        const order = await Order.create({
            user: (req as any).user.id,
            orderItems: verifiedOrderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice: calculatedItemsPrice,
            shippingPrice,
            discountAmount,
            totalPrice,
            deliveryVerificationCode
        });

        // Deduct inventory & Clear Cart (Executed for all payment methods)
        for (const item of verifiedOrderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockQuantity: -item.quantity }
            });
        }

        await Cart.findOneAndUpdate(
            { user: (req as any).user.id },
            { $set: { items: [] } }
        );

        // Send Email Notifications (Customer & Admin)
        const orderItemsHtml = verifiedOrderItems.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
            </tr>
        `).join('');

        // --- Customer Confirmation Email ---
        try {
            await sendEmail({
                email: user.email,
                subject: 'YLink Order Confirmed - Your Delivery Code',
                message: `
                    <h2>Your order is confirmed!</h2>
                    <p>Thank you for shopping with YLink Tech. Your order <b>#${order._id}</b> is being processed.</p>
                    ${discountAmount > 0 ? `<p>You saved <b>₦${discountAmount.toLocaleString()}</b> using bonus points!</p>` : ''}
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <p style="margin: 0; font-size: 15px;">Give this secure code to your delivery driver upon package arrival:</p>
                        <h1 style="letter-spacing: 5px; color: #2563eb; margin: 10px 0;">${deliveryVerificationCode}</h1>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error('Customer confirmation email failed:', mailErr);
        }

        // --- Admin Alert Email ---
        const adminEmail = process.env.EMAIL_USER || process.env.SMTP_EMAIL;
        if (adminEmail) {
            try {
                await sendEmail({
                    email: adminEmail,
                    subject: `🚨 New Order Received [ #${order._id.toString().slice(-6)} ]`,
                    message: `
                        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto;">
                            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">New Incoming Order!</h2>
                            <p><b>Order ID:</b> ${order._id}</p>
                            <p><b>Customer Name:</b> ${user.name || 'N/A'}</p>
                            <p><b>Customer Email:</b> ${user.email}</p>
                            <p><b>Payment Method:</b> ${paymentMethod.toUpperCase()}</p>
                            <p><b>Delivery Verification Code:</b> <code>${deliveryVerificationCode}</code></p>
                            
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                            
                            <h3>Shipping Address</h3>
                            <p style="margin: 4px 0;"><b>Address:</b> ${shippingAddress.street || 'N/A'}</p>
                            <p style="margin: 4px 0;"><b>City:</b> ${shippingAddress.city}</p>
                            <p style="margin: 4px 0;"><b>Phone:</b> ${shippingAddress.phone || shippingAddress.phoneNumber || 'N/A'}</p>

                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

                            <h3>Ordered Items</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #f8fafc; text-align: left;">
                                        <th style="padding: 8px;">Item</th>
                                        <th style="padding: 8px; text-align: center;">Qty</th>
                                        <th style="padding: 8px; text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderItemsHtml}
                                </tbody>
                            </table>

                            <div style="margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 6px;">
                                <p style="margin: 4px 0;">Subtotal: <b>₦${calculatedItemsPrice.toLocaleString()}</b></p>
                                <p style="margin: 4px 0;">Shipping Fee: <b>₦${shippingPrice.toLocaleString()}</b></p>
                                ${discountAmount > 0 ? `<p style="margin: 4px 0; color: #dc2626;">Discount: <b>-₦${discountAmount.toLocaleString()}</b></p>` : ''}
                                <h3 style="margin: 10px 0 0 0; color: #0f172a;">Total Amount: ₦${totalPrice.toLocaleString()}</h3>
                            </div>
                        </div>
                    `
                });
            } catch (adminMailErr) {
                console.error('Admin notification email failed:', adminMailErr);
            }
        }

        // Handle Payment Gateway Response
        if (paymentMethod === 'paystack') {
            try {
                const paystackAmount = order.totalPrice * 100;

                const paystackResponse = await axios.post(
                    'https://api.paystack.co/transaction/initialize',
                    {
                        email: user.email,
                        amount: paystackAmount,
                        callback_url: `${process.env.CLIENT_URL}/order-received`,
                        metadata: { orderId: order._id }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const { authorization_url, reference } = paystackResponse.data.data;

                order.paystackReference = reference;
                await order.save();

                return res.status(201).json({
                    success: true,
                    data: order,
                    authorization_url,
                    reference
                });

            } catch (error) {
                console.error('Paystack Init Error:', error);
                return res.status(500).json({ success: false, message: 'Could not initialize Paystack' });
            }
        }

        // Response for Non-Paystack / COD orders
        return res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        next(error);
    }
};

// User checking their own orders
export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id || (req as any).user._id;

    try {
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('orderItems.product', 'image name price');

        res.status(200).json({ success: true, data: orders });
    } catch (error) { next(error); }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
    const orderId = req.params.id || req.params._id;

    // Check if user is authenticated
    const currentUser = (req as any).user;
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Extract user ID safely (handling both _id and id formats)
    const reqUserId = currentUser._id?.toString() || currentUser.id?.toString();
    const reqUserRole = currentUser.role;

    try {
        const order = await Order.findById(orderId).populate(
            'deliveryPerson',
            'name email'
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Safely extract order owner ID (handles populated object or raw ObjectId string)
        const orderUserId = order.user?._id?.toString() || order.user?.toString();

        // Check if current user is the assigned delivery driver
        const deliveryPersonId = order.deliveryPerson?._id?.toString() || order.deliveryPerson?.toString();

        const isOwner = Boolean(orderUserId && reqUserId && reqUserId === orderUserId);
        const isAdmin = reqUserRole === 'admin';
        const isDeliveryPerson = Boolean(deliveryPersonId && reqUserId && reqUserId === deliveryPersonId);

        // Block unauthorized access
        if (!isOwner && !isAdmin && !isDeliveryPerson) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        return res.status(200).json({ success: true, data: order });

    } catch (error: any) {
        console.error('Error fetching order:', error);

        // Handle invalid Mongoose ObjectId format
        if (error.name === 'CastError' || error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(500).json({ success: false, message: 'Server error fetching order' });
    }
};

// Track a specific order
export const trackOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('deliveryPerson', 'name phone')
            .select('user orderStatus paymentStatus createdAt updatedAt shippingAddress itemsPrice shippingPrice discountAmount totalPrice deliveryPerson');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const userId = (req as any).user._id?.toString() || (req as any).user.id;
        const userRole = (req as any).user.role;

        // Security check
        if (order.user.toString() !== userId && userRole !== 'admin' && userRole !== 'manager') {
            return res.status(403).json({ success: false, message: 'Not authorized to track this order' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// Fetch list of available drivers (For Admin/Manager Dropdown)
export const getAvailableDrivers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const drivers = await User.find({ role: 'delivery' }).select('_id name email phone');
        res.status(200).json({ success: true, data: drivers });
    } catch (error) {
        next(error);
    }
};

// Admin/Manager assigning delivery driver
export const assignDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const { deliveryPersonId } = req.body;

        if (!deliveryPersonId) {
            return res.status(400).json({ success: false, message: 'Delivery person ID is required.' });
        }

        // Verify driver exists and has delivery role
        const driver = await User.findOne({ _id: deliveryPersonId, role: 'delivery' });

        if (!driver) {
            return res.status(404).json({ success: false, message: 'Driver not found or invalid role.' });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                deliveryPerson: deliveryPersonId,
                orderStatus: 'Out for Delivery'
            },
            { returnDocument: 'after' }
        )
            .populate('deliveryPerson', 'name phone email')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Notify the customer via email that their order is out for delivery
        if (order.user) {
            try {
                const customer = order.user as unknown as { name: string; email: string };

                const driver = order.deliveryPerson as unknown as { name: string; email: string };

                if (customer.email) {
                    await sendEmail({
                        email: customer.email,
                        subject: 'Your YLink Order is Out for Delivery',
                        message: `Hi ${customer.name || 'Customer'}, your order has been dispatched and is out for delivery! Your delivery driver is ${driver.name || 'a YLink driver'}. Please provide them with your delivery verification code: <b>${order.deliveryVerificationCode}</b>.`
                    });
                }
            } catch (emailError) {
                // Log email error so a mail server failure doesn't crash an otherwise successful driver assignment
                console.error('Email dispatch failed:', emailError);
            }
        }

        // Notify the assigned driver via email
        if (order.deliveryPerson) {
            try {
                const driver = order.deliveryPerson as unknown as { name: string; email: string };
                if (driver.email) {
                    await sendEmail({
                        email: driver.email,
                        subject: 'Your YLink Order is Out for Delivery',
                        message: `Hi ${driver.name || 'Dispatcher'}, you're been assigned to deliver an order! Pls check your dashboard for details.`
                    });
                }
            } catch (emailError) {
                // Log email error so a mail server failure doesn't crash an otherwise successful driver assignment
                console.error('Email dispatch failed:', emailError);
            }
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        return res.status(500).json({ message: 'Error assigning driver', error });
    }
};

// Admin: Update Order Status and Assign Driver
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Prevent admin from manually setting "Delivered" if it requires OTP
        if (orderStatus === 'Delivered' && order.orderStatus !== 'Delivered') {
            return res.status(400).json({
                success: false,
                message: 'Orders must be marked delivered by the driver using the OTP.'
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;

        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order', error });
    }
};

// Paystack Webhook (Automated Payment Confirmation)
export const handlePaystackWebhook = async (req: Request, res: Response) => {
    try {
        // Verify Paystack HMAC SHA512 Signature
        const secret = process.env.PAYSTACK_SECRET_KEY as string || '';
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).send('Invalid signature');
        }

        // Send immediate 200 OK to Paystack to acknowledge receipt
        res.status(200).send('Webhook received successfully');

        const { event, data } = req.body;

        // Process successful payment event
        if (event === 'charge.success') {
            const { reference, metadata } = data;

            // Find order by Paystack reference or metadata ID
            const order = await Order.findOne({
                $or: [{ paystackReference: reference }, { _id: metadata?.orderId }]
            });

            if (order && order.paymentStatus !== 'Completed') {
                // Update Order Status
                order.paymentStatus = 'Completed';
                order.orderStatus = 'Processing';
                await order.save();

                console.log(`✅ Order ${order._id} successfully marked as PAID via Webhook.`);
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Webhook error', error });
    }
};

// Verify Paystack payment from frontend redirect
export const verifyPaystackPayment = async (req: Request, res: Response) => {
    try {
        const rawReference = req.query.reference;

        const reference =
            typeof rawReference === 'string'
                ? rawReference
                : Array.isArray(rawReference)
                    ? rawReference[0]
                    : undefined;

        if (!reference) {
            return res.status(400).json({ message: 'Payment reference is required' });
        }

        let order = await Order.findOne({ paystackReference: reference });

        if (!order) {
            return res.status(404).json({ message: 'Order not found for this reference' });
        }

        // If Webhook already verified and fulfilled the order
        if (order.paymentStatus === 'Completed') {
            return res.status(200).json({ success: true, data: order });
        }

        // Verify with Paystack API directly
        const paystackRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const paystackData = paystackRes.data.data;

        if (paystackData.status === 'success') {
            order.paymentStatus = 'Completed';
            order.orderStatus = 'Processing';
            await order.save();

            // Deduct inventory
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stockQuantity: -item.quantity }
                });
            }

            // Clear user cart
            await Cart.findOneAndUpdate(
                { user: order.user },
                { $set: { items: [] } }
            );

            // Fetch user for email notification
            const user = await User.findById(order.user);
            if (user && user.email) {
                await sendEmail({
                    email: user.email,
                    subject: 'YLink Order Confirmed - Your Delivery Code',
                    message: `
                        <h2>Your order is confirmed!</h2>
                        <p>Thank you for shopping with YLink Tech.</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
                            <p style="margin: 0;">Your delivery verification code:</p>
                            <h1 style="letter-spacing: 5px; color: #333;">${order.deliveryVerificationCode}</h1>
                        </div>
                    `
                }).catch((err) => console.error('Email sending failed:', err));
            }

            return res.status(200).json({ success: true, data: order });
        } else {
            order.paymentStatus = 'Failed';
            await order.save();
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

    } catch (error) {
        console.error('Frontend Verification Error:', error);
        res.status(500).json({ message: 'Failed to verify payment with Paystack' });
    }
};
