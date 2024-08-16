import { WorkspaceRequestParamsDto } from '@tegonhq/types';
import { IsString } from 'class-validator';

export class IntegrationAccountRequestBody extends WorkspaceRequestParamsDto {
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountsRequestBody extends WorkspaceRequestParamsDto {}

export const IntegrationAccountSelect = {
  id: true,
  accountId: true,
  settings: true,
  integratedById: true,
  createdAt: true,
  updatedAt: true,
  deleted: true,
  workspaceId: true,
  personal: true,
  isActive: true,
  integrationDefinitionId: true,
  integrationDefinition: true,
  workspace: true,
};
