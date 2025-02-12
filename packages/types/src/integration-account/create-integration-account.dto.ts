import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

import { WorkspaceRequestParamsDto } from '../workspace';

export class CreateIntegrationAccountDto extends WorkspaceRequestParamsDto {
  @IsString()
  integrationDefinitionId: string;

  @IsObject()
  config: any;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsObject()
  @IsOptional()
  settings?: any;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  personal?: boolean;
}
