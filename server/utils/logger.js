import winston from 'winston';
import util from 'util';

const { combine, timestamp, printf, colorize } = winston.format;

// Formatierung für Objekte
const customFormat = printf(({ level, message, timestamp }) => {
  const msg = typeof message === 'object'
    ? util.inspect(message, { depth: null, colors: true })
    : message;

  return `[${timestamp}] ${level}: ${msg}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console()
    // Optional: neue File-Transports hier
  ],
});

export default logger;
