import { Issue, Team, User } from '@tegonhq/types';
import { IsArray, IsEnum, IsString } from 'class-validator';

export interface ApiResponse {
  status: number;
  message: string;
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
