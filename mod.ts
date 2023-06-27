import { ConnInfo } from './dev_depts.ts';
import { FileLogger } from './transports/filelogger.ts';

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  trace = 'trace',
  info = 'info',
  log = 'log',
}

export interface transporter {
  callback?: (log: string) => void;
}

export interface LoggerOptions {
  output?: transporter[];
  ip?: boolean;
  level?: LogLevel;
  userAgent?: boolean;
  filename?: string;
}

const generateLog =
  (req: Request, res: Response, connInfo?: ConnInfo) =>
  (logArray: (string | number)[], options?: LoggerOptions) => {
    const url = new URL(req.url);

    logArray.push('[' + (options?.level ?? LogLevel.log).toUpperCase() + ']');

    if (options?.ip) {
      logArray.push((connInfo!.remoteAddr as Deno.NetAddr)?.hostname ?? '');
    }
    logArray.push(res.status);
    logArray.push(req.method.toUpperCase());
    logArray.push(url.pathname);
    logArray.push(url.protocol.slice(0, -1));
    if (options?.userAgent) logArray.push(req.headers.get('user-agent') ?? '');
  };

/**
 * @callback callback
 * @param {string} log
 * @returns
 */

/**
 * @param {boolean} options.ip displays the IP address of the request
 * @param {string} options.level - displays the level
 * @param {string=} options.filename - file to output logs
 * @param {boolean} options.userAgent - displays the user-agent from header if it exists
 * @param {Object[]} options.transporter - list of outputs to use
 * @param {callback} options.transporter[].callback - callback function
 * @returns void
 */
export const logger = (options?: LoggerOptions) => {
  const defaultOptions: transporter[] = [{ callback: console.log }];
  const output = options?.output ?? defaultOptions;
  let filelogger: FileLogger;
  if (options?.filename) {
    filelogger = new FileLogger(options.filename);
  }
  const callBackList = output
    .filter((o) => !!o.callback)
    .map((o) => o.callback);

  return (req: Request, res: Response, connInfo?: ConnInfo) => {
    const args: string[] = [];
    generateLog(req, res, connInfo)(args, options);
    const logString = args.filter((x) => x.length).join(' ');
    if (filelogger) filelogger.toFile(logString);
    callBackList.forEach((cb) => cb!(logString));
  };
};
