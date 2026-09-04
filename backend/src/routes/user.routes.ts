import { Router } from 'express';
import { getUserProfile, updateProfile, deleteAccount, addAddress, getAddresses, 
    updateAddress, 
    setDefaultAddress, deleteAddress } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect); // Secure all routes below

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteAccount);

// Endpoint: /users/addresses
router.route('/addresses')
    .get(getAddresses)
    .post(addAddress);

// Endpoint: /users/addresses/:id
router.route('/addresses/:id')
    .put(updateAddress)
    .delete(deleteAddress);

// Endpoint: /users/addresses/:id/default
router.put('/addresses/:id/default', setDefaultAddress);

export default router;