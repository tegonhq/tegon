import { JsonValue } from '../common';
import { IntegrationDefinition } from '../integration-definition';
import { User } from '../user';
import { Workspace } from '../workspace';

export class IntegrationAccount {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  integrationConfiguration?: JsonValue;
  accountId: string | null;
  settings: JsonValue | null;
  personal: boolean;
  isActive: boolean;
  integratedBy?: User;
  integratedById: string;
  integrationDefinition?: IntegrationDefinition;
  integrationDefinitionId: string;
  workspace?: Workspace;
  workspaceId: string;
}
