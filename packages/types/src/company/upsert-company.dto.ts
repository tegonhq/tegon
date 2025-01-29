import { IsObject, IsOptional, IsString } from 'class-validator';

import { type JsonObject } from '../common';

export class UpsertCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  desciption?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  metadata?: JsonObject;
}
