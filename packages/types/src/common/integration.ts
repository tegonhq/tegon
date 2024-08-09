import { IntegrationAccount } from '../integration-account';
import { Issue } from '../issue';
import { IssueComment } from '../issue-comment';
import { LinkedIssue, LinkIssueInput } from '../linked-issue';
import { ModelNameEnum } from '../sync-action';
import { User } from '../user';

export interface TwoWaySyncInput {
  issue: Issue;
  linkedIssue?: LinkedIssue;
}

export interface TwoWaySyncIssueCommentInput {
  issueComment: IssueComment;
  action: string;
  user: User;
}

export enum InternalActionTypeEnum {
  TwoWaySync = 'TwoWaySync',
  LinkIssue = 'LinkIssue',
  IntegrationSettings = 'IntegrationSettings',
  IntegrationDelete = 'IntegrationDelete',
}
type ModelPayload = TwoWaySyncInput | TwoWaySyncIssueCommentInput;

export interface TwoWaySyncPayload {
  modelName: ModelNameEnum;
  modelPayload: ModelPayload;
}

export interface LinkIssuePayload extends LinkIssueInput {
  userId: string;
  issueId: string;
}

export interface IntegrationAccountSettingsPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settingsData?: Record<string, any>;
}

type Payload =
  | TwoWaySyncPayload
  | LinkIssuePayload
  | IntegrationAccountSettingsPayload;

export interface IntegrationInternalInput {
  integrationAccount?: IntegrationAccount;
  actionType: InternalActionTypeEnum;
  accesstoken: string;
  payload: Payload;
}
