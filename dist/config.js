"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const console_logger_1 = require("./util/classes/console-logger");
// SETUP ENVIRONMENT VARIABLE
let env;
if (process.env.NODE_ENV === 'local' ||
    process.env.NODE_ENV === 'undefined' ||
    typeof process.env.NODE_ENV === 'undefined') {
    env = 'local';
}
else if (process.env.NODE_ENV === 'production') {
    env = 'production';
}
else {
    env = 'local';
}
// ****************************************
// PRODUCTION *****************************
// ****************************************
const production = {
    env,
    NODE_ENV: process.env.NODE_ENV,
    debug: false,
    app: {
        url: 'https://www.theundrgrnd.xyz',
        port: process.env.PORT || 10000,
        public_dir: '../src/public',
        entry_file: '../src/public/index.html'
    }
};
// ****************************************
// LOCAL **********************************
// ****************************************
const local = {
    env,
    NODE_ENV: process.env.NODE_ENV,
    debug: true,
    app: {
        url: 'http://localhost:3000',
        port: process.env.PORT || 10000,
        public_dir: 'public',
        entry_file: 'public/index.html'
    }
};
const config = {
    production,
    local
}[env];
config.debug && console_logger_1.logger.log(colors_1.default.magenta(`NODE_ENVIRONMENT: ${process.env.NODE_ENV}`));
config.debug && console_logger_1.logger.log(colors_1.default.magenta(`PLATFORM_ENVIRONMENT: ${env}`));
exports.default = config;
