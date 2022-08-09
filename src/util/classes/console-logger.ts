/* eslint-disable no-console */
/** Signature of a logging function */
export interface LogFn {
  (message?: any, ...optionalParams: any[]): void
}

/** Basic logger interface */
export interface Logger {
  readonly log: LogFn
  readonly warn: LogFn
  readonly error: LogFn
}

/** Log levels */
export type LogLevel = 'log' | 'warn' | 'error'

const NO_OP: LogFn = (message?: any, ...optionalParams: any[]) => {} // eslint-disable-line

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn
  readonly warn: LogFn
  readonly error: LogFn

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {}

    this.error = console.error.bind(console)

    if (level === 'error') {
      this.warn = NO_OP
      this.log = NO_OP

      return
    }

    this.warn = console.warn.bind(console)

    if (level === 'warn') {
      this.log = NO_OP

      return
    }

    this.log = console.log.bind(console)
  }
}

export const logger = new ConsoleLogger()
