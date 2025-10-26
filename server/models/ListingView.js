import mongoose from 'mongoose';

const ListingViewSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    listingId: { type: String, ref: 'Listing', required: true },
    viewedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ListingViewSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.model('ListingView', ListingViewSchema);