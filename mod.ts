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
  (req: Request, res: Response) =>
  (logArray: string[], options?: LoggerOptions) => {
    const url = req["originalUrl"] || req.url;

    if (options?.output?.level)
      logArray.push("[" + options.output?.level.toUpperCase() + "]");

    if (options?.ip) logArray.push(req.headers.get("host") ?? "");

    logArray.push(res.status.toString());
    logArray.push(req.method.toUpperCase());
    logArray.push(url);
  };

export const logger = (options: LoggerOptions) => {
  const output = options.output ?? {
    callback: console.log,
    level: LogLevel.log,
  };
  return (req: Request, res: Response, next?: () => void) => {
    const args: string[] = [];
    generateLog(req, res)(args, options);
    const logString = args.join(" ");
    output.callback(logString);
  };
};
