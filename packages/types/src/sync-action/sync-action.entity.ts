import { Workspace } from '../workspace';

export enum ModelNameEnum {
  Action = 'Action',
  ActionEntity = 'ActionEntity',
  ActionEvent = 'ActionEvent',
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
  Project = 'Project',
  ProjectMilestone = 'ProjectMilestone',
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
  ActionEvent: 'ActionEvent',
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
  Project: 'Project',
  ProjectMilestone: 'ProjectMilestone',
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

export enum SyncActionTypeEnum {
  I = 'I',
  U = 'U',
  D = 'D',
}

export const SyncActionType = {
  I: 'I',
  U: 'U',
  D: 'D',
};

export type SyncActionType =
  (typeof SyncActionType)[keyof typeof SyncActionType];

export interface ReplicationPayload {
  action: string;
  modelId: string;
  modelName: string;
  isDeleted: boolean;
  actionApiKey: string;
}

export class SyncAction {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  modelName: ModelName;
  modelId: string;

  action: SyncActionType;
  sequenceId: bigint;
  workspace?: Workspace;
  workspaceId: string;
}
