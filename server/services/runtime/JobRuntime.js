import Job from "../../models/Job.js";
import Listing from "../../models/Listing.js";
import * as notify from "../../notification/notify.js";
import logger from "../../utils/logger.js";
import { NoNewListingsWarning } from "./errors.js";
import Extractor from './extractor/extractor.js';
import urlModifier from "./queryStringMutator.js";
import * as reverseGeoCoder from "./reverseGeoCoder.js";
import * as similarityCache from "./similarity-check/similarityCache.js";

class JobRuntime {
  /**
   *
   * @param providerConfig the config for the specific provider, we're going to query at the moment
   * @param notificationConfig the config for all notifications
   * @param providerId the id of the provider currently in use
   * @param jobKey key of the job that is currently running (from within the config)
   * @param knownListingsIds the ids of the listings that are already known to the provider
   */
  constructor(providerConfig, notificationConfig, providerId, jobKey, knownListingsIds) {
    this._providerConfig = providerConfig;
    this._notificationConfig = notificationConfig;
    this._providerId = providerId;
    this._jobKey = jobKey;
    this._knownListingsIds = knownListingsIds || [];
  }

  execute() {
    logger.info(`Starting '${this._providerId}' job '${this._jobKey}'`);
    return (
      //modify the url to make sure search order is correctly set
      Promise.resolve(urlModifier(this._providerConfig.url, this._providerConfig.sortByDateParam, this._providerConfig.urlParamsToRemove))
        //scraping the site and try finding new listings
        .then(this._providerConfig.getListings?.bind(this) ?? this._getListings.bind(this))
        //bring them in a proper form (dictated by the provider)
        .then(this._normalize.bind(this))
        //filter listings with stuff tagged by the blacklist of the provider
        .then(this._filter.bind(this))
        //check if new listings available. if so proceed
        .then(this._findNew.bind(this))
        //add geo coordinates to the listings using reverse geocoding if needed.
        .then(this._addGeoCoordinates.bind(this))
        //store everything in db
        .then(this._save.bind(this))
        //check for similar listings. if found, remove them before notifying
        .then(this._filterBySimilarListings.bind(this))
        //notify the user using the configured notification adapter
        .then(this._notify.bind(this))
        //if an error occurred on the way, handle it here.
        .catch(this._handleError.bind(this))
    );
  }

  _getListings(url) {
    const extractor = new Extractor();
    return new Promise((resolve, reject) => {
      extractor
        .execute(url, this._providerConfig.waitForSelector)
        .then(() => {
          const listings = extractor.parseResponseText(
            this._providerConfig.crawlContainer,
            this._providerConfig.crawlFields,
            url,
          );
          resolve(listings == null ? [] : listings);
        })
        .catch((err) => {
          reject(err);
          logger.error({ err }, `Error while fetching listings for provider: ${this._providerId}, jobKey: ${this._jobKey}`);
        });
    });
  }

  _normalize(listings) {
    return listings.map(this._providerConfig.normalize);
  }

  _filter(listings) {
    const filteredListings = listings.filter(this._providerConfig.filter);
    logger.info(`${filteredListings.length} listings after filtering for provider: ${this._providerId}, jobKey: ${this._jobKey}`);
    return filteredListings;
  }

  async _findNew(listings) {
    const newListings = listings.filter(o => !this._knownListingsIds.includes(o.id));
    logger.info(`${newListings.length} of ${listings.length} listing new for provider: ${this._providerId}, jobKey: ${this._jobKey}`);
    if (newListings.length === 0) {
      throw new NoNewListingsWarning();
    }
    return newListings;
  }

  _notify(newListings) {
    return newListings;
    // if (newListings.length === 0) {
      // throw new NoNewListingsWarning();
    // }
    // const sendNotifications = notify.send(this._providerId, newListings, this._notificationConfig, this._jobKey);
    // return Promise.all(sendNotifications).then(() => newListings);
  }

  async _addGeoCoordinates(newListings) {
    for (const listing of newListings) {
      if (listing.address) {
        const latAndLng = await reverseGeoCoder.getCoordinatesFromAddress(listing.address);
        if (latAndLng.lat && latAndLng.lng) {
          listing.lat = latAndLng.lat;
          listing.lng = latAndLng.lng;
        }
      }
    }
    return newListings;
  }

  _save(newListings) {
    return newListings;

    // return Listing.saveListings(newListings, this._jobKey, this._providerId)
      // .then(savedListings => {
        // return Job.addListingsIds(savedListings.map(l => l.id), this._jobKey, this._providerId).then(() => savedListings);
      // });
  }

  _filterBySimilarListings(listings) {
    const filteredList = listings.filter((listing) => {
      const similar = similarityCache.hasSimilarEntries(this._jobKey, listing.title);
      if (similar) {
        logger.info(`Filtering similar entry for job ${this._providerId} with jobKey ${this._jobKey} and title: ${listing.title}`);
      }
      return !similar;
    });
    filteredList.forEach((filter) => similarityCache.addCacheEntry(this._jobKey, filter.title));
    return filteredList;
  }

  _handleError(err) {
    if (err.name !== "NoNewListingsWarning") {
      logger.error(`Runtime ERROR: ${err}\n${err.stack}`);
    }
  }
}

export default JobRuntime;
