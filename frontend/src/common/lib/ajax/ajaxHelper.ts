/** Copyright (c) 2024, Tegon, all rights reserved. **/

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */

import type { AjaxBaseConfig, XHRErrorResponse } from './ajaxBase';
import type { Primitive } from 'zod';

import qs, { type ParsedQs } from 'qs';
import request from 'superagent';

import { onError, onSuccess } from './ajaxResponse';

/**
 * @internal
 * Updates URI with provided Query Parameters.
 * @param url - Base URI for a Resource.
 * @param query - Additional Query Parameters.
 * @returns Complete URI of the Resource
 */
function getRequestURL(
  url: string,
  query: Record<string, Primitive> = {},
): [path: string, query: ParsedQs] {
  const [pathname, search] = url.split('?');
  const queryParams = { ...query, ...qs.parse(search) } as ParsedQs;
  return [pathname, queryParams];
}

/**
 * @internal
 * Generates Cookie string to be sent with Request.
 * @param cookies - Cookies as Key Value pairs.
 * @returns Serialized and UI Encoded Cookie string.
 */
function getRequestCookies(cookies: Record<string, string>): string {
  return Object.entries(cookies).reduce(
    (cookieString: string, [key, value]: [string, string]) => {
      const encodedValue = encodeURIComponent(value);
      return `${cookieString}${key}=${encodedValue};`;
    },
    '',
  );
}

/**
 * @internal
 * Configuration Object to make Ajax Request.
 */
interface AjaxCallConfiguration<D, T, E> {
  /** Ajax Configuration Object */
  config: AjaxBaseConfig<D, T, E>;
  /** Resolver Function reference from Executor Function */
  resolve: Function;
  /** Rejection Function reference from Executor Function */
  reject: Function;
}

/**
 * @internal
 * Helper function to create a SuperAgent request instance with provided configuration.
 * @param param - An object encapsulating Ajax Configuration, Resolver Function and Rejection Function.
 * @returns Request object.
 */
export const makeAjaxCall = <D, T, E>({
  config,
  resolve,
  reject,
}: AjaxCallConfiguration<D, T, E>) => {
  const {
    cookies,
    data: reqData,
    debuggerStore,

    headers,
    jsonApi,
    method,

    onProgress,
    query,
    timeout,
    upload,
    url,
    withCredentials,
  } = config;

  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (cookies) {
    reqHeaders['Cookie'] = getRequestCookies(cookies);
  }

  if (jsonApi) {
    reqHeaders['Accept'] = 'application/vnd.api+json';
    if (method && method !== 'get') {
      reqHeaders['Content-Type'] = 'application/vnd.api+json';
    }
  }

  const requestMethod = request[method];
  const [reqUrl, queryObj] = getRequestURL(url, query);
  let requestInstance = requestMethod(reqUrl).set(reqHeaders).query(queryObj);

  if (timeout) {
    requestInstance = requestInstance.timeout(timeout);
  }

  if (withCredentials) {
    requestInstance = requestInstance.withCredentials();
  }

  const xhr = requestInstance.send(reqData as any);

  if (upload && onProgress) {
    xhr.on('progress', (e: request.ProgressEvent) => {
      onProgress(e);
    });
  }

  xhr.then(
    ({ body, text, headers }: request.Response) => {
      debuggerStore?.push({
        time: new Date().toISOString(),
        url: `Ajax request completed for ${url}`,
      });

      onSuccess<T, E>({
        config,
        data: (body as T) || text,
        headers,
        resolve,
      });
    },
    (err: request.ResponseError & { timeout?: boolean }) => {
      const { response: res, status, timeout } = err;

      debuggerStore?.push({
        time: new Date().toISOString(),
        url: `Ajax request errored for ${url}`,
      });

      // Serialize original response object
      let trimmedRes: request.Response | undefined;
      try {
        trimmedRes = JSON.parse(JSON.stringify(res));
      } catch (e) /* istanbul ignore next */ {
        trimmedRes = res;
      }

      const errRes: XHRErrorResponse<E> = {
        originalResponse: trimmedRes,
        reqUrl,
        resStatus: status,
        timeout: !!timeout,
      };

      const { body, text } = res ?? {};

      /** Body can either contain all the errors or a single description inside `details` property */
      if (body?.details) {
        errRes.message = body.details;
      } else if (body) {
        errRes.errors = body;
      } else if (text) {
        errRes.message = text;
      }

      onError<T, E>({ config, error: errRes, reject });
    },
  );

  return xhr;
};
