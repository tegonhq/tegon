import { IsObject, IsOptional, IsString } from 'class-validator';

import { type JsonObject } from '../common';

export class CreatePersonDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

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
