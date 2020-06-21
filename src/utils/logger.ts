import Logger from 'bunyan';

export interface WrappedLogger {
  info: Function;
  debug: Function;
  trace: Function;
  warn: Function;
  error: Function;
}

function createWriter(
  traceId: string,
  loggerObject: any,
  logger: Function
): Function {
  return function write(...args: any[]) {
    if (logger.call(loggerObject) && typeof args[0] === 'object') {
      const obj = args.shift();
      logger.call(loggerObject, { traceId, ...obj }, ...args);
    } else {
      logger.call(loggerObject, { traceId }, ...args);
    }
  };
}

export function wrapLogger(traceId: string, logger: Logger): WrappedLogger {
  const result: WrappedLogger = {
    info: createWriter(traceId, logger, logger.info),
    debug: createWriter(traceId, logger, logger.debug),
    trace: createWriter(traceId, logger, logger.trace),
    warn: createWriter(traceId, logger, logger.warn),
    error: createWriter(traceId, logger, logger.error),
  };
  return result;
}
