import { WorkspaceRequestParamsDto } from '@tegonhq/types';
import { IsString } from 'class-validator';

export class IntegrationAccountRequestBody extends WorkspaceRequestParamsDto {
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountsRequestBody extends WorkspaceRequestParamsDto {}
