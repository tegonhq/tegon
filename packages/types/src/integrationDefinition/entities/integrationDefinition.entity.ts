import { JsonValue } from '../../common';
import { IntegrationAccount } from '../../integrationAccount/entities';
import { Workspace } from '../../workspace/entities/workspace.entity';

export enum IntegrationName {
  Github = 'Github',
  GithubPersonal = 'GithubPersonal',
  Slack = 'Slack',
  SlackPersonal = 'SlackPersonal',
  Sentry = 'Sentry',
  Gmail = 'Gmail',
}

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
