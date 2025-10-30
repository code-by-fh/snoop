import { Job } from "@/types";

const trackingEnabled = import.meta.env.VITE_TRACKING_ENABLED?.trim() === 'true';

export const trackEditJob = (data: Job) => {
    track("edit_job", createJobPayload(data))
}

export const trackCreateJob = (data: Job) => {
    track("create_job", createJobPayload(data))
}

const track = (trackingEvent: string, data?: Record<string, string | number | boolean>) => {
    if (trackingEnabled && window.umami) {
        window.umami?.track(trackingEvent, data);
    }
}

function createJobPayload(data: Job): Record<string, string | number | boolean> | undefined {
    return {
        "name": data.name,
        "providersCount": data.providers.length,
        "notificationAdaptersCount": data.notificationAdapters.length,
        "blacklistTermsCount": data.blacklistTerms.length,
        "isActive": data.isActive,
        "notificationAdapters": data.notificationAdapters.map(adapter => adapter.id).join(",")
    };
}
