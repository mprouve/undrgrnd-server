import morgan, { StreamOptions } from 'morgan'
import logger from '../../logger/index'
import config from '../../config'

const skip = () => config.env === 'production'
const stream: StreamOptions = {
  write: (message) => {
    logger.http(message)
  }
}
const morganMiddleware = morgan('tiny', { stream, skip })

export default morganMiddleware
