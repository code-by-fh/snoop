import Listing from '../models/Listing.js';

export const addFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.isFavorite = true;
    await listing.save();

    res.json({ listingId: listing.id, isFavorite: listing.isFavorite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    listing.isFavorite = false;
    await listing.save();

    res.json({ listingId: listing.id, isFavorite: listing.isFavorite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const listings = await Listing.find({ isFavorite: true });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
