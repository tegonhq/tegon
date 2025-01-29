import { IsObject, IsOptional, IsString } from 'class-validator';

import { type JsonObject } from '../common';

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsObject()
  metadata?: JsonObject;

  @IsOptional()
  @IsString()
  companyId?: string;
}
