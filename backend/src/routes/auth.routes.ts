// import { Router } from 'express';
// import { register, login, logout, forgotPassword, resetPassword, resendVerificationCode } from '../controllers/auth.controller';
// import { resendCodeLimiter } from '../middlewares/rateLimiter.middleware';

// const router = Router();

// // Public auth endpoints
// router.post('/resend-code', resendCodeLimiter, resendVerificationCode);
// router.post('/register', register);
// router.post('/login', login);
// router.post('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

// export default router;

import { Router } from 'express';
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    resendVerificationCode,
    verifyEmailCode
} from '../controllers/auth.controller';
import { resendCodeLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// Email Verification Endpoints
router.post('/resend-code', resendCodeLimiter, resendVerificationCode);
router.post('/verify-code', verifyEmailCode);

// Authentication Endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Password Management Endpoints
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

export default router;