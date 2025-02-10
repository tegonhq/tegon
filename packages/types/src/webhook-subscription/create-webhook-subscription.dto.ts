import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateWebhookSubscriptionDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  secret?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  events?: string[];
}
