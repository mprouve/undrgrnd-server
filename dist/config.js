"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = config;
