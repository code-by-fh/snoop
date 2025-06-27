import Job from "../../models/Job.js";
import { getAvailableProviders } from "../../provider/index.js";
import JobRuntime from "./JobRuntime.js";

export async function executeJob(job) {
  const availableProviders = getAvailableProviders();

  const jobExecutions = job.providers.map((jobProvider) => {
    const providerImpl = availableProviders[jobProvider.id];

    providerImpl.init(jobProvider, job.blacklistTerms);


    return async () => new JobRuntime(
      providerImpl,
      job.notificationAdapters,
      job.id,
      jobProvider.listings
    ).execute();
  });

  await jobExecutions.reduce((prev, fn) => prev.then(fn), Promise.resolve());
  await setLastExecutionTime(job);
}

async function setLastExecutionTime(job) {
  await Job.findByIdAndUpdate(job.id, {
    $set: { lastExecution: Date.now() },
  });
}

export async function runAll() {
  const jobs = await Job.getActiveJobs();
  for (const job of jobs) {
    await executeJob(job);
  }
}

export async function runJob(jobId) {
  const job = await Job.findById(jobId);
  if (job) {
    await executeJob(job);
  }
}
