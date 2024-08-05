import { Workspace } from '../workspace';

export enum ModelName {
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

export enum ActionType {
  I = 'I',
  U = 'U',
  D = 'D',
}

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
