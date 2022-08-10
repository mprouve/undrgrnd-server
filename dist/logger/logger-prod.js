"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, errors, json } = winston_1.format;
const buildLoggerProd = () => {
    const logger = (0, winston_1.createLogger)({
        level: 'http',
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: 'user-service' },
        transports: [
            // Transport to print logs to console
            new winston_1.transports.Console(),
            // Transport to print all error logs to errors.log file
            new winston_1.transports.File({ filename: 'logs/errors.log', level: 'error' })
            // Transport to print all logs to all.log file
            // new transports.File({ filename: 'logs/all.log' })
        ]
    });
    return logger;
};
exports.default = buildLoggerProd;
