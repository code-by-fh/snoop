import { getAvailableNotificators } from "./adapter/index.js";

const findAdapter = (notificationAdapter) => {
  return getAvailableNotificators()[notificationAdapter.id] || null;
};

export const send = (serviceName, listings, job) => {
  return job.notificationAdapters
    .map((notificationAdapter) => findAdapter(notificationAdapter))
    .map((a) => a.send({
      serviceName,
      listings,
      notificationAdapters : job.notificationAdapters,
      jobId: job.id,
      jobName: job.name
    }));
};
