import logger from '../../utils/logger.js';
import { duringWorkingHoursOrNotSet } from "../../utils/utils.js";
import * as JobRunner from"./JobRunner.js";
import * as similarityCache from "./similarity-check/similarityCache.js";

export async function startRuntime(settings) {
    const INTERVAL = settings?.queryInterval * 60 * 1000 || 60000;
    await similarityCache.initCache(settings);
    const exec = async () => {
        try {
            const isDuringWorkingHoursOrNotSet = duringWorkingHoursOrNotSet(settings, Date.now());
            if (isDuringWorkingHoursOrNotSet) {
                await JobRunner.runAll();
                settings.lastRun = Date.now();
            } else {
                logger.info("Working hours set. Skipping as outside of working hours.");
            }
        } catch (err) {
            logger.error({ err }, "Error during job execution");
        }
    };

    logger.info("Runtime started");
    exec();
    setInterval(exec, INTERVAL);
}