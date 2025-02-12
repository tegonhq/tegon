import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateIntegrationAccountDto {
  @IsOptional()
  @IsObject()
  integrationConfiguration: any;

  @IsString()
  @IsOptional()
  accountIdentifier: string;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsObject()
  @IsOptional()
  settings: any;

  @IsString()
  @IsOptional()
  userId: string;
}
