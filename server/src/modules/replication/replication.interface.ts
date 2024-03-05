/** Copyright (c) 2024, Tegon, all rights reserved. **/

// import { ModelName } from '@prisma/client';

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
  ['Workspace', true],
  ['Team', true],
  ['TeamPreference', true],
  ['Issue', true],
  ['Label', true],
  ['Workflow', true],
  ['Template', true],
  ['IssueComment', true],
  ['IssueHistory', true],
  ['UsersOnWorkspaces', true],
]);
