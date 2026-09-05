import {
    createContext,
    useState,
    useEffect,
    type ReactNode,
    useContext,
    useCallback,
    type SetStateAction,
    type Dispatch
} from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

export interface Address {
    _id: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'manager' | 'admin' | 'delivery';
    bonusPoints: number;
    referralCode?: string;
    referredBy?: string;
    addresses?: Address[];
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        phone: string,
        password: string,
        referredByCode?: string
    ) => Promise<{ success: boolean; email: string }>;
    verifyEmail: (email: string, code: string) => Promise<void>;
    resendVerificationCode: (email: string) => Promise<void>;
    forgetPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
    deleteAccount: () => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(() => {
        const cachedUser = localStorage.getItem('user');
        return cachedUser ? JSON.parse(cachedUser) : null;
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const persistUserSession = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.role) {
            localStorage.setItem('role', userData.role);
        }
    };

    const clearUserSession = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    // Check authentication status on component mount
    const checkAuth = useCallback(async () => {
        try {
            const response = await API.get('/users/profile');
            const freshUserData: User = response.data.data;
            persistUserSession(freshUserData);
        } catch (error: any) {
            clearUserSession();
            if (error?.response?.status !== 401) {
                console.error('Authorization check error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Authentication Methods
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await API.post('/auth/login', { email, password });
            if (!response?.data) throw new Error('Authentication response was empty.');

            await checkAuth();
            showToast('Logged in successfully!', 'success');
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Registration Method
    const register = async (
        name: string,
        email: string,
        phone: string,
        password: string,
        referredByCode?: string
    ) => {
        setIsLoading(true);
        try {
            const response = await API.post('/auth/register', {
                name,
                email,
                phone,
                password,
                referredByCode
            });
            if (!response?.data) throw new Error('Registration response was empty.');

            showToast('Registration successful! Check your email for your code.', 'success');
            return { success: true, email };
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Email Verification Method
    const verifyEmail = async (email: string, code: string) => {
        setIsLoading(true);
        try {
            const response = await API.post('/auth/verify-code', { email, code });
            if (!response?.data) throw new Error('Verification response was empty.');

            showToast('Email verified successfully!', 'success');
            await checkAuth();
        } catch (error) {
            console.error('Email Verification Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Resend Verification Code Method
    const resendVerificationCode = async (email: string) => {
        try {
            const response = await API.post('/auth/resend-code', { email });
            showToast(response.data?.message || 'New verification code sent!', 'success');
        } catch (error) {
            console.error('Resend Code Error:', error);
            throw error;
        }
    };

    // Password Reset Methods
    const forgetPassword = async (email: string) => {
        const response = await API.post('/auth/forgot-password', { email });
        showToast(response.data?.message || 'Password reset link sent to your email.', 'success');
    };

    // Reset Password Method
    const resetPassword = async (resettoken: string, password: string) => {
        const response = await API.put(`/auth/reset-password/${resettoken}`, { password });
        showToast(response.data?.message || 'Password reset successful! Please log in.', 'success');
    };

    // Update Profile Method
    const updateProfile = async (payload: UpdateProfilePayload) => {
        setIsLoading(true);
        try {
            const response = await API.put('/users/profile', payload);
            if (!response?.data) throw new Error('Failed to update profile.');

            const updatedUser: User = response.data.data;
            setUser((prevUser) => {
                if (!prevUser) return updatedUser;
                const mergedUser: User = {
                    ...prevUser,
                    ...updatedUser,
                    addresses: updatedUser.addresses || prevUser.addresses
                };
                localStorage.setItem('user', JSON.stringify(mergedUser));
                return mergedUser;
            });
        } catch (error) {
            console.error('Update Profile Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        showToast('Logging out...');
        try {
            await API.post('/auth/logout');
            showToast('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error on backend:', error);
        } finally {
            clearUserSession();
            navigate('/');
        }
    };

    const deleteAccount = async () => {
        try {
            await API.delete('/users/profile');
            showToast('Account deleted successfully.', 'success');
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        } finally {
            await logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                setIsLoading,
                login,
                register,
                verifyEmail,
                resendVerificationCode,
                forgetPassword,
                resetPassword,
                updateProfile,
                deleteAccount,
                checkAuth,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}