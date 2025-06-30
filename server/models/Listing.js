import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { leanTransformPlugin } from './leanTransformPlugin.js';

const ListingSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: false
  },
  location: {
    city: {
      type: String,
      required: false
    },
    street: {
      type: String,
      required: false
    },
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    }
  },
  size: {
    type: Number,
    required: false
  },
  rooms: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  },
  job: {
    type: mongoose.Schema.Types.String,
    ref: 'Job',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
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
    const newListing = new this({
      ...listingData,
      job: jobId
    });

    await newListing.save();
    savedListings.push(newListing);
  }

  return savedListings;
};

ListingSchema.plugin(leanTransformPlugin);

export default mongoose.model('Listing', ListingSchema);
