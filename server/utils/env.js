export const appMetaData = () => {
    return {
            isDemoModeEnabled: process.env.IS_DEMO === 'true',
            isDebugModeEnabled: process.env.MONGO_DB_DEBUG === 'true',
            isTrackingEnabled: process.env.TRACKING_ENABLED === 'true',
            isSelfRegistrationEnabled: process.env.SELF_REGISTRATION_ENABLED === 'true',
            apiBaseUrl: process.env.API_BASE_URL
    }
}