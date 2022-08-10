"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'white',
        verbose: 'cyan',
        debug: 'cyan',
        silly: 'magenta'
    }
};
exports.default = config;
