import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ListingSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4
  },
  title: { type: String, required: true, trim: true },
  price: { type: Number },
  location: {
    lat: Number,
    lng: Number,
    street: String,
    city: String,
    district: String,
    zipcode: String,
    state: String,
    country: String,
    fullAddress: String
  },
  size: Number,
  rooms: Number,
  description: String,
  imageUrl: String,
  url: { type: String, required: true },
  jobId: { type: String, ref: 'Job', required: true },
  providerId: { type: String, required: true },
  providerName: { type: String, required: true },
  viewedBy: [{ type: String, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

ListingSchema.statics.saveListings = async function (newListings, jobId) {
  const savedListings = [];

  for (const listingData of newListings) {
    const filter = { _id: listingData.id || uuidv4(), jobId };
    const update = { ...listingData, jobId };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const listing = await this.findOneAndUpdate(filter, update, options);
    savedListings.push(listing);
  }

  return savedListings;
};

ListingSchema.statics.markAsViewed = async function (listingId, userId) {
  if (!listingId || !userId) throw new Error("ListingId und UserId müssen angegeben werden");

  const result = await this.updateOne(
    { _id: listingId },
    { $addToSet: { viewedBy: userId } }
  );

  return result.modifiedCount > 0;
};

export default mongoose.model('Listing', ListingSchema);
