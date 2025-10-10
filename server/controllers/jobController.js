import Job from '../models/Job.js';
import Listing from '../models/Listing.js';
import { runJob } from "../services/runtime/JobRunner.js";
import { addOrUpdateCommonAttributes } from "../utils/jobUtils.js";
import logger from "../utils/logger.js";

export const createJob = async (req, res) => {
  try {
    logger.debug({ jobData: req.body }, 'Job data received:');
    const { name, isActive, providers = [], notificationAdapters = [], blacklistTerms = [] } = req.body;

    validateJobData(req.body);

    const job = new Job({
      name,
      isActive,
      user: req.user.id,
      providers,
      notificationAdapters,
      blacklistTerms
    });

    await job.save();

    res.status(201).send();
  } catch (error) {
    logger.error(error, 'Error creating job:');
    res.status(400).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    logger.debug({ jobData: req.body }, 'Fetching jobs with filters:');
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const jobs = await Job.getAllJobs(filter);
    const formattedJobs = jobs.map(job => addOrUpdateCommonAttributes(job, req.user.id));
    res.json(formattedJobs);
  } catch (error) {
    logger.error(error, 'Error fetching jobs:');
    res.status(500).json({ message: error.message });
  }
};


export const getJobById = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const job = await Job.getJob(req.params.id, filter);
    res.json(addOrUpdateCommonAttributes(job, req.user.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const job = await Job.findById(req.params.id, filter);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updateFields = [
      'name',
      'blacklistTerms',
      'isActive'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    // do not overwrite the lisintgs in the providers
    if (Array.isArray(req.body.providers)) {
      job.providers = req.body.providers.map(newProvider => {
        const existing = job.providers.find(p => p.id === newProvider.id);
        return {
          ...(existing ? existing.toObject() : {}),
          ...newProvider,
          listings: existing?.listings || []
        };
      });
    }

    // only save nessesary fields for notification adapters
    if (Array.isArray(req.body.notificationAdapters)) {
      job.notificationAdapters = req.body.notificationAdapters.map(adapter => ({
        id: adapter.id,
        fields: Object.fromEntries(
          Object.entries(adapter.fields || {}).map(([fieldKey, fieldConfig]) => [
            fieldKey,
            { value: fieldConfig.value }
          ])
        )
      }));
    }

    await job.save();
    logger.debug({ jobId: job._id, updatedFields: req.body }, 'Job updated successfully:');
    res.status(200).send();
  } catch (error) {
    logger.error(error, 'Error updating job:');
    res.status(400).json({ message: error.message });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const job = await Job.findById(req.params.id, filter)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Listing.deleteMany({ job: job.id })
    await job.deleteOne();

    res.status(200).send();
  } catch (error) {
    logger.error(error, 'Error deleting job:');
    res.status(500).json({ message: error.message });
  }
};

export const execute = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
  const job = await Job.getJob(req.params.id, filter);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  runJob(job.id);
  res.status(200).json({ message: 'Job execution started' });
}

const validateJobData = (data) => {
  const { name, providers, notificationAdapters } = data;

  if (!name || name.length === 0 || name.length > 100) {
    throw new Error('Name is required and must be between 1 and 100 characters long.');
  }

  if (!providers || providers.length === 0) {
    throw new Error('At least one provider is required.');
  }
  for (const provider of providers) {
    if (!provider.id || !provider.url) {
      throw new Error('Each provider must have an id and a url.');
    }
  }

  if (!notificationAdapters || notificationAdapters.length === 0) {
    throw new Error('At least one notification adapter is required.');
  }
  for (const adapter of notificationAdapters) {
    if (!adapter.id) {
      throw new Error('Each notification adapter must have an id.');
    }
  }
};