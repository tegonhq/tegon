import { Issue } from '@@generated/issue/entities';
import { Team, User } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IssueRelationType } from 'modules/issue-relation/issue-relation.interface';
import { LinkedIssueSubType } from 'modules/linked-issue/linked-issue.interface';

export class TeamRequestParams {
  @IsString()
  teamId: string;
}

export class IssueRequestParams {
  @IsString()
  issueId: string;
}
export interface ApiResponse {
  status: number;
  message: string;
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

export class WorkspaceQueryParams {
  @IsString()
  workspaceId: string;
}

export class RelationInput {
  @IsOptional()
  @IsEnum(IssueRelationType)
  type?: IssueRelationType;

  @IsOptional()
  @IsString()
  issueId?: string;

  @IsOptional()
  @IsString()
  relatedIssueId?: string;
}

export class CreateIssueInput {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

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

  @IsBoolean()
  isBidirectional: boolean;

  @IsOptional()
  @IsObject()
  linkIssue?: LinkIssueInput;

  @IsOptional()
  @IsObject()
  issueRelation?: RelationInput;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIssueInput)
  subIssues?: CreateIssueInput[];
}

export class UpdateIssueInput {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsNumber()
  subIssueSortOrder?: number;

  @IsOptional()
  @IsNumber()
  estimate?: number;

  @IsOptional()
  @IsArray()
  labelIds?: string[];

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  stateId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  isBidirectional?: boolean;

  @IsOptional()
  @IsArray()
  subscriberIds: string[];

  @IsOptional()
  @IsObject()
  issueRelation?: RelationInput;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

export interface IssueWithRelations extends Issue {
  team?: Team;
  createdBy?: User;
}

export enum IssueAction {
  CREATED,
  UPDATED,
}

export enum SubscribeType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export class SubscribeIssueInput {
  @IsEnum(SubscribeType)
  type: SubscribeType;
}

export class AIInput {
  @IsString()
  description: string;

  @IsString()
  workspaceId: string;
}

export class MoveIssueInput {
  @IsString()
  teamId: string;
}

export class FilterInput {
  @IsString()
  text: string;

  @IsString()
  workspaceId: string;
}

export class SubIssueInput extends AIInput {
  @IsArray()
  labelIds: string[];
}

export class DescriptionInput extends AIInput {
  @IsString()
  userInput: string;
}
