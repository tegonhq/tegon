import { JsonValue } from '../../common';
import { IntegrationDefinition } from '../../integrationDefinition';
import { User } from '../../user/entities/user.entity';
import { Workspace } from '../../workspace/entities/workspace.entity';

export class IntegrationAccount {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date | null;
  integrationConfiguration: JsonValue;
  accountId: string | null;
  settings: JsonValue | null;
  isActive: boolean;
  integratedBy?: User;
  integratedById: string;
  integrationDefinition?: IntegrationDefinition;
  integrationDefinitionId: string;
  workspace?: Workspace;
  workspaceId: string;
}
