import { ActionTypesEnum } from '@tegonhq/types';

export interface ActionDeployDto {
  githubRepoUrl: string;
  workspaceId: string;
}

interface BaseTrigger {
  entities: string[];
}

interface OnCreateUpdateDeleteTrigger extends BaseTrigger {
  type:
    | ActionTypesEnum.ON_CREATE
    | ActionTypesEnum.ON_UPDATE
    | ActionTypesEnum.ON_DELETE;
  entities: Array<'Issue' | 'IssueComment' | 'LinkedIssue'>;
}

interface SourceWebhookTrigger extends BaseTrigger {
  type: ActionTypesEnum.SOURCE_WEBHOOK;
}

export type Trigger = OnCreateUpdateDeleteTrigger | SourceWebhookTrigger;

interface Config {
  name: string;
  triggers: Trigger[];
  integrations: string[];
}

export interface ActionCreateResource {
  config: Config;
  workspaceId: string;
}
