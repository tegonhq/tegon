/** Copyright (c) 2024, Tegon, all rights reserved. **/

export type labelDataType = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostRequestBody = Record<string, any>;

export const eventsToListen = new Map([
  ['issues', true],
  ['issue_comment', true],
  ['label', true],
  ['installation_repositories', true],
  ['pull_request', true],
  ['installation', true],
]);
