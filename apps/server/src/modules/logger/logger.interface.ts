import winston from 'winston';

export interface LogInput {
  message: string;
  payload?: Record<string, any>;
  where?: string;
  error?: Error;
}

export interface GetPrintFormatInput {
  isConsoleFormat?: boolean;
}

export type GetPrintFormatPayload = (
  info: winston.Logform.TransformableInfo,
) => string;

export interface LoggerPrintFormat {
  timestamp: string; // log timestamp
  lvl: string; // log level
  ctx: string; // logger context
  msg: string; //message
  wId: string; // workspace id
  payload?: Record<string, any>; // payload
  opName?: string; // operation or endpoint name from where the request was initiated
  reqId?: string; // request id
  aId?: string; // current request's user id
  error?: Error;
}
