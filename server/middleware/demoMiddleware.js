import { isDemo } from '#utils/demoHandler.js';

const demoMiddleware = async (req, res, next) => {

    if (isDemo()) {
        return res.status(403).json({ message: 'Access denied. Demo mode enabled.' });
    }

    next();
};

export default demoMiddleware;
