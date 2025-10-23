import User from '../models/User.js';

export const addFavorite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.favoriteListings.includes(listingId)) {
            return res.status(200).json({ message: 'Already favorited' });
        }

        user.favoriteListings.push(listingId);
        await user.save();

        res.json({ favoriteListings: user.favoriteListings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.favoriteListings = user.favoriteListings.filter(id => id !== listingId);
        await user.save();

        res.json({ favoriteListings: user.favoriteListings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('favoriteListings');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.favoriteListings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
