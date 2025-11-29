import { expect } from 'chai';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import Listing from '../../models/Listing.js';
import { getAvailableProviders } from '../../provider/index.js';
import * as similarityCache from '../../services/runtime/similarity-check/similarityCache.js';
import { mockJobData } from '../mocks/mockJob.js';
import { get } from '../mocks/mockNotification.js';
import { logObject, mockJobRuntime, providerConfig, validateListings } from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEBUG = false;
const providerToRun = ["regionalimmobilien24"]; // define which providers to run or leave empty for all

describe('#Provider Integration Tests', () => {
  const providers = Object.fromEntries(
    Object.entries(getAvailableProviders()).filter(([providerId]) =>
      providerToRun.length === 0 || providerToRun.includes(providerId)
    )
  );

  const platformStatus = {};

  after(() => {
    similarityCache.stopCacheCleanup();
    const filePath = path.join(__dirname, "status.json");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(platformStatus, null, 2));
  });

  // test each provider
  for (const [providerId, provider] of Object.entries(providers)) {
    describe(`## ${provider.metaInformation?.name || providerId}`, () => {
      before(() => {
        provider.init(providerConfig[providerId], []);
      });

      it(`should successfully execute provider '${providerId}'`, async () => {
        const job = mockJobData();
        const JobRuntime = await mockJobRuntime();

        const runtime = new JobRuntime(provider, job, provider.metaInformation.id, []);
        let listings;
        let testPassed = false;

        try {
          listings = await runtime.execute();

          // --- Listings ---
          expect(listings)
            .to.be.an('array')
            .that.is.not.empty;

          const listingExpectedFields = Object.keys(provider.config.crawlFields);

          validateListings(
            DEBUG,
            listings,
            (listing) => {
              // validate mogoose schema
              const doc = new Listing(listing);
              const validationError = doc.validateSync();
              if (validationError) {
                const ignoredFields = ["jobId"];
                const fieldErrors = Object.keys(validationError.errors).filter(
                  (field) => !ignoredFields.includes(field)
                );
                expect(fieldErrors, `Schema validation failed for fields: ${fieldErrors.join(", ")}`).to.be.empty;
              }

              // validate fields
              expect(listing).to.include.keys(listingExpectedFields);

              listingExpectedFields.forEach((field) => {
                expect(listing[field], field).to.exist;
              });

              const baseUrl = provider.metaInformation.baseUrl;
              const imageBaseUrl = provider.metaInformation.imageBaseUrl || baseUrl;
              if (listing.imageUrl) expect(listing.imageUrl).to.include(new URL(imageBaseUrl).hostname);
              if (listing.url) expect(listing.url).to.include(new URL(baseUrl).hostname);
            },
            0.3,
            `Listings (${providerId})`
          );

          // --- Notification ---
          const notificationObj = get();
          if (DEBUG) {
            logObject(`Notification Object (${providerId})`, notificationObj); // DEBUG
          }

          expect(notificationObj)
            .to.be.an('object')
            .that.has.all.keys(['serviceName', 'listings', 'job']);

          expect(notificationObj.serviceName).to.equal(provider.metaInformation.name);

          expect(notificationObj.listings)
            .to.be.an('array')
            .that.is.not.empty;

          validateListings(
            DEBUG,
            notificationObj.listings,
            (notify) => {
              listingExpectedFields.forEach((field) => {
                expect(notify[field]).to.exist;
              });
              const baseUrl = provider.metaInformation.baseUrl;
              const imageBaseUrl = provider.metaInformation.imageBaseUrl || baseUrl;
              if (notify.imageUrl) expect(notify.imageUrl).to.include(new URL(imageBaseUrl).hostname);
              if (notify.url) expect(notify.url).to.include(new URL(baseUrl).hostname);
            },
            0.3,
            `Notifications (${providerId})`
          );

          testPassed = true;
        } catch (err) {
          testPassed = false;
          throw err;
        } finally {
          platformStatus[providerId] = testPassed;
        }
      });
    });
  }
});
