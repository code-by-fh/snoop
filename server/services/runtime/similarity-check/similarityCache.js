import SimilarityCacheEntry from "./SimilarityCacheEntry.js";

let retention = 5 * 60 * 1000;
let intervalId;
const cache = {};

export const initCache = async (settings) => {
  const intervalInMs = settings.queryInterval * 60 * 1000;

  // Wenn Intervall kleiner gleich Retention, dann halbieren
  retention = intervalInMs <= retention ? Math.floor(intervalInMs / 2) : retention;

  intervalId = setInterval(() => {
    const now = Date.now();
    const keysToBeRemoved = Object.keys(cache).filter(
      (key) => cache[key].getTime() + retention < now
    );

    keysToBeRemoved.forEach((key) => delete cache[key]);
  }, 10000);
};

export const addCacheEntry = (jobId, value) => {
  if (value) {
    cache[jobId] = cache[jobId] || new SimilarityCacheEntry(Date.now());
    cache[jobId].setCacheEntry(value);
  }
};

export const hasSimilarEntries = (jobId, value) => {
  return cache[jobId]?.hasSimilarEntries(value) ?? false;
};

export const stopCacheCleanup = () => {
  clearInterval(intervalId);
};
