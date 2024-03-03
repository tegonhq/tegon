/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface logChangeType {
  kind: string;
  schema: string;
  table: string;
  columnnames: string[];
  columnvalues: string[];
  columntypes: string[];
  oldkeys: Record<string, string[]>;
}

export interface logType {
  change: logChangeType[];
}

export const tablesToSendMessagesFor = new Map([
  ['workspace', true],
  ['team', true],
  ['teampreference', true],
  ['issue', true],
  ['label', true],
  ['workflow', true],
  ['template', true],
  ['issuecomment', true],
  ['issuehistory', true],
  ['usersonworkspaces', true],
]);
