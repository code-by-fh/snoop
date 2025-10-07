import Job from "../../models/Job.js";
import { getAvailableProviders } from "../../provider/index.js";
import jobEvents from './JobEvents.js';
import JobRuntime from "./JobRuntime.js";
import logger from '#utils/logger.js';

const availableProviders = getAvailableProviders();

async function executeJob(job) {
  logger.info(`Running job with id: ${job.id}`);
  jobEvents.emit('jobStatusEvent', { jobId: job.id, jobName: job.name, status: 'running' });

  const jobExecutions = [];

  for (const prov of job.providers) {
    const providerModule = availableProviders[prov.id];
    if (!providerModule) {
      logger.warn(`Provider with id: ${prov.id} not found for job id: ${job.id}`);
      continue;
    }

    providerModule.init(prov, job.blacklist);

    jobExecutions.push(async () => {
      await new JobRuntime(providerModule.config, job.notificationAdapters, prov.id, job.id, prov.listings).execute();
      // await setLastJobExecution(job.id);
    });
  }

  logger.info(`Job with id: ${job.id} has ${jobExecutions.length} executions.`);
  // await jobExecutions.reduce((prev, jobFunc) => prev.then(jobFunc), Promise.resolve());

  await new Promise((resolve) => {
    setTimeout(() => {
      logger.info(`Job ${job.id} executed`);
      resolve();
    }, 7000);
  });
  jobEvents.emit('jobStatusEvent', { jobId: job.id, jobName: job.name, status: 'finished' });
}

export async function runJobs(socketServer) {
  const enabledJobs = Job.getJobs().filter((job) => job.enabled);

  for (const job of enabledJobs) {
    await runJob(job.id, socketServer);
  }
}

export async function runJob(jobId) {
  const job = await Job.getJob(jobId);

  try {
    await executeJob(job);

    return {
      jobId,
      jobName: job.name,
      status: 'finished'
    };
  } catch (err) {
    logger.error(`Error executing job with id: ${job.id}`, err);
    jobEvents.emit('jobStatusEvent', { jobId: job.id, jobName: job.name, status: 'failed' });

    return {
      jobId,
      jobName: job.name,
      status: 'failed',
      error: err.message
    };
  }
}
