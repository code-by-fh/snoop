export const addOrUpdateCommonAttributes = (job) => {
  const totalListings = getListings(job).length;
  const newListings = getNewListings(job);

  return {
    ...job,
    totalListings,
    newListings,
  };
};

export const getNewListings = (job) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return getListings(job).filter(listing => {
    const createdAt = new Date(listing.createdAt);
    return createdAt >= today;
  }).length;
}

export const getListings = (job) => {
  return job.providers?.flatMap(p => p.listings || []) || [];
}