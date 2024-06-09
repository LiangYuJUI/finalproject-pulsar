import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    new DailyRotateFile({
      filename: 'logs/log-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    }),
    new DailyRotateFile({
      filename: 'logs/log-info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

export default logger;
