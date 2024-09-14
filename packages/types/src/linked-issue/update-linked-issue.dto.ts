import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateLinkedIssueDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  sync?: boolean;

  @IsOptional()
  @IsObject()
  sourceData?: Record<string, string | number>;

  @IsOptional()
  @IsString()
  createdById?: string;
}
