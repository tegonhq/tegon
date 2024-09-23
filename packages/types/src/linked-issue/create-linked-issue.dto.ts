import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLinkedIssueDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @IsBoolean()
  sync?: boolean;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  sourceData?: Record<string, string | number>;
}
