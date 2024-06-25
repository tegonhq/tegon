/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ModelName } from '@prisma/client';

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
  [ModelName.Workspace, true],
  [ModelName.Team, true],
  [ModelName.TeamPreference, true],
  [ModelName.Issue, true],
  [ModelName.Label, true],
  [ModelName.Workflow, true],
  [ModelName.Template, true],
  [ModelName.IssueComment, true],
  [ModelName.IssueHistory, true],
  [ModelName.UsersOnWorkspaces, true],
  [ModelName.IntegrationAccount, true],
  [ModelName.IntegrationDefinition, true],
  [ModelName.LinkedIssue, true],
  [ModelName.IssueRelation, true],
  [ModelName.Notification, true],
  [ModelName.View, true],
  [ModelName.IssueSuggestion, true],
]);
