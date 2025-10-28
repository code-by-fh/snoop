import util from 'util';
import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  const msg =
    typeof message === 'object'
      ? util.inspect(message, { depth: null, colors: true })
      : message;
  return `[${timestamp}] [${level}]: ${msg}`;
});

const isProduction = process.env.NODE_ENV === 'production';
const disableFileLogs = process.env.DISABLE_FILE_LOGS === 'true';

const transports = [
  new winston.transports.Console({
    handleExceptions: true,
  }),
];

if (!disableFileLogs) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isProduction ? customFormat : combine(colorize(), customFormat)
  ),
  transports,
  exitOnError: false,
});

if (!isProduction) {
  logger.debug(
    `Logger initialized in development mode (file logging: ${disableFileLogs ? 'disabled' : 'enabled'
    })`
  );
}

export default logger;
