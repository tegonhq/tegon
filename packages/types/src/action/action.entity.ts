import { ActionEntity } from '../action-entity';
import { ActionTypesEnum } from '../common';
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
  guide?: string;
  triggers: ActionTrigger[];
  integrations: string[];
  inputs: any;
  url: string;
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

  config: any;
  data?: any;

  status: ActionStatus;
  isPersonal: boolean;

  version: string;

  name: string;
  slug: string;
  integrations: string[];

  cron?: string;

  workspace?: Workspace;
  workspaceId: string;
  actionEntity?: ActionEntity[];

  createdById: string;

  url?: string;
}
