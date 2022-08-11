"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const winston_1 = require("winston");
const stream = __importStar(require("stream"));
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
const buildLoggerDev = () => {
    // Custom log format
    const myFormat = printf(({ level, message, timestamp, stack }) => {
        return `[${level}] [${timestamp}] ${stack || message}`;
    });
    // Transport to print logs to console
    const consoleTransport = new winston_1.transports.Console();
    (0, winston_1.addColors)(config_1.default.colors);
    const logger = (0, winston_1.createLogger)({
        levels: config_1.default.levels,
        level: 'debug',
        format: combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), myFormat),
        transports: [consoleTransport]
    });
    logger.stream = () => {
        return new stream.Duplex({
            write: function (message) {
                logger.info(message.trim());
            }
        });
    };
    return logger;
};
exports.default = buildLoggerDev;
