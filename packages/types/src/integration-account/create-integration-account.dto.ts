import { IsObject, IsOptional, IsString } from 'class-validator';

import { type JsonObject } from '../common';
import { WorkspaceRequestParamsDto } from '../workspace';

export class CreateIntegrationAccountDto extends WorkspaceRequestParamsDto {
  @IsString()
  integrationDefinitionId: string;

  @IsObject()
  config: JsonObject;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsObject()
  @IsOptional()
  settings?: JsonObject;

  @IsString()
  @IsOptional()
  userId: string;
}
