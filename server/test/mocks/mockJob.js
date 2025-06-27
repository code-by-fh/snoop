export const addListingsIds = async () => true;

export const create = async (job) => ({
  ...job,
  _id: 'mock-job-id',
  save: async () => true
});

export const updateOne = async () => ({ acknowledged: true });

const Job = {
  addListingsIds,
  create,
  updateOne
};

export default Job;
