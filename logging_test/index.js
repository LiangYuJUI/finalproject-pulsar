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
}