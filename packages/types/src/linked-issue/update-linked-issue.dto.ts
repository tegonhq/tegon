import { IsJSON, IsOptional, IsString } from 'class-validator';

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
  @IsJSON()
  source?: Record<string, string | number>;

  @IsOptional()
  @IsJSON()
  sourceData?: Record<string, string | number>;

  @IsOptional()
  @IsString()
  createdById?: string;
}
