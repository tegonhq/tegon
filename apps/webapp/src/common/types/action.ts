import { ActionStatusEnum } from '@tegonhq/types';

export interface ActionType {
  id: string;
  createdAt: string;
  updatedAt: string;
  config: string;
  data?: string;
  isPersonal: boolean;
  status: ActionStatusEnum;
  version: string;
  slug: string;
  name: string;
  description: string;
  integrations: string[];
  cron?: string;
  workspaceId: string;
  createdById: string;
}

export const StatusMapping = {
  [ActionStatusEnum.ACTIVE]: 'Active',
  [ActionStatusEnum.INSTALLED]: 'Installed',
  [ActionStatusEnum.NEEDS_CONFIGURATION]: 'Needs configuration',
  [ActionStatusEnum.SUSPENDED]: 'Suspended',
  [ActionStatusEnum.DEPLOYING]: 'Deploying',
  [ActionStatusEnum.ERRORED]: 'Errored',
};
