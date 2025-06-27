import { expect } from 'chai';
import * as provider from '../../provider/immonet.js';
import * as similarityCache from '../../services/runtime/similarity-check/similarityCache.js';
import { get } from '../mocks/mockNotification.js';
import { logObject, mockFredy, providerConfig } from '../utils.js';

describe('#immonet testsuite()', () => {
  after(() => {
    similarityCache.stopCacheCleanup();
  });

  provider.init(providerConfig.immonet, [], []);

  it('should test immonet provider', async () => {
    let notificationObj;
    try {
      const Fredy = await mockFredy();
      const fredy = new Fredy(provider, null, "test-id", []);
      const listings = await fredy.execute();

      expect(listings).to.be.a('array');
      notificationObj = get();
      logObject('Notification Object (success)', notificationObj);

      expect(notificationObj).to.be.a('object');
      expect(notificationObj.serviceName).to.equal(provider.metaInformation.name);

      notificationObj.payload.forEach((notify) => {
        expect(notify.id).to.be.a('string');
        expect(notify.size).to.be.a('number');
        expect(notify.rooms).to.be.a('number');
        expect(notify.price).to.be.a('number');
        expect(notify.title).to.be.a('string');
        expect(notify.url).to.be.a('string');

        expect(notify.title).to.not.be.empty;
        expect(notify.location).to.not.be.empty;
      });
    } catch (error) {
      if (notificationObj) {
        logObject('Notification Object (failure)', notificationObj);
      }
      throw error;
    }
  });
});
