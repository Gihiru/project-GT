import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changePassword, getAllUsers, deleteUser, updateUserStatus } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, getUserProfile)
userRouter.post('/update', authUser, updateUserProfile)
userRouter.post('/change-password', authUser, changePassword)

// Admin routes
userRouter.post('/admin/all', adminAuth, getAllUsers)
userRouter.post('/admin/delete', adminAuth, deleteUser)
userRouter.post('/admin/status', adminAuth, updateUserStatus)

export default userRouter;