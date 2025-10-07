import Job from '../models/Job.js';
import Settings from '../models/Settings.js';
import logger from "../utils/logger.js";

export const health = async (req, res) => {
    const statusList = await getJobStatus();

    const allJobsHealthy = statusList.every((job) => job.healthy);

    const overallHealthy = allJobsHealthy;

    logger.debug("Jobs Healthstatus:", statusList);

    res.statusCode = overallHealthy ? 200 : 503;
    res.send({
        status: overallHealthy ? "ok" : "unhealthy",
        components: {
            jobs: statusList
        }
    });
}

async function getJobStatus() {
    const settings = await Settings.findOne({});
    const enabledJobs = (await Job.getAllJobs()).filter(job => job.enabled);

    const nowUtc = Date.now();
    const intervalInMinutes = settings.queryInterval || 5;
    const missedIntervalCount = 3;
    const thresholdMs = intervalInMinutes * 60 * 1000 * missedIntervalCount;

    return enabledJobs.map((job) => {
        const outdatedProviders = job.provider?.filter((p) => {
            if (!p.lastExecution) return true;
            const differenceMs = nowUtc - p.lastExecution;
            LOG.debug(`Now: ${nowUtc}, lastExecution: ${p.lastExecution}`);
            LOG.debug(`Provider ${p.name} last executed ${differenceMs}ms ago (threshold: ${thresholdMs}ms)`);
            return differenceMs > thresholdMs;
        });

        return {
            jobId: job._id,
            jobName: job.name,
            enabled: true,
            providerCount: job.provider?.length || 0,
            outdatedProviderCount: outdatedProviders?.length || 0,
            healthy: outdatedProviders?.length === 0,
            outdatedProviders: outdatedProviders?.map((p) => ({
                id: p.id,
                name: p.name,
                lastExecution: p.lastExecution,
                ageMs: p.lastExecution ? nowUtc - p.lastExecution : null,
            })),
        };
    });
}