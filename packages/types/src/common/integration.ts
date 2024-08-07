import { IntegrationAccount } from '../integration-account';
import { Issue } from '../issue';
import { IssueComment } from '../issue-comment';
import { LinkedIssue } from '../linked-issue';
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
}
type ModelPayload = TwoWaySyncInput | TwoWaySyncIssueCommentInput;

export interface IntegrationInternalInput {
  integrationAccount: IntegrationAccount;
  accesstoken: string;
  modelName: ModelNameEnum;
  actionType: InternalActionTypeEnum;
  modelPayload: ModelPayload;
}
