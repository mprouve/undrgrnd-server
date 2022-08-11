import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
const { combine, timestamp, errors, json } = format

const buildLoggerProd = (): any => {
  // Transport to print logs to console
  const consoleTransport = new transports.Console()
  // Transport to print all error logs to errors.log file
  const errorsFileTransport = new transports.File({
    filename: 'logs/errors.log',
    level: 'error'
  })
  // Transport to create a log rotation for combined logs
  const combinedFileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d'
  })
  const fileExceptionHandler = new transports.File({ filename: 'logs/exceptions.log' })
  const fileRejectionHandler = new transports.File({ filename: 'logs/rejections.log' })

  /**
   * The below 4 listeners can be uncomment to run code during specific events:
   * 1) When a log file is created
   * 2) When a log file is rotated
   * 3) when a log file is archived
   * 4) when a log file is deleted
   */
  // combinedFileRotateTransport.on('new', (filename) => {})
  // combinedFileRotateTransport.on('rotate', (oldFilename, newFilename) => {})
  // combinedFileRotateTransport.on('archive', (zipFilename) => {})
  // combinedFileRotateTransport.on('logRemoved', (removedFilename) => {})

  const logger = createLogger({
    level: 'http',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [consoleTransport, errorsFileTransport, combinedFileRotateTransport],
    exceptionHandlers: [fileExceptionHandler],
    rejectionHandlers: [fileRejectionHandler]
  })

  return logger
}

export default buildLoggerProd
