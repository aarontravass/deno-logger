import { ConnInfo } from "./dev_depts.ts";

export enum LogLevel {
  error = "error",
  warn = "warn",
  trace = "trace",
  info = "info",
  log = "log",
}

export interface transporter {
  callback?: (log: string) => void;
  filename?: string;
}

export interface LoggerOptions {
  output?: transporter[];
  ip?: boolean;
  level?: LogLevel;
  userAgent?: boolean;
}

const generateLog =
  (req: Request, res: Response, connInfo?: ConnInfo) =>
  (logArray: (string | number)[], options?: LoggerOptions) => {
    const url = new URL(req.url);

    logArray.push("[" + (options?.level ?? LogLevel.log).toUpperCase() + "]");

    if (options?.ip)
      logArray.push((connInfo!.remoteAddr as Deno.NetAddr)?.hostname ?? "");
    logArray.push(res.status);
    logArray.push(req.method.toUpperCase());
    logArray.push(url.pathname);
    logArray.push(url.protocol.slice(0, -1));
    if (options?.userAgent) logArray.push(req.headers.get("user-agent") ?? "");
  };

/**
 * @callback callback
 * @param {string} log
 * @returns 
 */

/**
 * @param {boolean} options.ip displays the IP address of the request
 * @param {string} options.level - displays the level
 * @param {boolean} options.userAgent - displays the user-agent from header if it exists
 * @param {Object[]} options.transporter - list of outputs to use
 * @param {string=} options.transporter[].filename - file to output logs
 * @param {callback} options.transporter[].callback - callback function
 * @returns void
 */
export const logger = (options?: LoggerOptions) => {
  const defaultOptions: transporter[] = [{ callback: console.log }];
  const output = options?.output ?? defaultOptions;

  const callBackList = output
    .filter((o) => !!o.callback)
    .map((o) => o.callback);

  return (req: Request, res: Response, connInfo?: ConnInfo) => {
    const args: string[] = [];
    generateLog(req, res, connInfo)(args, options);
    const logString = args.filter((x) => x.length).join(" ");
    callBackList.forEach((cb) => cb!(logString));
  };
};
