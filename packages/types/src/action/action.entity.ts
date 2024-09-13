import { ActionEntity } from '../action-entity';
import { ActionTypesEnum, JsonValue } from '../common';
import { Workspace } from '../workspace';

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

export type ActionTrigger = OnCreateUpdateDeleteTrigger | SourceWebhookTrigger;

export interface ActionConfig {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  triggers: ActionTrigger[];
  integrations: string[];
  inputs: any;
}

export const ActionStatus = {
  INSTALLED: 'INSTALLED',
  NEEDS_CONFIGURATION: 'NEEDS_CONFIGURATION',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEPLOYING: 'DEPLOYING',
  ERRORED: 'ERRORED',
};

export enum ActionStatusEnum {
  INSTALLED = 'INSTALLED',
  NEEDS_CONFIGURATION = 'NEEDS_CONFIGURATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEPLOYING = 'DEPLOYING',
  ERRORED = 'ERRORED',
}

export type ActionStatus = (typeof ActionStatus)[keyof typeof ActionStatus];

export class Action {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;

  config: JsonValue;
  data?: any;

  status: ActionStatus;
  isDev: boolean;
  isPersonal: boolean;

  triggerVersion: string;
  version: string;

  name: string;
  slug: string;
  integrations: string[];

  cron?: string;

  workspace?: Workspace;
  workspaceId: string;
  actionEntity?: ActionEntity[];

  createdById: string;
}
