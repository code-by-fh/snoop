import { appMetaData } from '#utils/env.js';

const selfRegistrationMiddleware = async (req, res, next) => {
    if (!appMetaData().isSelfRegistrationEnabled) {
        return res.status(403).json({ message: 'Access denied.' });
    }

    next();
};

export default selfRegistrationMiddleware;

