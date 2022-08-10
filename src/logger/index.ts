import config from '../config'
import buildLoggerDev from './logger-dev'
import buildLoggerProd from './logger-prod'

const logger = config?.env === 'production' ? buildLoggerProd() : buildLoggerDev()

export default logger
