import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateIssueRelationDto } from '../issue-relation';
import { CreateLinkedIssueDto } from '../linked-issue';

export class LinkIssueDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export class CreateIssueDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsNumber()
  estimate?: number;

  @IsOptional()
  @IsNumber()
  subIssueSortOrder?: number;

  @IsOptional()
  @IsArray()
  labelIds?: string[];

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsString()
  stateId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  subscriberIds?: string[];

  @IsString()
  teamId: string;

  @IsOptional()
  @IsObject()
  linkIssue?: LinkIssueDto;

  @IsOptional()
  @IsObject()
  issueRelation?: CreateIssueRelationDto;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIssueDto)
  subIssues?: CreateIssueDto[];

  @IsOptional()
  @IsObject()
  linkIssueData?: CreateLinkedIssueDto;

  @IsOptional()
  @IsObject()
  sourceMetadata?: Record<string, string>;
}
