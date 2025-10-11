
export const mockJobData = (overrides = {}) => ({
  _id: 'mock-job-id',
  name: 'Mock Job',
  active: true,
  blacklist: [],
  providers: [
    {
      id: 'immonet',
      name: 'Immonet',
      url: 'https://www.immonet.de',
      listings: [],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastRun: null,
  errors: [],
  ...overrides,
});

export const create = async (job) => ({
  ...mockJobData(job),
  save: async () => true,
});

export const updateOne = async (filter, update) => ({
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  filter,
  update,
});

export const addListingsIds = async (jobId, listingIds) => ({
  jobId,
  listingIds,
  acknowledged: true,
});

export const findById = async (id) => mockJobData({ _id: id });
export const updateLastRun = async (jobId, startTime, providerId) => ({
  jobId,
  startTime,
  providerId,
  lastRun: new Date(),
  processingTime: Math.floor(Math.random() * 5000),
});

export const addProviderError = async (jobId, error) => ({
  jobId,
  error,
  acknowledged: true,
});

const Job = {
  create,
  updateOne,
  addListingsIds,
  findById,
  updateLastRun,
  addProviderError,
};

export default Job;
