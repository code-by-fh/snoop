import logger from '#utils/logger.js';
import Favorite from '../models/Favorite.js';
import Listing from '../models/Listing.js';

export const addFavorite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.id;

        const existing = await Favorite.findOne({ userId, listingId });
        if (existing) {
            return res.status(200).json({ message: 'Already favorited' });
        }

        const favorite = await Favorite.create({ userId, listingId });
        res.json(favorite);
    } catch (err) {
        logger.error(err, 'Error adding favorite:');
        res.status(500).json({ message: err.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.id;

        await Favorite.deleteOne({ userId, listingId });
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        logger.error(err, 'Error removing favorite:');
        res.status(500).json({ message: err.message });
    }
};
