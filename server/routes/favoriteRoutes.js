import express from 'express';
import { addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:listingId', authMiddleware, addFavorite);
router.delete('/:listingId', authMiddleware, removeFavorite);

export default router;
