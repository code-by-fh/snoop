import { getAvailableNotificators } from "../notification/adapter/index.js";

export const getAvailableNotificationAdapters = async (req, res) => {
    const notificators = getAvailableNotificators();
    res.status(200).json(Object.values(notificators).map(provider => provider.config));
}