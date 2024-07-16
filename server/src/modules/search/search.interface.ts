import { IsOptional, IsString } from "class-validator";

export class SearchInputData {
  @IsString()
  query: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  threshold?: string;
}

export class SimilarIssueData {
  @IsString()
  workspaceId: string;

  @IsString()
  issueId: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
