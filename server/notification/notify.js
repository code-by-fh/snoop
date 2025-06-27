import { getAvailableNotificators } from "./adapter/index.js";

const findAdapter = (notificationAdapter) => {
  return getAvailableNotificators()[notificationAdapter.id] || null;
};

export const send = (serviceName, newListings, notificationConfigs, jobKey, providerId) => {
  return notificationConfigs
    .filter((notificationAdapter) => findAdapter(notificationAdapter) != null)
    .map((notificationAdapter) => findAdapter(notificationAdapter))
    .map((a) => a.send({ serviceName, newListings, notificationConfig: notificationConfigs, jobKey, providerId }));
};
