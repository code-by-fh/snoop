let tmpStore = {};

export const send = (serviceName, listings, job) => {
  tmpStore = { serviceName, listings, job };
  return [Promise.resolve()];
};

export const get = () => {
  return tmpStore;
};
