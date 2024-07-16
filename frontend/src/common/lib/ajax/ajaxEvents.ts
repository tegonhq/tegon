/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Set of Callbacks to handle state transition of Ajax Requests.
 */
const errorCallbacks: Set<Function> = new Set();
const successCallbacks: Set<Function> = new Set();
const beforeRequestCallbacks: Set<Function> = new Set();

/**
 * Invoke a side effect before firing Ajax Requests.
 * @param ajaxCallback - Callback function.
 */
export function onBeforeRequest(ajaxCallback: Function) {
  beforeRequestCallbacks.add(ajaxCallback);
}

/**
 * Clear side effect added to fire before Ajax Requests.
 * @param ajaxCallback - Callback function.
 */
export function offBeforeRequest(ajaxCallback: Function) {
  beforeRequestCallbacks.delete(ajaxCallback);
}

/**
 * Invoke a side effect on Failure of Ajax Requests.
 * @param errCallback - Callback function.
 */
export function onError(errCallback: Function) {
  errorCallbacks.add(errCallback);
}

/**
 * Clear side effect added to fire on Failure of Ajax Requests.
 * @param errCallback - Callback function.
 */
export function offError(errCallback: Function) {
  errorCallbacks.delete(errCallback);
}

/**
 * Invoke a side effect on Success of Ajax Requests.
 * @param successCallback - Callback function.
 */
export function onSuccess(successCallback: Function) {
  successCallbacks.add(successCallback);
}

/**
 * Clear side effect added to fire on Success of Ajax Requests.
 * @param errCallback - Callback function.
 */
export function offSuccess(successCallback: Function) {
  successCallbacks.delete(successCallback);
}

/**
 * @internal
 * Trigger Callbacks listening for `beforeRequest` Ajax event.
 * @param args - Set of Attributes related to Ajax event.
 */
export function triggerBeforeRequest(...args: any[]) {
  beforeRequestCallbacks.forEach((cb: Function) => {
    cb(...args);
  });
}

/**
 * @internal
 * Trigger Callbacks listening for `error` Ajax event.
 * @param args - Set of Attributes related to Ajax event.
 */
export function triggerError(...args: any[]) {
  errorCallbacks.forEach((cb: Function) => {
    cb(...args);
  });
}

/**
 * @internal
 * Trigger Callbacks listening for `success` Ajax event.
 * @param args - Set of Attributes related to Ajax event.
 */
export function triggerSuccess(...args: any[]) {
  successCallbacks.forEach((cb: Function) => {
    cb(...args);
  });
}
