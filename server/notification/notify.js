import { getAvailableNotificators } from "./adapter/index.js";

const findAdapter = (notificationAdapter) => {
  return getAvailableNotificators()[notificationAdapter.id] || null;
};

export const send = (serviceName, newListings, notificationAdapters, jobId) => {
  return notificationAdapters
    .filter((notificationAdapter) => findAdapter(notificationAdapter) != null)
    .map((notificationAdapter) => findAdapter(notificationAdapter))
    .map((a) => a.send({ serviceName, newListings, jobId }));
};
