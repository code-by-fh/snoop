import { cleanupDemoAtMidnight } from "./demoCleanupCron.js";
import { isDemo } from '#utils/demoHandler.js';

export const initCron = () => {
    if (isDemo()) {
        cleanupDemoAtMidnight();
    }
};   