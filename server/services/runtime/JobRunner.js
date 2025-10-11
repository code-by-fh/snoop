import { addOrUpdateCommonAttributes } from '#utils/jobUtils.js';
import logger from '#utils/logger.js';
import Job from "../../models/Job.js";
import { getAvailableProviders } from "../../provider/index.js";
import jobEvents from './JobEvents.js';
import JobRuntime from "./JobRuntime.js";
const availableProviders = getAvailableProviders();

async function executeJob(job) {
  logger.info(`start executing job with id: ${job.id}`);

  const jobExecutions = [];
  const jobStartTime = Date.now();

  for (const prov of job.providers) {
    const providerModule = availableProviders[prov.id];
    if (!providerModule) {
      logger.warn(`Provider with id: ${prov.id} not found for job id: ${job.id}`);
      continue;
    }

    providerModule.init(prov, job.blacklist);


    jobExecutions.push(async () => {
      await new JobRuntime(providerModule, job, prov.id, prov.listings.map(l => l.id))
        .execute()
        .then(() => Job.getJob(job.id))
        .then(addOrUpdateCommonAttributes)
        .then(async (updatedJob) => {
          const lastRun = await Job.updateLastRun(job.id, jobStartTime, prov.id);
          jobEvents.emit("jobStatusEvent", { ...updatedJob, status: "Finished", lastRun });
        })
        .catch(async (err) => {
          jobEvents.emit("jobStatusEvent", { ...job, status: "Failed" });
          logger.error(err, `Job ${job.id} failed:`);
          await Job.addProviderError(job.id, {
            providerId: prov.id,
            providerName: providerModule.config.name,
            providerUrl: prov.url,
            message: err.message || String(err)
          });
        });
    });
  }

  logger.info(`Job with id: ${job.id} has ${jobExecutions.length} executions.`);
  await jobExecutions.reduce((prev, jobFunc) => prev.then(jobFunc), Promise.resolve());
}

export async function runJobs() {
  const jobs = await Job.getAllJobs();
  const enabledJobs = jobs.filter((job) => job.isActive);
  for (const job of enabledJobs) {
    await runJob(job.id);
  }
}

export async function runJob(jobId) {
  const job = await Job.getJob(jobId);
  await executeJob(job);
}
