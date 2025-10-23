import express from 'express';
import { addFavorite, getFavorites, getUserProfile, removeFavorite } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserProfile);
router.get('/favorites', authMiddleware, getFavorites);
router.post('/favorites/:listingId', authMiddleware, addFavorite);
router.delete('/favorites/:listingId', authMiddleware, removeFavorite);

export default router;
