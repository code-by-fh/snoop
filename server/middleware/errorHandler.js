import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
logger.error(err, 'Global error handler caught an error');

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}