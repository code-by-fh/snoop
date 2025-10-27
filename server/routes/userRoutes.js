import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import demoMiddleware from '../middleware/demoMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserProfile);
router.patch('/', demoMiddleware, authMiddleware, updateUserProfile);

export default router;
