import esmock from 'esmock';
import { readFile } from 'fs/promises';
import logger from "../utils/logger.js";
import { send } from './mocks/mockNotification.js';

export const providerConfig = JSON.parse(await readFile(new URL('./provider/testProvider.json', import.meta.url)));

export const mockJobRuntime = async () => {
  return await esmock('../services/runtime/JobRuntime', {
    '../models/Job.js': (await import('./mocks/mockJob.js')).default,
    '../models/Listing.js': (await import('./mocks/mockListing.js')).default,
    '../notification/notify.js': {
      send,
    },
  });
};

export function logObject(label, obj) {
  console.log(`\n=== ${label} ===`);
  console.dir(obj, { depth: null, colors: true });
  console.log(`=== /${label} ===\n`);
}

export function validateListings(debug, items, validateFn, threshold = 0.3, label = 'Items') {
  const invalid = [];

  items.forEach((item, i) => {
    try {
      validateFn(item);
    } catch (err) {
      if (debug) {
        logger.error(JSON.stringify(item));
        logger.error(err, err.stack);
      }
      invalid.push({
        index: i,
        url: item.url ?? '(missing url)',
        error: err.message
      });
    }
  });

  const ratio = invalid.length / items.length;

  if (ratio > threshold) {
    console.error(`❌ ${invalid.length}/${items.length} ${label} (${(ratio * 100).toFixed(1)}%) fehlerhaft`);
    console.table(invalid.slice(0, 5));
    throw new Error(`Zu viele fehlerhafte ${label}: ${(ratio * 100).toFixed(1)}%`);
  } else if (invalid.length > 0) {
    console.warn(`⚠️ ${invalid.length}/${items.length} ${label} (${(ratio * 100).toFixed(1)}%) fehlerhaft`);
  }

  return invalid;
}
