import { AIRequest } from '../ai-request';
import { IntegrationAccount } from '../integration-account';
import { IntegrationDefinition } from '../integration-definition';
import { Label } from '../label';
import { Prompt } from '../prompt';
import { SyncAction } from '../sync-action';
import { Team } from '../team';
import { Template } from '../template';
import { UsersOnWorkspaces } from '../users-on-workspaces';
import { View } from '../view';

export class Workspace {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  name: string;
  slug: string;
  icon: string | null;
  actionsEnabled: boolean;
  usersOnWorkspaces?: UsersOnWorkspaces[];
  team?: Team[];
  label?: Label[];
  template?: Template[];
  syncAction?: SyncAction[];
  integrationAccount?: IntegrationAccount[];
  integrationDefinition?: IntegrationDefinition[];
  View?: View[];
  aiRequests?: AIRequest[];
  prompts?: Prompt[];
}
