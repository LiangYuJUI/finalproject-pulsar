const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss'
	}),
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.json()
);

const logger = winston.createLogger({
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
	logger.add(new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
		)
	}));
}

module.exports = logger;


// logger.info(`Sending request to ${stationConfig.host}:${stationConfig.port}/api/ev_stop`, { 
// 	station_id: requestOptions.body.station_id,
// 	charger_id: requestOptions.body.charger_id,
// 	trans_id: requestOptions.body.trans_id,
// 	logs_from: logs_from, 
// 	function: "stop"
// });
