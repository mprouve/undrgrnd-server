"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const logger_dev_1 = __importDefault(require("./logger-dev"));
const logger_prod_1 = __importDefault(require("./logger-prod"));
const logger = (config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.env) === 'production' ? (0, logger_prod_1.default)() : (0, logger_dev_1.default)();
exports.default = logger;
