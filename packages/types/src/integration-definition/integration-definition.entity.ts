import { JsonValue } from '../common';
import { IntegrationAccount } from '../integration-account';
import { Workspace } from '../workspace';

export const IntegrationName = {
  Github: 'Github',
  GithubPersonal: 'GithubPersonal',
  Slack: 'Slack',
  SlackPersonal: 'SlackPersonal',
  Sentry: 'Sentry',
  Gmail: 'Gmail',
};

export enum IntegrationNameEnum {
  Github = 'Github',
  GithubPersonal = 'GithubPersonal',
  Slack = 'Slack',
  SlackPersonal = 'SlackPersonal',
  Sentry = 'Sentry',
  Gmail = 'Gmail',
}

export type IntegrationName =
  (typeof IntegrationName)[keyof typeof IntegrationName];

export class IntegrationDefinition {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: IntegrationName;
  icon: string;
  spec: JsonValue;
  clientId: string;
  clientSecret: string;
  scopes: string;
  workspace?: Workspace;
  workspaceId: string;
  IntegrationAccount?: IntegrationAccount[];
}
