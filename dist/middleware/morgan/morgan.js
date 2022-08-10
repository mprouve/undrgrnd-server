"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../../logger/index"));
const config_1 = __importDefault(require("../../config"));
const skip = () => config_1.default.env === 'production';
const stream = {
    write: (message) => {
        index_1.default.http(message);
    }
};
const morganMiddleware = (0, morgan_1.default)('tiny', { stream, skip });
exports.default = morganMiddleware;
