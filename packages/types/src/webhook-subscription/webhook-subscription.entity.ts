import { Workspace } from '../workspace';

export class WebhookSubscription {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: Date;

  name: string;
  url: string;
  secret?: string;
  isActive: boolean;
  events: string[];

  workspaceId?: string;
  workspace?: Workspace;
}
