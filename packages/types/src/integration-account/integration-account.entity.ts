import {
  IntegrationDefinition,
  PublicIntegrationDefinition,
} from '../integration-definition';
import { User } from '../user';
import { Workspace } from '../workspace';

export class IntegrationAccount {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  integrationConfiguration?: any;
  accountId: string | null;
  settings: any | null;
  personal: boolean;
  isActive: boolean;
  integratedBy?: User;
  integratedById: string;
  integrationDefinition?: IntegrationDefinition | PublicIntegrationDefinition;
  integrationDefinitionId: string;
  workspace?: Workspace;
  workspaceId: string;
}
