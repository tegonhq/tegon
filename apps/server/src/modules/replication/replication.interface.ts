import { ModelNameEnum } from '@tegonhq/types';

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
  [ModelNameEnum.Workspace, true],
  [ModelNameEnum.Team, true],
  [ModelNameEnum.TeamPreference, true],
  [ModelNameEnum.Issue, true],
  [ModelNameEnum.Label, true],
  [ModelNameEnum.Workflow, true],
  [ModelNameEnum.Template, true],
  [ModelNameEnum.IssueComment, true],
  [ModelNameEnum.IssueHistory, true],
  [ModelNameEnum.UsersOnWorkspaces, true],
  [ModelNameEnum.IntegrationAccount, true],
  [ModelNameEnum.LinkedIssue, true],
  [ModelNameEnum.IssueRelation, true],
  [ModelNameEnum.Notification, true],
  [ModelNameEnum.View, true],
  [ModelNameEnum.IssueSuggestion, true],
  [ModelNameEnum.Action, true],
  [ModelNameEnum.ActionEntity, true],
  [ModelNameEnum.Project, true],
  [ModelNameEnum.ProjectMilestone, true],
  [ModelNameEnum.Cycle, true],
]);

export const tablesToTrigger = new Map([
  [ModelNameEnum.Issue, true],
  [ModelNameEnum.IssueComment, true],
  [ModelNameEnum.LinkedIssue, true],
]);
