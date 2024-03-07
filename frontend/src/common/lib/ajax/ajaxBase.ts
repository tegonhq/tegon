/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type request from 'superagent';

import { Primitive } from 'zod';

/**
 * Integration of Native Promise Interface.
 */
export interface ExtendedPromise<T> extends Promise<T> {
  /** Cancel method to call off Ajax */
  cancel?: request.SuperAgentRequest['abort'];
  /** Reference to original Ajax Request Object */
  xhr?: request.SuperAgentRequest;
}

/**
 * Debug Message Interface for Ajax Methods.
 */
export interface DebugMessage {
  /** ISO Formatted Representation of Datetime */
  time: string;
  /** Request URL */
  url: string;
}

/**
 * Storage Interface to contain Debug Messages coming out of Ajax Methods.
 */
interface DebuggerStore {
  /** Inserts debug message to Debugger Store */
  push(debugMessage: DebugMessage): void;
}

/**
 * @internal
 * Ajax Base Configuration.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AjaxBaseConfig<D = unknown, T = any, E = unknown> {
  /** HTTP Method for Ajax Request (Required) */
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** HTTP URL Endpoint for Ajax Request (Required) */
  url: string;
  /** Request Cookies (Required for Server-side Data Fetching) */
  cookies?: Record<string, string>;
  /** Store to publish Debug Logs */
  debuggerStore?: DebuggerStore;
  /** Boolean flag to disable Request Logging on Server */
  disableLogging?: boolean;
  /** Boolean flag to disable Ajax Lifecycle Events */
  disableEvents?: boolean;
  /** Request Body for POST/PUT/PATCH request */
  data?: D;
  /** Additional Headers to send with Ajax Request */
  headers?: Record<string, string | number | boolean>;
  /**
   * Boolean flag to enable JSON API content request
   * (Ref: https://jsonapi.org/format/)
   */
  jsonApi?: boolean;
  /**
   * Boolean flag to Ignore CSRF Token
   * (Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
   */
  noCSRF?: boolean;
  /** Error handler for Ajax request */
  onError?: (error: XHRErrorResponse<E>) => void;
  /** Success handler for Ajax request */
  onSuccess?: (data: T | string, resHeaders: Record<string, string>) => void;
  /** Progress event handler for Upload Ajax Request */
  onProgress?: (progress: request.ProgressEvent) => void;
  /** Serializable query parameters to send with GET request */
  query?: Record<string, Primitive>;
  /** Maximum wait time before aborting Ajax due to timeout */
  timeout?: number;
  /** Boolean flag to identify a Ajax request as long running File Upload */
  upload?: boolean;
  /**
   * Boolean flag to set `withCredentials` property `true` for Ajax
   * (Ref: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
   */
  withCredentials?: boolean;
}

/**
 * @internal
 * Error Metadata recieved in Failed XHR.
 */
interface XHRError {
  body?: {
    details?: string;
  };
  text?: string;
}

/**
 * Error Metadata associated with XHR.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export interface XHRErrorResponse<TError extends unknown = string[]> {
  /** Errors sent in body of Error response */
  errors?: TError;
  /** Text Message sent in body of Error response */
  message?: string;
  /**
   * Original Ajax Error response
   * (should only be used for Instrumentation purposes)
   */
  originalResponse?: XHRError;
  /** HTTP URL Endpoint for Ajax Request */
  reqUrl: string;
  /** HTTP Status Code except 2xx */
  resStatus?: number;
  /** Boolean that represents if errored due to Timeout */
  timeout: boolean;
}
