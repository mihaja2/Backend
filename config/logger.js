const {
    createLogger,
    transports,
    format
} = require('winston');

// every info, warn from the application will be stored on root/log.log
const customLogger = createLogger({
    transports: [
        new transports.File({
            filename: 'log.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

// every error from the application will be stored on root/error.log
const errorLogger = createLogger({
    transports: [
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

module.exports = { customLogger, errorLogger };