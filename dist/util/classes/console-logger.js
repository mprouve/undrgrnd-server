"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.ConsoleLogger = void 0;
const NO_OP = (message, ...optionalParams) => { }; // eslint-disable-line
/** Logger which outputs to the browser console */
class ConsoleLogger {
    constructor(options) {
        const { level } = options || {};
        this.error = console.error.bind(console);
        if (level === 'error') {
            this.warn = NO_OP;
            this.log = NO_OP;
            return;
        }
        this.warn = console.warn.bind(console);
        if (level === 'warn') {
            this.log = NO_OP;
            return;
        }
        this.log = console.log.bind(console);
    }
}
exports.ConsoleLogger = ConsoleLogger;
exports.logger = new ConsoleLogger();
