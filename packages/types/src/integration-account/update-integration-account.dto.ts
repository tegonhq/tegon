import { IsObject, IsOptional, IsString } from 'class-validator';

import { type JsonObject } from '../common';

export class UpdateIntegrationAccountDto {
  @IsOptional()
  @IsObject()
  integrationConfiguration: JsonObject;

  @IsString()
  @IsOptional()
  accountIdentifier: string;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsObject()
  @IsOptional()
  settings: JsonObject;

  @IsString()
  @IsOptional()
  userId: string;
}
