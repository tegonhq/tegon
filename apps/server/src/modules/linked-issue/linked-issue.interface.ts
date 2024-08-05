import { LinkedIssue } from '@prisma/client';
import {
  IsEnum,
  IsJSON,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { IssueWithRelations } from 'modules/issues/issues.interface';

export enum LinkedIssueSubType {
  GithubIssue = 'GithubIssue',
  GithubPullRequest = 'GithubPullRequest',
  ExternalLink = 'ExternalLink',
  Slack = 'Slack',
  Sentry = 'Sentry',
}

export enum LinkedSlackMessageType {
  Message = 'Message',
  Thread = 'Thread',
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

export interface CreateLinkIssueInput {
  url: string;
  issueId: string;
  createdById: string;
  sourceId?: string;
  source?: LinkedIssueSource;
  sourceData?: LinkedIssueSourceData;
}

export interface LinkedIssueWithRelations extends LinkedIssue {
  issue: IssueWithRelations;
}

export const githubIssueRegex =
  /^https:\/\/github\.com\/(?<repository>[^/]+\/[^/]+)\/issues\/\d+$/;

export const githubPRRegex =
  /^https:\/\/github\.com\/(?<repository>[^/]+\/[^/]+)\/pull\/\d+$/;

// export const githubPRRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/;

export const slackRegex =
  /^https:\/\/(\w+)\.slack\.com\/archives\/([A-Z0-9]+)\/p(\d{10})(\d{6})(?:\?thread_ts=(\d{10}\.\d{6}))?/;

export const sentryRegex =
  /^https:\/\/(?<orgSlug>.+)\.sentry\.io\/issues\/(?<sentryIssueId>\d+)\//;

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

export class UpdateLinkedIssueData {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  source?: Record<string, string | number>;

  @IsOptional()
  @IsObject()
  sourceData?: Record<string, string | number>;

  @IsOptional()
  @IsString()
  createdById?: string;
}
