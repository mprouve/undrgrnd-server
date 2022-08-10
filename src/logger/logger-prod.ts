import { createLogger, format, transports } from 'winston'
const { combine, timestamp, errors, json } = format

const buildLoggerProd = (): any => {
  const logger = createLogger({
    level: 'http',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [
      // Transport to print logs to console
      new transports.Console(),
      // Transport to print all error logs to errors.log file
      new transports.File({ filename: 'logs/errors.log', level: 'error' })
      // Transport to print all logs to all.log file
      // new transports.File({ filename: 'logs/all.log' })
    ]
  })

  return logger
}

export default buildLoggerProd
