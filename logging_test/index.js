const http = require('http')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file');
const ecsFormat = require('@elastic/ecs-winston-format')

const logger = winston.createLogger({
	level: 'debug',
	format: ecsFormat({ convertReqRes: true }),
	transports: [
		new DailyRotateFile({
			dirname: 'logs',
			filename: 'log-%DATE%.json',
			datePattern: 'YYYY-MM-DD',
			level: 'debug',
			maxSize: '20m',
			maxFiles: '7d'
		})
	]
});

const server = http.createServer(handler)
server.listen(3000, () => {
	logger.info('listening at http://localhost:3000')
})

function handler (req, res) {
	res.setHeader('Foo', 'Bar')
	res.end('ok')
	logger.info('handled request', { req, res })

	// new_start
	const logLevels = ['info', 'error', 'warning'];
	const apis = ['API1', 'API2', 'API3'];
	const logProbability = {
		'info': 0.7,  // 70% probability for info
		'error': 0.2, // 20% probability for error
		'warning': 0.1 // 10% probability for warning
	};

	function getRandomLogLevel() {
		const rand = Math.random();
		if (rand < logProbability['info']) {
			return 'info';
		} else if (rand < logProbability['info'] + logProbability['error']) {
			return 'error';
		} else {
			return 'warning';
		}
	}

	function logMessage(api, logLevel, message) {
		const timestamp = new Date().toISOString();
		console.log(`[${timestamp}] [${api}] [${logLevel.toUpperCase()}] ${message}`);
	}

	function simulateApiLog(api) {
		const logLevel = getRandomLogLevel();
		const messages = {
			'info': 'Received request',
			'error': 'Error processing request',
			'warning': 'Request took longer than expected'
		};
		logMessage(api, logLevel, messages[logLevel]);
	}

	function startLogging() {
		setInterval(() => {
			const randomApi = apis[Math.floor(Math.random() * apis.length)];
			simulateApiLog(randomApi);
		}, Math.floor(Math.random() * 5000) + 1000); // Random interval between 1 to 5 seconds
	}

	startLogging();
	// new_end
}
