import { readFile } from 'fs/promises';
import esmock from 'esmock';
import { send } from './mocks/mockNotification.js';

export const providerConfig = JSON.parse(await readFile(new URL('./provider/testProvider.json', import.meta.url)));

export const mockFredy = async () => {
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