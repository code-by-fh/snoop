import { expect } from 'chai';
import * as provider from '../../provider/wohungsboerse.js';
import * as similarityCache from '../../services/runtime/similarity-check/similarityCache.js';
import { get } from '../mocks/mockNotification.js';
import { logObject, mockJobRuntime, providerConfig } from '../utils.js';

describe('#wohungsboerse testsuite()', () => {

  after(() => {
    similarityCache.stopCacheCleanup();
  });

  before(() => {
    provider.init(providerConfig.wohungsboerse, []);
  });

  it('should successfully execute wohungsboerse provider', async () => {
    const JobRuntime = await mockJobRuntime();

    const listings = await new JobRuntime(
      provider,
      {},
      provider.metaInformation.id,
      []
    ).execute();

    expect(listings)
      .to.be.an('array')
      .that.is.not.empty;

    listings.forEach((listing) => {
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
      expect(listing.imageUrl).to.include(provider.metaInformation.baseUrl);
      expect(listing.url).to.include(provider.metaInformation.baseUrl);
    });

    const notificationObj = get();
    logObject('Notification Object', notificationObj);

    expect(notificationObj)
      .to.be.an('object')
      .that.has.all.keys(['serviceName', 'newListings', 'notificationAdapters', 'jobId']);

    expect(notificationObj.serviceName).to.equal(provider.metaInformation.name);

    expect(notificationObj.newListings)
      .to.be.an('array')
      .that.is.not.empty;

    notificationObj.newListings.forEach((notify) => {
      expect(notify.id).to.be.a('string').and.not.empty;
      expect(notify.price).to.be.a('number').above(0);
      expect(notify.size).to.be.a('number').above(0);
      expect(notify.rooms).to.be.a('number').above(0);
      expect(notify.imageUrl).to.include(provider.metaInformation.baseUrl);
      expect(notify.title).to.be.a('string').and.not.empty;
      expect(notify.url).to.include(provider.metaInformation.baseUrl);
    });
  });
});
