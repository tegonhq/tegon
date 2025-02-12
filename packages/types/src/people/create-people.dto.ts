import { IsObject, IsOptional, IsString } from 'class-validator';

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
  metadata?: any;

  @IsOptional()
  @IsString()
  companyId?: string;
}
