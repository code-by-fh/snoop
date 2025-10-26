import logger from '#utils/logger.js';
import { buildHash } from '#utils/utils.js';
import Job from "../../models/Job.js";
import Listing from "../../models/Listing.js";
import * as notify from '../../notification/notify.js';
import { getTrackingUrl } from '../../tracking/listing.js';
import { addGeoCoordinatesWithMapbox } from "../mapboxGeo.js";
import Extractor from './extractor/extractor.js';
import jobEvents from './JobEvents.js';
import urlModifier from "./queryStringMutator.js";
import * as similarityCache from "./similarity-check/similarityCache.js";

class JobRuntime {
  /**
   *
   * @param provider the provider that is currently in use
   * @param job the job that is currently running
   * @param providerId the id of the provider currently in use
   * @param jobId key of the job that is currently running (from within the config)
   * @param knownListingsIds the ids of the listings that are already known to the provider
   */
  constructor(provider, job, providerId, knownListingsIds) {
    this._providerMetaInformation = provider.metaInformation
    this._providerConfig = provider.config;
    this._job = job;
    this._providerId = providerId;
    this._knownListingsIds = knownListingsIds || [];
  }

  execute() {
    logger.info(`Starting '${this._providerId}' job '${this._job.id}'`);
    return (
      //modify the url to make sure search order is correctly set
      Promise.resolve(urlModifier(this._providerConfig.url, this._providerConfig.sortByDateParam, this._providerConfig.urlParamsToRemove))
        //scraping the site and try finding new listings
        .then(url => this._emitSocketEvent('Searching').then(() => url))
        .then(this._providerConfig.getListings?.bind(this) ?? this._getListings.bind(this))
        //bring them in a proper form (dictated by the provider)
        .then(listings => this._emitSocketEvent('Normalizing').then(() => listings))
        .then(this._normalize.bind(this))
        //filter listings with stuff tagged by the blacklist of the provider
        .then(listings => this._emitSocketEvent('Filtering').then(() => listings))
        .then(this._filter.bind(this))
        //check if new listings available. if so proceed
        .then(this._findNew.bind(this))
        //add geo coordinates to the listings using reverse geocoding if needed.
        .then(listings => this._emitSocketEvent('Polishing').then(() => listings))
        .then(this._polish.bind(this))
        .then(this._addGeoCoordinates.bind(this))
        //store everything in db
        .then(listings => this._emitSocketEvent('Saving').then(() => listings))
        .then(this._save.bind(this))
        //check for similar listings. if found, remove them before notifying
        .then(this._filterBySimilarListings.bind(this))
        //notify the user using the configured notification adapter
        .then(listings => this._emitSocketEvent('Notifying').then(() => listings))
        .then(this._notify.bind(this))
    );
  }

  async _emitSocketEvent(currentStatus) {
    jobEvents.emit("jobStatusEvent", { ...this._job, status: currentStatus });
  }

  async _getListings(url) {
    const extractor = new Extractor();
    try {
      await extractor.execute(url, this._providerConfig.waitForSelector);
      const listings = extractor.parseResponseText(
        this._providerConfig.crawlContainer,
        this._providerConfig.crawlFields,
        url,
      );
      return listings == null ? [] : listings;
    } catch (err) {
      logger.error(err, `Error while fetching listings for provider: ${this._providerId}, jobId: ${this._job.id}`);
      throw err;
    }
  }

  _normalize(listings) {
    return listings.map(this._providerConfig.normalize).map(listing => {
      listing.id = buildHash(listing.id, this._providerId, this._job.id);
      return listing;
    })
  }

  _filter(listings) {
    const filteredListings = listings.filter(this._providerConfig.filter);
    logger.info(`${filteredListings.length} listings after filtering for provider: ${this._providerId}, jobId: ${this._job.id}`);
    return filteredListings;
  }

  async _findNew(listings) {
    const newListings = listings.filter(o => !this._knownListingsIds.includes(o.id));
    logger.info(`${newListings.length} of ${listings.length} listing new for provider: ${this._providerId}, jobId: ${this._job.id}`);
    return newListings;
  }

  async _polish(lisintgs) {
    return lisintgs.map(listing => {
      listing.providerName = this._providerMetaInformation.name;
      listing.providerId = this._providerMetaInformation.id;
      listing.trackingUrl = getTrackingUrl(listing.id, this._job.user);
      return listing;
    });
  }

  async _addGeoCoordinates(listings) {
    const updatedListings = await Promise.all(
      listings.map((listing) => addGeoCoordinatesWithMapbox(listing))
    );
    return updatedListings;
  }

  _save(newListings) {
    if (newListings.length > 0) {
      return Listing.saveListings(newListings, this._job.id)
        .then(savedListings => Job.addListingsIds(savedListings.map(l => l.id), this._job.id, this._providerId))
        .then(() => newListings);
    }
    return newListings;
  }

  _filterBySimilarListings(listings) {
    const filteredList = listings.filter((listing) => {
      const similar = similarityCache.hasSimilarEntries(this._job.id, listing.title);
      if (similar) {
        logger.info(`Filtering similar entry for job ${this._providerId} with jobId ${this._job.id} and title: ${listing.title}`);
      }
      return !similar;
    });
    filteredList.forEach((filter) => similarityCache.addCacheEntry(this._job.id, filter.title));
    return filteredList;
  }

  async _notify(newListings) {
    if (newListings.length > 0) {
      const sendNotifications = notify.send(this._providerMetaInformation.name, newListings, this._job);
      return Promise.all(sendNotifications).then(() => newListings);
    }
    return newListings;
  }
}

export default JobRuntime;
