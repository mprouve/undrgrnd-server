import colors from 'colors'
import { logger } from './util/classes/console-logger'

// SETUP ENVIRONMENT VARIABLE
let env

if (
  process.env.NODE_ENV === 'local' ||
  process.env.NODE_ENV === 'undefined' ||
  typeof process.env.NODE_ENV === 'undefined'
) {
  env = 'local'
} else if (process.env.NODE_ENV === 'production') {
  env = 'production'
} else {
  env = 'local'
}

type EnvironmentType = {
  env: string
  NODE_ENV: string | undefined
  debug: boolean
  app: {
    url: string
    port: string | number
    public_dir: string
    entry_file: string
  }
}

// ****************************************
// PRODUCTION *****************************
// ****************************************
const production: EnvironmentType = {
  env,
  NODE_ENV: process.env.NODE_ENV,
  debug: false,
  app: {
    url: 'https://www.theundrgrnd.xyz',
    port: process.env.PORT || 10000,
    public_dir: '../src/public',
    entry_file: '../src/public/index.html'
  }
}

// ****************************************
// LOCAL **********************************
// ****************************************
const local: EnvironmentType = {
  env,
  NODE_ENV: process.env.NODE_ENV,
  debug: true,
  app: {
    url: 'http://localhost:3000',
    port: process.env.PORT || 10000,
    public_dir: 'public',
    entry_file: 'public/index.html'
  }
}

const config = <EnvironmentType>{
  production,
  local
}[env]

config.debug && logger.log(colors.magenta(`NODE_ENVIRONMENT: ${process.env.NODE_ENV}`))
config.debug && logger.log(colors.magenta(`PLATFORM_ENVIRONMENT: ${env}`))

export default config
