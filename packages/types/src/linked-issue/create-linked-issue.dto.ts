import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLinkedIssueDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  sourceId: string;

  @IsOptional()
  @IsObject()
  sourceData?: Record<string, string | number>;
}
