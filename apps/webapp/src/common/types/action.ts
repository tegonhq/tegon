import type { ActionStatusEnum } from '@tegonhq/types';

export interface ActionType {
  id: string;
  createdAt: string;
  updatedAt: string;
  config: string;
  data?: string;
  status: ActionStatusEnum;
  version: string;
  slug: string;
  name: string;
  integrations: string[];
  cron?: string;
  workspaceId: string;
  createdById: string;
}
