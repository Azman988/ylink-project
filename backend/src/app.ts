import express, { Application, ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { handlePaystackWebhook } from './controllers/order.controller';

// Import Route Handlers
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import { apiLimiter } from './middlewares/rateLimiter.middleware';

const app: Application = express();

// --- Webhook Route for Paystack , express.raw({ type: 'application/json' }) ---
app.post('/api/webhook/paystack', handlePaystackWebhook);

// --- Security Middlewares ---
// Set secure HTTP headers
app.use(helmet()); 

// Configure CORS for specific frontend origins and allow secure cookies
const allowedOrigins = [
    process.env.CLIENT_URL, 
    'http://localhost:5173' // Local Development
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use('/api/', apiLimiter); // Apply rate limiting to all API routes

// --- Body Parsing ---
app.use(express.json({ limit: '200kb' })); // Limit payload size to prevent payload overflow
app.use(cookieParser());

// --- Route Registration ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// --- Global Error Handler ---
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};


app.use(errorHandler);

export default app;