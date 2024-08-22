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
  triggers: ActionTrigger[];
  integrations: string[];
  inputs: any;
}

export const ActionStatus = {
  INSTALLED: 'INSTALLED',
  NEEDS_CONFIGURATION: 'NEEDS_CONFIGURATION',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
};

export enum ActionStatusEnum {
  INSTALLED = 'INSTALLED',
  NEEDS_CONFIGURATION = 'NEEDS_CONFIGURATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
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
  version: string;

  name: string;
  integrations: string[];

  workspace?: Workspace;
  workspaceId: string;
  actionEntity?: ActionEntity[];
}
