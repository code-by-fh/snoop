import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
    _id: { type: String, default: uuidv4 },
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
  },
  lastRun: {
    type: Date
  },
  processingTime: {
    type: Number
  },
  runtimeErrors: [{
    providerId: String,
    providerName: String,
    providerUrl: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
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

JobSchema.statics.updateLastRun = async function (jobId, startTime, providerId) {
  const now = new Date();
  const update = {
    lastRun: now,
    processingTime: startTime ? Date.now() - startTime : undefined
  };

  await this.updateOne(
    { _id: jobId },
    { $set: update }
  );

  if (providerId) { 
    await this.updateOne(
      { _id: jobId },
      { $pull: { errors: { providerId } } }
    );
  }

  return now;
};

JobSchema.statics.addListingsIds = async function (listingIds, jobId, providerObjectId) {
  const result = await this.updateOne(
    { _id: jobId },
    { $addToSet: { "providers.$[elem].listings": { $each: listingIds } } },
    { arrayFilters: [{ "elem._id": providerObjectId }] }
  );

  return result.modifiedCount > 0;
};

JobSchema.statics.getActiveJobs = async function () {
  const jobs = await this.find({ isActive: true });
  return jobs.map(job => job.toJSON());
};

JobSchema.statics.getAllJobs = async function (filter) {
  const jobs = await this.find(filter)
    .populate({
      path: 'providers.listings',
      model: 'Listing'
    });
  return jobs.map(job => job.toJSON());
};

JobSchema.statics.getJob = async function (id, filter = {}) {
  const job = await this.getJobRaw({ _id: id, ...filter });
  return job?.toJSON() || null;
};


JobSchema.statics.getJobRaw = async function (id, filter = {}) {
  const job = await this.findOne({ _id: id, ...filter })
    .populate({
      path: 'providers.listings',
      model: 'Listing'
    });
  return job ||null;
};

JobSchema.statics.addProviderError = async function (jobId, error) {
  await this.updateOne(
    { _id: jobId },
    { $pull: { runtimeErrors: { providerId: error.providerId } } }
  );

  await this.updateOne(
    { _id: jobId },
    { $push: { runtimeErrors: error } }
  );

  return true;
};

export default mongoose.model('Job', JobSchema);
