import { Request, Response, NextFunction } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail';

const SIGNUP_BONUS_POINTS = 1500;
const REFERRER_BONUS_POINTS = 1000;

// Helper to generate and send JWT securely
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const payload = { id: user._id, role: user.role };

    const expiresIn = (process.env.JWT_EXPIRE ?? '7d') as SignOptions['expiresIn'];

    const options: SignOptions = {
        expiresIn
    };
    const token = sign(payload, secret, options);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, // Prevents XSS
        secure: isProduction, // REQUIRED when sameSite is 'none'(requires HTTPS)
        sameSite: isProduction ? ('none' as const) : ('lax' as const) // Allows cross-domain cookies
    };

    res.status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, referralCode: user.referralCode, isVerified: user.isVerified, bonusPoints: user.bonusPoints }
        });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, password, referredByCode } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Generate referral code & link referrer
        const referralCode = name.slice(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
        let referrerId = null;

        if (referredByCode) {
            const referrer = await User.findOne({ referralCode: referredByCode });
            if (referrer) {
                referrerId = referrer._id;
            }
        }

        // Generate 6-digit verification code and expiration (15 mins)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiry = new Date(Date.now() + 15 * 60 * 1000);

        // Create user with isVerified: false
        const user = await User.create({
            name,
            email,
            phone,
            password,
            referralCode,
            referredBy: referrerId,
            isVerified: false,
            verificationCode: code,
            verificationCodeExpires: codeExpiry,
            lastCodeSentAt: new Date()
        });

        // Send verification email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Your YLink Account',
                message: `Hi ${user.name},\n\nWelcome to YLink! Your 6-digit email verification code is:\n\n${code}\n\nThis code expires in 15 minutes.`
            });
        } catch (emailError) {
            console.error('Registration verification email failed to send:', emailError);
            // Optionally handle email send failure
        }

        // Return response directing user to the verification step
        return res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email for your verification code.',
            email: user.email
        });

    } catch (error) {
        next(error);
    }
};

export const verifyEmailCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified.' });
        }

        if (user.verificationCode !== code || (user.verificationCodeExpires && user.verificationCodeExpires < new Date())) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        if (!user.hasClaimedSignupBonus) {
            user.bonusPoints += SIGNUP_BONUS_POINTS;
            user.hasClaimedSignupBonus = true;

            // Award referral points now that account is verified
            if (user.referredBy) {
                await User.findByIdAndUpdate(user.referredBy, {
                    $inc: { bonusPoints: REFERRER_BONUS_POINTS }
                });
            }
        }
        await user.save();

        // Issue token / log in user now
        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
};

export const resendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account is already verified.' });
        }

        // DB Cooldown Check: Enforce a 60-second delay between resends per user
        const COOLDOWN_MS = 60 * 1000;
        const now = Date.now();

        if (user.lastCodeSentAt) {
            const timeSinceLastSent = now - new Date(user.lastCodeSentAt).getTime();
            if (timeSinceLastSent < COOLDOWN_MS) {
                const secondsRemaining = Math.ceil((COOLDOWN_MS - timeSinceLastSent) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${secondsRemaining} second(s) before requesting a new code.`
                });
            }
        }

        // Generate new 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiry = new Date(now + 15 * 60 * 1000); // 15 mins expiry

        user.verificationCode = code;
        user.verificationCodeExpires = codeExpiry;
        user.lastCodeSentAt = new Date();
        await user.save();

        // Send Email
        await sendEmail({
            email: user.email,
            subject: 'Your New Verification Code',
            message: `Hi ${user.name}, your new verification code is: ${code}. It expires in 15 minutes.`
        });

        return res.status(200).json({
            success: true,
            message: 'A new verification code has been sent to your email.'
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await (user as any).comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Logout Controller
export const logout = async (req: Request, res: Response) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user registered with that email address.' });
        }

        // Get reset token from user schema method
        const resetToken = (user as any).getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Build reset URL for your React frontend
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const message = `
            <h2>
                Password Reset Request
            </h2>
            <p>
                You requested a password reset for your YLink account. Click the button below to set a new password:
            </p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
            </a>
            <p>
                Or copy and paste this link into your browser:
            </p>
            <p>
                <a href="${resetUrl}">
                    ${resetUrl}
                </a>
            </p>
            <p>
                <b>Note:</b> This link expires in 10 minutes.
            </p>
            <p>
                If you did not make this request, please ignore this email.
            </p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'YLink Tech - Password Reset Request',
                message
            });

            res.status(200).json({
                success: true,
                message: 'Password reset link sent to email.'
            });
        } catch (error) {
            // If email fails to send, wipe fields so user can try again
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent. Please try again later.'
            });
        }
    } catch (error) {
        next(error);
    }
};

// Reset Password 
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Hash the incoming token from params to compare with DB version
        const rawToken = req.params.resettoken;
        const resetPasswordTokenValue = Array.isArray(rawToken)
            ? rawToken[0]
            : rawToken;
        const { password } = req.body;
        if (!password || password.length < 6) {
            res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        if (!resetPasswordTokenValue) {
            res.status(400).json({
                success: false,
                message: 'Reset token is missing.'
            });
            return;
        }

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetPasswordTokenValue)
            .digest('hex');


        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token.'
            });
            return;
        }

        // Set new password 
        user.password = password;

        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully. You can now log in with your new password.'
        });
    } catch (error) {
        next(error);
    }
};