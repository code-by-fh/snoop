import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Listing from './Listing.js'
import { leanTransformPlugin } from './leanTransformPlugin.js';

const JobSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  providers: [{
    id: String,
    listings: [{
      type: mongoose.Schema.Types.String,
      ref: 'Listing'
    }],
    url: String
  }],
  notificationAdapters: [{
    id: String,
    fields: {
      type: Object,
      default: {}
    }
  }],
  blacklistTerms: [String],
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


JobSchema.statics.addListingsIds = async function (listingIds, jobId, providerId) {
  const result = await this.updateOne(
    { _id: jobId, 'providers.id': providerId },
    { $addToSet: { 'providers.$.listings': { $each: listingIds } } }
  );
  return result.modifiedCount > 0;
};

JobSchema.statics.getActiveJobs = async function () {
  return await this.find({ isActive: true }).lean();
};

JobSchema.statics.getAllJobs = async function (filter) {
  return await this.find(filter).lean();
};

JobSchema.statics.getJob = async function (id, filter = {}) {
  return await this.findOne({ _id: id, ...filter }).lean();
};

JobSchema.statics.getJobWithListings = async function (id, filter = {}) {
const job = await this.findOne({ _id: id, ...filter }).lean();

for (const provider of job.providers) {
  provider.listings = await Listing.find({
    _id: { $in: provider.listings }
  }).lean();
}

return job;
};

JobSchema.plugin(leanTransformPlugin);


export default mongoose.model('Job', JobSchema);
