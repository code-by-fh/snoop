import { createHash } from 'crypto';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function inDevMode() {
    return process.env.NODE_ENV == null || process.env.NODE_ENV !== 'production';
}

function isOneOf(word, arr) {
    if (arr == null || arr.length === 0) {
        return false;
    }
    const expression = String.raw`\b(${arr.join('|')})\b`;
    const blacklist = new RegExp(expression, 'ig');
    return blacklist.test(word);
}

function nullOrEmpty(val) {
    return val == null || val.length === 0;
}

function timeStringToMsOfDay(timeString) {
    const parts = String(timeString).split(':').map((p) => parseInt(p, 10));
    const hours = Number.isFinite(parts[0]) ? parts[0] : 0;
    const minutes = Number.isFinite(parts[1]) ? parts[1] : 0;

    if (hours === 0 && minutes === 0 && String(timeString).trim() === '00:00') {
        return 24 * 3600_000; // 86400000
    }

    return hours * 3600_000 + minutes * 60_000;
}

function duringWorkingHoursOrNotSet(config, now) {
    if (!config) return true;

    const { workingHoursFrom, workingHoursTo } = config;

    if (!workingHoursFrom || !workingHoursTo) return true;

    if (
        workingHoursFrom.trim() === '00:00' &&
        workingHoursTo.trim() === '00:00'
    ) {
        return true;
    }

    const d = new Date(now);
    const msOfDay =
        d.getHours() * 3600_000 + d.getMinutes() * 60_000 + d.getSeconds() * 1000;

    const fromMs = timeStringToMsOfDay(workingHoursFrom);
    const toMs = timeStringToMsOfDay(workingHoursTo);

    if (fromMs <= toMs) {
        return msOfDay >= fromMs && msOfDay <= toMs;
    }

    return msOfDay >= fromMs || msOfDay <= toMs;
}


function getDirName() {
    return dirname(fileURLToPath(import.meta.url));
}

function buildHash(...inputs) {
    if (!inputs || inputs.length === 0) return null;

    const cleaned = inputs
        .filter(i =>
            i !== null &&
            i !== undefined &&
            !(typeof i === 'string' && i.trim() === '') &&
            !(Array.isArray(i) && i.length === 0)
        )
        .map(i => typeof i === 'object' ? JSON.stringify(i) : String(i));

    if (cleaned.length === 0) return null;

    return createHash('sha256')
        .update(cleaned.join(','))
        .digest('hex');
}


export { buildHash, duringWorkingHoursOrNotSet, getDirName, inDevMode, isOneOf, nullOrEmpty, timeStringToMsOfDay };
export default {
    isOneOf,
    nullOrEmpty,
    duringWorkingHoursOrNotSet,
    timeStringToMsOfDay,
    getDirName,
};