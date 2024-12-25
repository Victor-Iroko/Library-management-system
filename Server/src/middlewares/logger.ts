import { logDirectory, logger } from 'utils/logger';


export const loggingMiddleware = (req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
        logger('requests').info(logMessage);
    })

    next()
}