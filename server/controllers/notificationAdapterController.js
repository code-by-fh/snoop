import logger from "#utils/logger.js";
import { getAvailableNotificators } from "../notification/adapter/index.js";

export const getAvailableNotificationAdapters = async (req, res) => {
    try {
        const notificators = getAvailableNotificators();
        let configs = Object.values(notificators).map(provider => provider.config);

        if (!req.user || req.user.role !== 'admin') {
            configs = configs.filter(config => config.id !== 'console');
        }

        res.status(200).json(configs);
    } catch (error) {
        logger.error(error, "Error fetching notification adapters");
        res.status(500).json({ message: 'Failed to fetch adapters', error: error.message });
    }
};

export const sendTestNotification = async (req, res) => {
    const { adapterId } = req.params;
    const adapterConfig = req.body;

    try {
        const notificators = getAvailableNotificators();
        const adapter = notificators[adapterId];

        if (!adapter) {
            return res.status(404).json({ message: `Adapter ${adapterId} not found` });
        }

        const listings = [
            {
                title: "Test Notification",
                address: "k.A.",
                price: "k.A.",
                size: "k.A.",
                description: "This is a test notification sent by the system.",
                link: "https://example.com",
                image: "https://picsum.photos/200",
            },
        ];

        Object.entries(adapterConfig).map(([key, field]) => {
            adapter.config.fields[key].value = field;
        })

        await adapter.send({
            serviceName: adapter.config.name,
            listings,
            notificationAdapters: [
                {
                    id: adapterId,
                    fields: adapter.config.fields,
                },
            ],
        });

        res.status(200).json({ message: "Test notification sent successfully" });
    } catch (error) {
        logger.error(error, `Error sending test notification for adapter ${adapterId}`);
        res.status(500).json({
            message: "Failed to send test notification",
            error: error.message,
        });
    }
};



