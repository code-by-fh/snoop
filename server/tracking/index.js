let trackingBaseUrl = null;

export const initTracking = (url) => {
  trackingBaseUrl = url;
};

export const getTrackingBaseUrl = () => trackingBaseUrl;