export const saveListings = async (listings, jobId, providerId) => {
  return listings.map(l => ({
    ...l,
    id: l.id || `listing-id-${Math.random().toString(36).substring(2)}`
  }));
};

const Listing = {
  saveListings
};

export default Listing;
