import { decrypt } from '#utils/crypt.js';
import logger from '#utils/logger.js';
import ListingView from '../models/ListingView.js';
import Listing from '../models/Listing.js';

export const registerViewRedirect = async (req, res) => {
    try {
        const { data } = req.query;
        if (!data) return res.status(400).json({ message: 'Missing data' });

        const decrypted = decrypt(decodeURIComponent(data));
        const payload = JSON.parse(decrypted);
        const { listingId, userId } = payload;

        logger.debug(`Tracking listing ${listingId} for user ${userId}`);

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        await ListingView.updateOne(
            { userId, listingId },
            { $set: { viewedAt: new Date() } },
            { upsert: true }
        );

        logger.debug(`Redirecting to ${listing.url}`);

        return res.redirect(listing.url);
    } catch (err) {
        logger.error(err, 'Error tracking listing:');
        return res.status(400).json({ message: 'Invalid data' });
    }
};


export const registerView = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }
        const result = await ListingView.updateOne(
            { userId, listingId: id },
            { $set: { viewedAt: new Date() } },
            { upsert: true }
        );

        if (result.upsertedCount === 0) {
            return res.status(200).json({ message: 'Listing was already viewed' });
        }

        logger.debug(`Listing ${id} was viewed by user ${userId}`);
        return res.status(200).json({ message: 'Listing marked as viewed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
