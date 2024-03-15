/** Copyright (c) 2024, Tegon, all rights reserved. **/

export type labelDataType = Record<string, string>;

export type PostRequestBody = Record<string, any>;

export const eventsToListen = new Map([
  ['issues', true],
  ['issue_comment', true],
  ['label', true],
]);
