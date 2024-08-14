import { Workspace } from '../workspace';

export enum ModelNameEnum {
  Action = 'Action',
  ActionEntity = 'ActionEntity',
  Attachment = 'Attachment',
  AIRequest = 'AIRequest',
  Emoji = 'Emoji',
  IntegrationAccount = 'IntegrationAccount',
  IntegrationDefinitionV2 = 'IntegrationDefinitionV2',
  Invite = 'Invite',
  Issue = 'Issue',
  IssueComment = 'IssueComment',
  IssueHistory = 'IssueHistory',
  IssueRelation = 'IssueRelation',
  IssueSuggestion = 'IssueSuggestion',
  Label = 'Label',
  LinkedComment = 'LinkedComment',
  LinkedIssue = 'LinkedIssue',
  Notification = 'Notification',
  Prompt = 'Prompt',
  Reaction = 'Reaction',
  SyncAction = 'SyncAction',
  Team = 'Team',
  TeamPreference = 'TeamPreference',
  Template = 'Template',
  TriggerProject = 'TriggerProject',
  User = 'User',
  UsersOnWorkspaces = 'UsersOnWorkspaces',
  View = 'View',
  Workflow = 'Workflow',
  Workspace = 'Workspace',
  WorkspaceTriggerProject = 'WorkspaceTriggerProject',
}

export const ModelName = {
  Action: 'Action',
  ActionEntity: 'ActionEntity',
  Attachment: 'Attachment',
  AIRequest: 'AIRequest',
  Emoji: 'Emoji',
  IntegrationAccount: 'IntegrationAccount',
  IntegrationDefinitionV2: 'IntegrationDefinitionV2',
  Invite: 'Invite',
  Issue: 'Issue',
  IssueComment: 'IssueComment',
  IssueHistory: 'IssueHistory',
  IssueRelation: 'IssueRelation',
  IssueSuggestion: 'IssueSuggestion',
  Label: 'Label',
  LinkedComment: 'LinkedComment',
  LinkedIssue: 'LinkedIssue',
  Notification: 'Notification',
  Prompt: 'Prompt',
  Reaction: 'Reaction',
  SyncAction: 'SyncAction',
  Team: 'Team',
  TeamPreference: 'TeamPreference',
  Template: 'Template',
  TriggerProject: 'TriggerProject',
  User: 'User',
  UsersOnWorkspaces: 'UsersOnWorkspaces',
  View: 'View',
  Workflow: 'Workflow',
  Workspace: 'Workspace',
  WorkspaceTriggerProject: 'WorkspaceTriggerProject',
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
