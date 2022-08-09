import 'dotenv/config' // Load .env variables
import express, { Express, Request, Response, NextFunction } from 'express'
import favicon from 'serve-favicon'
import compression from 'compression'
import cors from 'cors'
import bodyParser from 'body-parser' // Parsing body of incoming requests
import morgan from 'morgan'
import path from 'path'
import colors from 'colors'
import config from './config' // Config variables

const app: Express = express() // INITIALIZE EXPRESS APP HERE

// ***********************************************************
// BEGIN: MIDDLEWARE *****************************************
// ***********************************************************

// Returns a middleware to serve favicon
app.use(favicon(path.join(__dirname, config.app.public_dir, '/favicon.ico')))

// MORGAN REQUEST LOGGING:
app.use(morgan('dev'))

// BODY PARSER:
app.use(bodyParser.urlencoded({ extended: true })) // Allow 'application/x-www-form-urlencoded'
app.use(
  bodyParser.json({
    verify: (req: Request, res: Response, buf: any) => {
      req.rawBody = buf
    }
  })
)

// Begin logging in middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    colors.white.bold('---------------------------------------------------------------------')
  )

  next()
})

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
  ]

  app.use(
    cors({
      origin(origin: any, callback: any) {
        console.log(colors.white(`REQUEST ORIGIN: ${origin}<${typeof origin}>`))
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
    console.log(colors.white('[REDIRECT]: Redirecting to secure (HTTPS)'))

    res.redirect(301, `https://${req.hostname}${req.originalUrl}`)
  }
})

// LOGGER MIDDLEWARE:
// Middleware to log request info and timestamp
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(colors.white(`[URL_PART]: ${req.url}`))
  console.log(colors.white(`[URL_FULL]: http://${req.hostname}${req.originalUrl}`))
  console.log(colors.grey(`[TIME]: ${new Date().toString()}`))

  next()
})

// STATIC FILES:
// Note the custom cache headers using the options object param in express.static
app.use(
  express.static(path.join(__dirname, config.app.public_dir), {
    etag: true, // Just being explicit about the default.
    lastModified: true, // Just being explicit about the default.
    setHeaders: (res: Response, path: string) => {
      const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.')

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
  console.log(colors.cyan('[NOTICE]: Using catch-all route handler - Returning entry file.'))

  res.sendFile(path.join(__dirname, config.app.entry_file))
})

// ERROR HANDLING:
// Middleware to catch unhandled requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = { ...new Error('Not found'), status: 404 }

  next(error)
})

// Middleware to pass down all other errors not caught
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(colors.red.bold(`[ERROR]:  ${error.message}`))

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
  console.log(colors.red.bold(`[ERROR]: Unhandled Rejection at: ${p}, Reason: ${reason}`))
})

app.listen(config.app.port, () => {
  console.log(colors.green.underline(`Server listening on port ${config.app.port}`))
})
