import { Workspace } from '../workspace';

export enum ModelNameEnum {
  Workspace = 'Workspace',
  Team = 'Team',
  TeamPreference = 'TeamPreference',
  Issue = 'Issue',
  Label = 'Label',
  Workflow = 'Workflow',
  Template = 'Template',
  IssueComment = 'IssueComment',
  IssueHistory = 'IssueHistory',
  UsersOnWorkspaces = 'UsersOnWorkspaces',
  IntegrationDefinition = 'IntegrationDefinition',
  IntegrationAccount = 'IntegrationAccount',
  LinkedIssue = 'LinkedIssue',
  IssueRelation = 'IssueRelation',
  Notification = 'Notification',
  View = 'View',
  IssueSuggestion = 'IssueSuggestion',
}

export const ModelName = {
  Workspace: 'Workspace',
  Team: 'Team',
  TeamPreference: 'TeamPreference',
  Issue: 'Issue',
  Label: 'Label',
  Workflow: 'Workflow',
  Template: 'Template',
  IssueComment: 'IssueComment',
  IssueHistory: 'IssueHistory',
  UsersOnWorkspaces: 'UsersOnWorkspaces',
  IntegrationDefinition: 'IntegrationDefinition',
  IntegrationAccount: 'IntegrationAccount',
  LinkedIssue: 'LinkedIssue',
  IssueRelation: 'IssueRelation',
  Notification: 'Notification',
  View: 'View',
  IssueSuggestion: 'IssueSuggestion',
};

export type ModelName = (typeof ModelName)[keyof typeof ModelName];

export enum ActionTypeEnum {
  I = 'I',
  U = 'U',
  D = 'D',
}

export const ActionType = {
  I: 'I',
  U: 'U',
  D: 'D',
};

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export class SyncAction {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  modelName: ModelName;
  modelId: string;
  action: ActionType;
  sequenceId: bigint;
  workspace?: Workspace;
  workspaceId: string;
}
