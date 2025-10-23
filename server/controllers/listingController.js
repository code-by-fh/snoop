import Job from '../models/Job.js';
import Listing from '../models/Listing.js';
import { getAvailableProviders } from '../provider/index.js';

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
    } = req.query;

    const jobFilter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const jobs = await Job.find(jobFilter);
    const jobIds = jobs.map(job => job._id.toString());

    if (!jobs.length) {
      return res.json({
        listings: [],
        total: 0,
        page: 1,
        totalPages: 0,
        providers: [],
      });
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

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sortOptions = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'date') {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const [listings, total, allProviderIds] = await Promise.all([
      Listing.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortOptions),
      Listing.countDocuments(filter),
      Listing.distinct('providerId'),
    ]);

    const providers = allProviderIds
      .filter(Boolean)
      .map(id => ({
        providerId: id,
        providerName:
          providersMap[id]?.metaInformation?.name ||
          providersMap[id]?.metaInformation?.id ||
          id,
      }))
      .sort((a, b) => a.providerName.localeCompare(b.providerName));

    res.json({
      listings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      providers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const job = await Job.findById(listing.job);

    // Verify user owns the job or is an admin
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();

    // Decrement job listings count
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
