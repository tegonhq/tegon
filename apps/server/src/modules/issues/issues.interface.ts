import {
  BooleanFilterKeyEnum,
  FilterKey,
  FilterKeyEnum,
  Issue,
  IssueRelationType,
  Team,
  User,
} from '@tegonhq/types';
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

export const filterKeyReplacers: Record<FilterKey, string> = {
  [FilterKeyEnum.label]: 'labelIds',
  [FilterKeyEnum.status]: 'stateId',
  [FilterKeyEnum.assignee]: 'assigneeId',
  [FilterKeyEnum.priority]: 'priority',
  [FilterKeyEnum.dueDate]: 'dueDate',
  [FilterKeyEnum.createdAt]: 'createdAt',
  [FilterKeyEnum.updatedAt]: 'updatedAt',
  [BooleanFilterKeyEnum.isParent]: 'parent',
  [BooleanFilterKeyEnum.isSubIssue]: 'subIssue',
  [BooleanFilterKeyEnum.isBlocked]: IssueRelationType.BLOCKED,
  [BooleanFilterKeyEnum.isBlocking]: IssueRelationType.BLOCKS,
  [BooleanFilterKeyEnum.isDuplicate]: IssueRelationType.DUPLICATE,
  [BooleanFilterKeyEnum.isDuplicateOf]: IssueRelationType.DUPLICATE_OF,
  [BooleanFilterKeyEnum.isRelated]: IssueRelationType.RELATED,
};
