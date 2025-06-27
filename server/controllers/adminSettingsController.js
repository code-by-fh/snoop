import Settings from '../models/Settings.js';


export const getSettings = async (req, res) => {
    const settings = await Settings.findOne({});
    res.json(settings);
}

export const putSettings = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    try {
        const { queryInterval, port, workingHoursFrom, workingHoursTo } = req.body;

        if (queryInterval === undefined || port === undefined) {
            return res.status(400).json({ message: 'queryInterval and port are required.' });
        }
        if (typeof queryInterval !== 'number' || typeof port !== 'number') {
            return res.status(400).json({ message: 'queryInterval and port must be numbers.' });
        }
        if (workingHoursFrom && typeof workingHoursFrom !== 'string') {
            return res.status(400).json({ message: 'workingHoursFrom must be a string.' });
        }
        if (workingHoursTo && typeof workingHoursTo !== 'string') {
            return res.status(400).json({ message: 'workingHoursTo must be a string.' });
        }

        let settings = await Settings.findOne({});
        if (!settings) {
            settings = new Settings({
                queryInterval,
                port,
                workingHoursFrom,
                workingHoursTo
            });
        } else {
            settings.queryInterval = queryInterval;
            settings.port = port;
            settings.workingHoursFrom = workingHoursFrom;
            settings.workingHoursTo = workingHoursTo;
        }

        await settings.save();

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
}