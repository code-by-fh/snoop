import logger from '#utils/logger.js';
import { duringWorkingHoursOrNotSet } from "../../utils/utils.js";
import * as JobRunner from "./JobRunner.js";
import * as similarityCache from "./similarity-check/similarityCache.js";

let runtimeInterval = null;
let currentSettings = null;
let lastSettingsJSON = "";
let isRunning = false;

async function execJobLoop() {
    if (!currentSettings || isRunning) return;

    isRunning = true;
    try {
        const isDuringWorkingHoursOrNotSet = duringWorkingHoursOrNotSet(currentSettings, Date.now());
        if (isDuringWorkingHoursOrNotSet) {
            await JobRunner.runJobs();
            currentSettings.lastRun = Date.now();
        } else {
            logger.info("Working hours set. Skipping as outside of working hours.");
        }
    } catch (err) {
        logger.error(err, "Error during job execution");
    } finally {
        isRunning = false;
    }
}

async function restartLoopIfSettingsChanged(settings) {
    const settingsJSON = JSON.stringify(settings);
    if (settingsJSON !== lastSettingsJSON) {

        if (runtimeInterval) {
            clearInterval(runtimeInterval);
            runtimeInterval = null;
            logger.info("Runtime restarted due to settings change.");
        }

        currentSettings = settings;
        lastSettingsJSON = settingsJSON;

        await similarityCache.initCache(settings);

        const INTERVAL = settings?.queryInterval * 60 * 1000 || 60000;

        execJobLoop();
        runtimeInterval = setInterval(execJobLoop, INTERVAL);

        logger.info(`Runtime started with interval: ${INTERVAL}ms and settings: ${settingsJSON}`);
    }
}

export async function startRuntime(newSettings) {
    await restartLoopIfSettingsChanged(newSettings);
}
