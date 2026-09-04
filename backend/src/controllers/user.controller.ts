import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Address from '../models/Address';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Execute queries concurrently
    const [user, addresses] = await Promise.all([
      // password is omitted automatically by schema select: false
      User.findById(userId).lean(),
      Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 }).lean()
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Clean up sensitive fields before sending
    const { password, resetPasswordToken, resetPasswordExpire, ...userProfile } = user;

    res.status(200).json({
      success: true,
      data: {
        ...userProfile,
        addresses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update Personal Profile Details
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone } = req.body;
    const userId = (req as any).user.id || (req as any).user._id;

    // Fetch user document first
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check 14-day (bi-weekly) update restriction
    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (user.lastProfileUpdate) {
      const lastUpdate = new Date(user.lastProfileUpdate).getTime();
      const timePassed = now - lastUpdate;

      if (timePassed < FOURTEEN_DAYS_MS) {
        const daysRemaining = Math.ceil((FOURTEEN_DAYS_MS - timePassed) / (1000 * 60 * 60 * 24));
        return res.status(400).json({
          success: false,
          message: `Profile updates failed. Try again in ${daysRemaining} day(s).`
        });
      }
    }

    // Apply updates
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    // Update the restriction timestamp
    user.lastProfileUpdate = new Date();

    // Save document (triggers Mongoose schema validators automatically)
    await user.save();

    // Return updated user object without password
    const updatedUser = user.toObject();
    delete (updatedUser as any).password;

    return res.status(200).json({ success: true, data: updatedUser });

  } catch (error) {
    next(error);
  }
};

// De
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete associated addresses
    await Address.deleteMany({ user: req.user.id });

    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ success: true, message: 'Account and associated data successfully terminated.' });
  } catch (error) { next(error); }
};

// Address CRUD
export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If new address is set as default, unset previous default addresses
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: address });
  } catch (error) { next(error); }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) { next(error); }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, data: address });
  } catch (error) { next(error); }
};

export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Unset default on all user addresses
    await Address.updateMany({ user: req.user.id }, { isDefault: false });

    // Set the specified address as default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, data: address });
  } catch (error) { next(error); }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.status(200).json({ success: true, message: 'Address removed' });
  } catch (error) { next(error); }
};