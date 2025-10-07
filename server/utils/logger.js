import winston from 'winston';
import util from 'util';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  const msg = typeof message === 'object'
    ? util.inspect(message, { depth: null, colors: true })
    : message;
  return `[${timestamp}] [${level}]: ${msg}`;
});

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isProduction ? customFormat : combine(colorize(), customFormat)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exitOnError: false,
});

if (!isProduction) {
  logger.debug('Logger initialized in development mode');
}

export default logger;
