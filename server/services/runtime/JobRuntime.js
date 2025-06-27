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
 * @param provider the provider to run
 * @param notificationConfig the config for all notifications
 * @param jobId key of the job that is currently running (from within the config)
 * @param knownListingsIds the ids of the listings that are already known to the provider
 */
  constructor(provider, notificationConfig, jobId, knownListingsIds) {
    this._provider = provider;
    this._notificationConfig = notificationConfig;
    this._jobId = jobId
    this._knownListingsIds = knownListingsIds || [];
  }

  execute() {
    logger.info(`Starting job for provider: ${this._provider.metaInformation.id}, jobKey: ${this._jobId}`);
    return (
      //modify the url to make sure search order is correctly set
      Promise.resolve(urlModifier(this._provider.config.url, this._provider.config.sortByDateParam, this._provider.config.urlParamsToRemove))
        //scraping the site and try finding new listings
        .then(this._provider.config.getListings?.bind(this) ?? this._getListings.bind(this))
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
        .execute(url, this._provider.config.waitForSelector)
        .then(() => {
          const listings = extractor.parseResponseText(
            this._provider.config.crawlContainer,
            this._provider.config.crawlFields,
            url,
          );
          resolve(listings == null ? [] : listings);
        })
        .catch((err) => {
          reject(err);
          logger.error({ err }, `Error while fetching listings for provider: ${this._provider.metaInformation.id}, jobKey: ${this._jobId}`);
        });
    });
  }

  _normalize(listings) {
    return listings.map(this._provider.config.normalize);
  }

  _filter(listings) {
    const filteredListings = listings.filter(this._provider.config.filter);
    logger.info(`${filteredListings.length} listings after filtering for provider: ${this._provider.metaInformation.id}, jobKey: ${this._jobId}`);
    return filteredListings;
  }

  async _findNew(listings) {
    const newListings = listings.filter(o => !this._knownListingsIds.includes(o.id));
    logger.info(`${newListings.length} of ${listings.length} listing new for provider: ${this._provider.metaInformation.id}, jobKey: ${this._jobId}`);
    if (newListings.length === 0) {
      throw new NoNewListingsWarning();
    }
    return newListings;
  }

  _notify(newListings) {
    if (newListings.length === 0) {
      throw new NoNewListingsWarning();
    }
    const sendNotifications = notify.send(this._provider.metaInformation.name, newListings, this._notificationConfig, this._jobId);
    return Promise.all(sendNotifications).then(() => newListings);
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
    return Listing.saveListings(newListings, this._jobId, this._provider.metaInformation.id)
      .then(savedListings => {
        return Job.addListingsIds(savedListings.map(l => l.id), this._jobId, this._provider.metaInformation.id).then(() => savedListings);
      });
  }

  _filterBySimilarListings(listings) {
    const filteredList = listings.filter((listing) => {
      const similar = similarityCache.hasSimilarEntries(this._jobId, listing.title);
      if (similar) {
        logger.info(`Filtering similar entry for job ${this._provider.metaInformation.id} with jobKey ${this._jobId} and title: ${listing.title}`);
      }
      return !similar;
    });
    filteredList.forEach((filter) => similarityCache.addCacheEntry(this._jobId, filter.title));
    return filteredList;
  }

  _handleError(err) {
    if (err.name !== "NoNewListingsWarning") {
      logger.error(`Runtime ERROR: ${err}\n${err.stack}`);
    }
  }
}

export default JobRuntime;
