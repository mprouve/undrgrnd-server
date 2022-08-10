"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./logger/index"));
const morgan_1 = __importDefault(require("./middleware/morgan/morgan"));
const app = (0, express_1.default)(); // INITIALIZE EXPRESS APP HERE
// ***********************************************************
// BEGIN: MIDDLEWARE *****************************************
// ***********************************************************
// Returns a middleware to serve favicon
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, config_1.default.app.public_dir, '/favicon.ico')));
// MORGAN REQUEST LOGGING:
app.use(morgan_1.default);
// BODY PARSER:
app.use(body_parser_1.default.urlencoded({ extended: true })); // Allow 'application/x-www-form-urlencoded'
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
// CACHE HEADER CONTROL MIDDLEWARE
// app.use((req, res, next) => {
//   // here you can define period in second, this one is 5 minutes
//   const period = 60 * 60 * 24 * 365 // 31536000 (1 year)
//   // you only want to cache for GET requests
//   if (req.method == 'GET') {
//     res.set('Cache-control', `public, max-age=${period}`)
//   } else {
//     // for the other requests set strict no caching parameters
//     res.set('Cache-control', `no-store`)
//   }
//   // remember to call next() to pass on the request
//   next()
// })
// COMPRESSION MIDDLEWARE: Compresses responses to greatly decrease downloadable data by users from server
app.use((0, compression_1.default)());
// CORS MIDDLEWARE:
if (config_1.default.env !== 'local') {
    const whiteListDomains = [
        'http://theundrgrnd-app.herokuapp.com',
        'https://theundrgrnd-app.herokuapp.com',
        'http://www.theundrgrnd.com',
        'https://www.theundrgrnd.com',
        'http://www.theundrgrnd.xyz',
        'https://www.theundrgrnd.xyz',
        'http://theundrgrnd.com',
        'https://theundrgrnd.com',
        'http://theundrgrnd.xyz',
        'https://theundrgrnd.xyz'
    ];
    app.use((0, cors_1.default)({
        origin(origin, callback) {
            index_1.default.debug(`REQUEST ORIGIN: ${origin}<${typeof origin}>`);
            // If we want to allow requests with no origin uncomment below line
            // (like mobile apps or curl requests)
            if (!origin)
                return callback(null, true);
            if (whiteListDomains.indexOf(origin) !== -1) {
                return callback(null, true);
            }
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
    }));
}
else {
    app.use((0, cors_1.default)());
}
// SECURE REDIRECT MIDDLEWARE (For Forcing https - when SSL enabled)
app.use((req, res, next) => {
    if (config_1.default.env === 'local' || req.headers['x-forwarded-proto'] === 'https') {
        next();
    }
    else {
        index_1.default.debug('Redirecting to secure (HTTPS)');
        res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    }
});
// STATIC FILES:
// Note the custom cache headers using the options object param in express.static
app.use(express_1.default.static(path_1.default.join(__dirname, config_1.default.app.public_dir), {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        const hashRegExp = /\.[0-9a-f]{8}\./;
        if (path.endsWith('.html')) {
            // All of the project's HTML files end in .html
            res.setHeader('Cache-Control', 'no-cache');
        }
        else if (hashRegExp.test(path)) {
            // If the RegExp matched, then we have a versioned URL.
            res.setHeader('Cache-Control', 'max-age=31536000');
        }
    }
}));
// ROUTES ************************************
// Routes that should handle incoming requests
// *******************************************
// const xRoutes = require('./controllers/x/routes/x.js')
// app.use('/api/v1/x', xRoutes)
// app.get('/api/v1/', (req, res) => res.status(200).json({ status: 1, message: 'ok' }))
// CATCH ALL UNHANDLED GETS TO RENDER CLIENT ON URL INPUT
app.get('/*', (req, res) => {
    index_1.default.info('Using catch-all route handler - Returning entry file.');
    res.sendFile(path_1.default.join(__dirname, config_1.default.app.entry_file));
});
// ERROR HANDLING:
// Middleware to catch unhandled requests
app.use((req, res, next) => {
    const error = Object.assign(Object.assign({}, new Error('Not found')), { status: 404 });
    next(error);
});
// Middleware to pass down all other errors not caught
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    index_1.default.error(`${error.message}`);
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});
// ***********************************************************
// END: MIDDLEWARE *******************************************
// ***********************************************************
// Improve debugging
process.on('unhandledRejection', (reason, p) => {
    index_1.default.error(`Unhandled Rejection at: ${p}, Reason: ${reason}`);
});
app.listen(config_1.default.app.port, () => {
    index_1.default.info(`NODE_ENVIRONMENT: ${process.env.NODE_ENV}`);
    index_1.default.info(`PLATFORM_ENVIRONMENT: ${config_1.default.env}`);
    index_1.default.info(`Server listening on port ${config_1.default.app.port}`);
});
