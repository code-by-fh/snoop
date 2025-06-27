import { expect } from 'chai';
import * as provider from '../../provider/wgGesucht.js';
import * as similarityCache from '../../services/runtime/similarity-check/similarityCache.js';
import { get } from '../mocks/mockNotification.js';
import { logObject, mockFredy, providerConfig } from '../utils.js';

describe('#wgGesucht testsuite()', () => {
  after(() => {
    similarityCache.stopCacheCleanup();
  });

  provider.init(providerConfig.wgGesucht, [], []);

  it('should test wgGesucht provider', async () => {
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
        expect(notify).to.be.a('object');
        expect(notify.id).to.be.a('string');
        expect(notify.title).to.be.a('string');
        expect(notify.url).to.be.a('string');

        expect(notify.title).to.not.be.empty;
        expect(notify.url).to.include(provider.metaInformation.baseUrl);
      });
    } catch (error) {
      if (notificationObj) {
        logObject('Notification Object (failure)', notificationObj);
      }
      throw error;
    }
  });
});
