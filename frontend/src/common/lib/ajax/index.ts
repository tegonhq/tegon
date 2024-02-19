/** Copyright (c) 2024, Tegon, all rights reserved. **/

export type { DebugMessage, XHRErrorResponse } from './ajaxBase';
export {
  offBeforeRequest,
  offError,
  offSuccess,
  onBeforeRequest,
  onError,
  onSuccess,
} from './ajaxEvents';
export * from './ajaxMethods';
