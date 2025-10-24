import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    listingId: {
        type: String,
        required: true,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

FavoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export default mongoose.model('Favorite', FavoriteSchema);