import { ConnInfo } from "./dev_depts.ts";

export enum LogLevel {
  error = "error",
  warn = "warn",
  trace = "trace",
  info = "info",
  log = "log",
}

export interface LoggerOptions {
  output?: {
    level?: LogLevel;
    callback: (log: string) => void;
  };
  ip?: boolean;
}

const generateLog =
  (req: Request, res: Response, connInfo?: ConnInfo) =>
  (logArray: string[], options: LoggerOptions) => {
    const url = new URL(req.url);

    logArray.push(
      "[" + (options.output?.level || LogLevel.log).toUpperCase() + "]"
    );
    
    if (options?.ip)
      logArray.push((connInfo?.remoteAddr as Deno.NetAddr)?.hostname ?? "");
    logArray.push(res.status.toString());
    logArray.push(req.method.toUpperCase());
    logArray.push(url.pathname);
  };

export const logger = (options: LoggerOptions) => {
  const output = options.output ?? {
    callback: console.log,
    level: LogLevel.log,
  };

  return (req: Request, res: Response, connInfo?: ConnInfo) => {
    const args: string[] = [];
    generateLog(req, res, connInfo)(args, options);
    const logString = args.join(" ");
    output.callback(logString);
  };
};
