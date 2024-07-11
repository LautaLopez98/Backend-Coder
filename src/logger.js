import winston from "winston";
import { config } from './config/config.js';

const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
}

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
    levels: customLevels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            level: "error",
            filename: "./src/logs/errors.log",
        }),
    ],
});


const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize({
            colors: {
            fatal: "bold white redBG",
            error: "red",
            warning: "yellow",
            info: "blue",
            http: "magenta",
            debug: "green",
        },
    }),
        winston.format.simple()
    ),
});

if (config.MODE === "development") {
    consoleTransport.level = "debug";
} else if (config.MODE === 'production') {
    consoleTransport.level = "info";
}

logger.add(consoleTransport);

export const middLogger = (req, res, next) => {
    req.logger = logger;
    next();
};