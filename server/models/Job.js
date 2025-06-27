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
  const job = await this.findById(jobId);
  if (!job) return false;
  const provider = job.providers.find(p => p.id === providerId);
  if (!provider) return false;
  provider.listings = [...provider.listings, ...listingIds];
  await job.save();
  return true;
};

JobSchema.statics.getActiveJobs = async function () {
  return await this.find({ isActive: true })
    .lean()
    .then(jobs => jobs.map(job => {
      job.id = job._id;
      delete job._id;
      delete job.__v;
      return job;
    }));
};

JobSchema.statics.getAllJobs = async function (filter) {
  const jobs = await this.find(filter)
    .populate({
      path: 'providers.listings',
      model: 'Listing'
    })
    .lean();

  return jobs.map(job => {
    job.id = job._id;
    delete job._id;
    delete job.__v;
    return job;
  });
};

JobSchema.statics.getJob = async function (id, filter = {}) {
  const job = await this.findById(id, filter).lean();

  if (!job) return null;

  job.id = job._id;
  delete job._id;
  delete job.__v;
  return job;
};

JobSchema.statics.getJobWithListings = async function (id, filter = {}) {

  const job = await this.findById(id, filter)
    .populate({
      path: 'providers.listings',
      model: 'Listing'
    })
    .lean();

  if (!job) return null;

  job.id = job._id;
  delete job._id;
  delete job.__v;
  return job;
};

export default mongoose.model('Job', JobSchema);
