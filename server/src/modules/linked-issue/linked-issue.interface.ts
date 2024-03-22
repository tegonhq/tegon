import { IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export enum LinkedIssueSubType {
  GithubIssue = 'GithubIssue',
  GithubPullRequest = 'GithubPullRequest',
  ExternalLink = 'ExternalLink',
}

export class LinkIssueInput {
  @IsString()
  url: string;

  @IsOptional()
  @IsEnum(LinkedIssueSubType)
  type?: LinkedIssueSubType;

  @IsOptional()
  @IsString()
  title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedIssueSource = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedIssueSourceData = Record<string, any>;

export type CreateLinkIssueInput = {
  url: string;
  issueId: string;
  createdById: string;
  sourceId?: string;
  source?: LinkedIssueSource;
  sourceData?: LinkedIssueSourceData;
};

export const githubIssueRegex =
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+$/;
export const githubPRRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/;

export class LinkIssueData {
  @IsString()
  url: string;

  @IsString()
  sourceId: string;

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

export class LinkedIssueIdParams {
  @IsString()
  linkedIssueId: string;
}

export class UpdateLinkedIssueAPIData {
  @IsOptional()
  @IsString()
  url?: string;

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

export class UpdateLinkedIssueData {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  title?: string;
}
