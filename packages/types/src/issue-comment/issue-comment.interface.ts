import { IntegrationAccount } from '../integration-account';
import { ModelNameEnum } from '../sync-action';

export interface IssueCommentCreateActionPayload {
  type: ModelNameEnum;
  integrationAccounts: Record<string, IntegrationAccount>;
  issueCommentId: string;
}
