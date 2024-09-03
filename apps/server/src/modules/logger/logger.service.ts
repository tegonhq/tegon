import { Injectable } from '@nestjs/common';
import { WinstonModuleOptions } from 'nest-winston';
import winston, { Logger as WinstonLogger, createLogger } from 'winston';
import {
  GetPrintFormatInput,
  GetPrintFormatPayload,
  LogInput,
  LoggerPrintFormat,
} from './logger.interface';
import { ALS_SERVICE_INSTANCE } from 'modules/als/als.service';
import config from 'common/configs/config';
import { LogConfigs } from 'common/configs/config.interface';

@Injectable()
export class LoggerService {
  readonly logger: WinstonLogger;
  private logLevel: string = 'info';
  private logFileName: string = 'combined.log';

  constructor(private readonly context?: string) {
    // Set log level to only print log which are having higher or equal level then input level.
    this.logLevel = this.loggerConfigs.level ?? 'info';

    // Common format for console and file logs
    const commonFormat: winston.Logform.Format[] = [
      winston.format.splat(),
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
    ];

    // By default set format for console level logs
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: this.logLevel,
        format: winston.format.combine(
          ...commonFormat,
          winston.format.printf(this.getPrintFormat({ isConsoleFormat: true })),
        ),
      }),
    ];

    // If createLogFile env is set to true then append logs in file.
    if (this.loggerConfigs.createLogFile) {
      transports.push(
        new winston.transports.File({
          level: this.logLevel,
          filename: this.logFileName,
          format: winston.format.combine(
            ...commonFormat,
            winston.format.printf(
              this.getPrintFormat({ isConsoleFormat: false }),
            ),
          ),
        }),
      );
    }

    const createLoggerConfig: WinstonModuleOptions = {
      level: this.logLevel,
      transports,
    };

    // create winston logger
    this.logger = createLogger(createLoggerConfig);
  }

  /**
   * Private getter to return logger configs.
   *
   * @returns LogConfigs type having logger configs.
   */
  private get loggerConfigs(): LogConfigs {
    return config().log;
  }

  /**
   * Function to get logger print format based on transport format
   *
   * @param   input  GetPrintFormatInput type input to configure logger print format.
   * @returns GetPrintFormatPayload type output which return TransformableInfo function.
   */
  getPrintFormat(input: GetPrintFormatInput): GetPrintFormatPayload {
    const { isConsoleFormat } = input;
    return ({ level = 'info', message, timestamp, err, ...metadata }) => {
      const workspaceId = ALS_SERVICE_INSTANCE.get<string>('workspaceId');

      const loggerPrintFormat: LoggerPrintFormat = {
        timestamp,
        lvl: level,
        ctx: this.context,
        msg: message,
        wId: workspaceId,
      };

      if (err) {
        loggerPrintFormat.error = err.stack || err;
      }

      if (metadata?.error && Object.keys(metadata?.error).length) {
        loggerPrintFormat.error = metadata?.error;
      }

      if (metadata?.payload && Object.keys(metadata?.payload).length) {
        loggerPrintFormat.payload = metadata?.payload;
      }

      // if console format the early return. no need to print extra info in console.
      if (isConsoleFormat) {
        return JSON.stringify(loggerPrintFormat);
      }

      const requestId = ALS_SERVICE_INSTANCE.get<string>('requestId');
      if (requestId) {
        loggerPrintFormat.reqId = requestId;
      }

      const opName = ALS_SERVICE_INSTANCE.get<string>('opName');
      if (opName) {
        loggerPrintFormat.opName = opName;
      }

      const actorId = ALS_SERVICE_INSTANCE.get<string>('actorId');
      if (actorId) {
        loggerPrintFormat.aId = actorId;
      }

      return JSON.stringify(loggerPrintFormat);
    };
  }

  get loggerInstance(): WinstonLogger {
    return this.logger;
  }

  log(input: LogInput) {
    this.logger.info(input);
  }

  info(input: LogInput) {
    this.logger.info(input);
  }

  error(input: LogInput) {
    this.logger.error(input);
  }

  warn(input: LogInput) {
    this.logger.warn(input);
  }

  debug(input: LogInput) {
    this.logger.debug(input);
  }

  verbose(input: LogInput) {
    this.logger.verbose(input);
  }
}
