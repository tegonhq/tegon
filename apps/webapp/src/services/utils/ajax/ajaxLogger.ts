import type { Plugin, Response, SuperAgentRequest } from 'superagent';

import { v4 as uuid } from 'uuid';

/**
 * @internal
 * Interface for Log Message from Ajax Methods.
 */
export interface LogMessage {
  /**
   * Outbound Request Id.
   * This is sent along with the Request in `X-UpNext-Request-Id` header.
   */
  requestId: string;
  /** User Session Id. */
  sessionId: string | undefined;
  /** Outbound URL. */
  url: string;
  /** HTTP Method. */
  method: string;
  /** HTTP Status Code (`(pending)` if not available yet). */
  status: number | '(pending)';
  /**
   * Time Elapsed (in ms) between Outbound Request and Response.
   * This will not be present for Outgoing Logs.
   */
  elapsedInMs?: number;
  /** Request Timestamp. */
  timestamp: string;
}

/**
 * @internal
 * Interface for Logger to handle Log Messages from Ajax Methods.
 */
interface AjaxLogger {
  (logMessage: LogMessage): void;
}

/**
 * @internal
 * Ajax Request Logger Options.
 */
interface WithLoggerOptions {
  /** Enable Logging for Outbound Requests (Defaults to `false`). */
  outgoing?: boolean;
}

/**
 * @internal
 * Logger Implementation for SuperAgent Request object.
 * @param logger Logger Implementation (Defaults to `console.debug`).
 * @param options Customisation Options for Logger.
 */
export const withLogger = (
  // eslint-disable-next-line no-console
  logger: AjaxLogger = console.debug,
  { outgoing = false }: WithLoggerOptions = {},
): Plugin => {
  return (request: SuperAgentRequest) => {
    const startTime = new Date();
    const requestId = uuid();

    const { method, url } = request;
    request.set('X-UpNext-Request-Id', requestId);

    if (outgoing) {
      logger({
        requestId,
        sessionId: undefined,
        url,
        method,
        status: '(pending)',
        timestamp: startTime.toISOString(),
      });
    }

    request.on('response', (response: Response) => {
      const endTime = new Date();
      const timeElapsed = endTime.getTime() - startTime.getTime();

      const { status } = response;
      logger({
        requestId,
        sessionId: undefined,
        url,
        method,
        status,
        elapsedInMs: timeElapsed,
        timestamp: startTime.toISOString(),
      });
    });
  };
};
