import 'dotenv/config'
import config from './config'
import express, { Express, Request, Response, NextFunction } from 'express'
import favicon from 'serve-favicon'
import compression from 'compression'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import logger from './logger/index'
import morganMiddleware from './middleware/morgan/morgan'

const app: Express = express() // INITIALIZE EXPRESS APP HERE

// ***********************************************************
// BEGIN: MIDDLEWARE *****************************************
// ***********************************************************

// Returns a middleware to serve favicon
app.use(favicon(path.join(__dirname, config.app.public_dir, '/favicon.ico')))

// MORGAN REQUEST LOGGING:
app.use(morganMiddleware)

// BODY PARSER:
app.use(bodyParser.urlencoded({ extended: true })) // Allow 'application/x-www-form-urlencoded'
app.use(
  bodyParser.json({
    verify: (req: Request, res: Response, buf: any) => {
      req.rawBody = buf
    }
  })
)

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
app.use(compression())

// CORS MIDDLEWARE:
if (config.env !== 'local') {
  const whiteListDomains: string[] = [
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
  ]

  app.use(
    cors({
      origin(origin: any, callback: any) {
        logger.debug(`REQUEST ORIGIN: ${origin}<${typeof origin}>`)
        // If we want to allow requests with no origin uncomment below line
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        if (whiteListDomains.indexOf(origin) !== -1) {
          return callback(null, true)
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
        return callback(new Error(msg), false)
      }
    })
  )
} else {
  app.use(cors())
}

// SECURE REDIRECT MIDDLEWARE (For Forcing https - when SSL enabled)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (config.env === 'local' || req.headers['x-forwarded-proto'] === 'https') {
    next()
  } else {
    logger.debug('Redirecting to secure (HTTPS)')

    res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
  }
})

// STATIC FILES:
// Note the custom cache headers using the options object param in express.static
app.use(
  express.static(path.join(__dirname, config.app.public_dir), {
    etag: true, // Just being explicit about the default.
    lastModified: true, // Just being explicit about the default.
    setHeaders: (res: Response, path: string) => {
      const hashRegExp = /\.[0-9a-f]{8}\./

      if (path.endsWith('.html')) {
        // All of the project's HTML files end in .html
        res.setHeader('Cache-Control', 'no-cache')
      } else if (hashRegExp.test(path)) {
        // If the RegExp matched, then we have a versioned URL.
        res.setHeader('Cache-Control', 'max-age=31536000')
      }
    }
  })
)

// ROUTES ************************************
// Routes that should handle incoming requests
// *******************************************
// const xRoutes = require('./controllers/x/routes/x.js')
// app.use('/api/v1/x', xRoutes)
// app.get('/api/v1/', (req, res) => res.status(200).json({ status: 1, message: 'ok' }))

// CATCH ALL UNHANDLED GETS TO RENDER CLIENT ON URL INPUT
app.get('/*', (req: Request, res: Response) => {
  logger.info('Using catch-all route handler - Returning entry file.')

  res.sendFile(path.join(__dirname, config.app.entry_file))
})

// ERROR HANDLING:
// Middleware to catch unhandled requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = { ...new Error('Not found'), status: 404 }

  next(error)
})

// Middleware to pass down all other errors not caught
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${error.message}`)

  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  })
})

// ***********************************************************
// END: MIDDLEWARE *******************************************
// ***********************************************************

// Improve debugging
process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: ${p}, Reason: ${reason}`)
})

app.listen(config.app.port, () => {
  logger.info(`NODE_ENVIRONMENT: ${process.env.NODE_ENV}`)
  logger.info(`PLATFORM_ENVIRONMENT: ${config.env}`)
  logger.info(`Server listening on port ${config.app.port}`)
})
