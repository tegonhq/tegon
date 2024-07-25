import type { AjaxBaseConfig, ExtendedPromise } from './ajaxBase';
import type { SuperAgentRequest } from 'superagent';

import { triggerBeforeRequest } from './ajaxEvents';
import { makeAjaxCall } from './ajaxHelper';
import { isServer } from '../common';

/**
 * @internal
 * Base Ajax method that handles XHR creation based upon recieved Configuration.
 * @param config - Ajax Configuration Object.
 * @returns An Extended Promise object.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ajax = <D, T, E extends unknown>(
  config: AjaxBaseConfig<D, T, E>,
): ExtendedPromise<T> => {
  let xhr: SuperAgentRequest | undefined;

  const promise: ExtendedPromise<T> = new Promise<T>((resolve, reject) => {
    const { debuggerStore, disableEvents, url } = config;

    debuggerStore?.push({
      time: new Date().toISOString(),
      url: `Ajax request started for ${url}`,
    });

    if (!isServer() && !disableEvents) {
      triggerBeforeRequest(config);
    }

    xhr = makeAjaxCall<D, T, E>({ config, resolve, reject });
  });

  /* istanbul ignore else */
  if (xhr) {
    promise.cancel = xhr.abort.bind(xhr);
    promise.xhr = xhr;
  }

  return promise;
};
