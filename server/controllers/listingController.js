import logger from '#utils/logger.js';
import Favorite from '../models/Favorite.js';
import Job from '../models/Job.js';
import Listing from '../models/Listing.js';
import ListingView from '../models/ListingView.js';
import { getAvailableProviders } from '../provider/index.js';
import { getTrackingUrl } from '../tracking/listing.js';

const providersMap = getAvailableProviders();

export const createListing = async (req, res) => {
  try {
    const {
      title,
      price,
      location,
      area,
      rooms,
      description,
      imageUrl,
      url,
      source,
      job
    } = req.body;

    const jobExists = await Job.findOne({
      _id: job,
      user: req.user.id
    });

    if (!jobExists) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const listing = new Listing({
      title,
      price,
      location,
      area,
      rooms,
      description,
      imageUrl,
      url,
      source,
      job
    });

    await listing.save();

    await Job.findByIdAndUpdate(job);

    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const {
      jobId,
      minPrice,
      maxPrice,
      minRooms,
      minArea,
      location,
      page = 1,
      limit = 10,
      searchTerm,
      sortBy = 'date',
      sortOrder = 'desc',
      providerIds,
      showFavorites = 'all', // 'all' | 'favorites' | 'nonfavorites'
      viewState = 'all'      // 'all' | 'viewed' | 'unviewed'
    } = req.query;

    const jobFilter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const jobs = await Job.find(jobFilter);
    const jobIds = jobs.map(job => job.id.toString());

    if (!jobs.length) {
      return res.json({ listings: [], total: 0, page: 1, totalPages: 0, providers: [] });
    }

    const filter = { jobId: { $in: jobIds } };

    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (minRooms) filter.rooms = { $gte: parseInt(minRooms) };
    if (minArea) filter.area = { $gte: parseInt(minArea) };
    if (location) filter['location.city'] = { $regex: location, $options: 'i' };
    if (jobId) filter.job = jobId;
    if (providerIds && providerIds.length > 0) filter.providerId = providerIds;

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { 'location.city': { $regex: searchTerm, $options: 'i' } },
        { providerId: { $regex: searchTerm, $options: 'i' } },
        { providerName: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const [favorites, viewedListings] = await Promise.all([
      Favorite.find({ userId: req.user.id }),
      ListingView.find({ userId: req.user.id }).select('listingId')
    ]);

    const favoriteIds = favorites.map(fav => fav.listingId.toString());
    const viewedIds = viewedListings.map(v => v.listingId.toString());

    const idFilters = [];

    if (showFavorites === 'favorites') {
      idFilters.push({ $in: favoriteIds });
    } else if (showFavorites === 'nonfavorites') {
      idFilters.push({ $nin: favoriteIds });
    }

    if (viewState === 'viewed') {
      idFilters.push({ $in: viewedIds });
    } else if (viewState === 'unviewed') {
      idFilters.push({ $nin: viewedIds });
    }

    if (idFilters.length > 0) {
      filter._id = mergeCombinedFilters(idFilters);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions =
      sortBy === 'price'
        ? { price: sortOrder === 'asc' ? 1 : -1 }
        : { createdAt: sortOrder === 'asc' ? 1 : -1 };

    const [listings, total, allProviderIds] = await Promise.all([
      Listing.find(filter).skip(skip).limit(parseInt(limit)).sort(sortOptions),
      Listing.countDocuments(filter),
      Listing.distinct('providerId'),
    ]);

    const providers = allProviderIds
      .filter(Boolean)
      .map((id) => ({
        providerId: id,
        providerName:
          providersMap[id]?.metaInformation?.name ||
          providersMap[id]?.metaInformation?.id ||
          id,
      }))
      .sort((a, b) => a.providerName.localeCompare(b.providerName));

    const extendedListings = listings.map(listing => ({
      ...listing.toObject(),
      isFavorite: favoriteIds.includes(listing.id),
      viewed: viewedIds.includes(listing.id),
      trackingUrl: getTrackingUrl(listing.id, req.user.id),
    }));

    res.json({
      listings: extendedListings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      providers,
    });
  } catch (error) {
    logger.error(error, 'Error getting listings:');
    res.status(500).json({ message: error.message });
  }
};

function mergeCombinedFilters(idFilters) {
  let includeIds = null;
  let excludeIds = null;

  for (const f of idFilters) {
    if (f.$in) {
      includeIds = includeIds
        ? includeIds.filter((id) => f.$in.includes(id))
        : [...f.$in];
    } else if (f.$nin) {
      excludeIds = excludeIds
        ? [...new Set([...excludeIds, ...f.$nin])]
        : [...f.$nin];
    }
  }

  if (includeIds && excludeIds) {
    return { $in: includeIds.filter((id) => !excludeIds.includes(id)) };
  } else if (includeIds) {
    return { $in: includeIds };
  } else if (excludeIds) {
    return { $nin: excludeIds };
  } else {
    return {};
  }
}

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const job = await Job.findById(listing.job);

    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();

    await Job.findByIdAndUpdate(listing.job, {
      $inc: {
        totalListings: -1,
        newListings: -1
      }
    });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

