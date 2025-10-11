import { expect } from 'chai';
import * as provider from '../../provider/einsAImmobilien.js';
import * as similarityCache from '../../services/runtime/similarity-check/similarityCache.js';
import { mockJobData } from '../mocks/mockJob.js';
import { get } from '../mocks/mockNotification.js';
import { logObject, mockJobRuntime, providerConfig, validateListings } from '../utils.js';

describe('#einsAImmobilien testsuite()', () => {

  after(() => {
    similarityCache.stopCacheCleanup();
  });

  before(() => {
    provider.init(providerConfig.einsAImmobilien, []);
  });

  it('should successfully execute einsAImmobilien provider', async () => {
    const job = mockJobData();
    const JobRuntime = await mockJobRuntime();

    const listings = await new JobRuntime(
      provider,
      job,
      provider.metaInformation.id,
      []
    ).execute();

    expect(listings)
      .to.be.an('array')
      .that.is.not.empty;

    validateListings(listings, (listing) => {
      expect(listing).to.include.keys([
        'id',
        'price',
        'size',
        'rooms',
        'title',
        'imageUrl',
        'url',
      ]);

      expect(listing.price).to.be.a('number').above(0);
      expect(listing.size).to.be.a('number').above(0);
      expect(listing.rooms).to.be.a('number').above(0);
      expect(listing.title).to.be.a('string').and.not.empty;
      expect(listing.imageUrl).to.include('https://mms.einsAImmobilien.de');
      expect(listing.url).to.include(provider.metaInformation.baseUrl);
    }, 0.3, 'Listings');

    const notificationObj = get();
    logObject('Notification Object', notificationObj);

    expect(notificationObj)
      .to.be.an('object')
      .that.has.all.keys(['serviceName', 'listings', 'job']);

    expect(notificationObj.serviceName).to.equal(provider.metaInformation.name);

    expect(notificationObj.listings)
      .to.be.an('array')
      .that.is.not.empty;

    validateListings(notificationObj.listings, (notify) => {
      expect(notify.id).to.be.a('string').and.not.empty;
      expect(notify.price).to.be.a('number').above(0);
      expect(notify.size).to.be.a('number').above(0);
      expect(notify.rooms).to.be.a('number').above(0);
      expect(notify.imageUrl).to.include('https://mms.einsAImmobilien.de');
      expect(notify.title).to.be.a('string').and.not.empty;
      expect(notify.url).to.include(provider.metaInformation.baseUrl);
    }, 0.3, 'Notifications');
  });
});
