import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';



export const logDirectory = path.resolve('../logging');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

export const logger = (filename) => winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(logDirectory, `${filename}-%DATE%.log`),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ]
});
