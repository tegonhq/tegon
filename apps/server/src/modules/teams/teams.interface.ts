import { PreferenceEnum, WorkflowCategoryEnum } from '@tegonhq/types';
import { IsOptional, IsString } from 'class-validator';

export class CreateTeamInput {
  @IsString()
  name: string;

  @IsString()
  identifier: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateTeamInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class TeamRequestParams {
  @IsString()
  teamId: string;
}

export class PreferenceInput {
  @IsString()
  preference: PreferenceEnum;

  @IsString()
  value: IssueEstimateValues | Priorities;
}

enum IssueEstimateValues {
  EXPONENTIAL,
  FIBONACCI,
  LINEAR,
  T_SHIRT,
}

enum Priorities {
  NO_PRIORITY_FIRST,
  NO_PRIORITY_LAST,
}

export const workflowSeedData = [
  {
    name: 'Triage',
    category: WorkflowCategoryEnum.TRIAGE,
    color: '0',
    position: 0,
  },
  {
    name: 'Unscoped',
    category: WorkflowCategoryEnum.BACKLOG,
    color: '1',
    position: 0,
  },
  {
    name: 'Backlog',
    category: WorkflowCategoryEnum.BACKLOG,
    color: '2',
    position: 1,
  },
  {
    name: 'Todo',
    category: WorkflowCategoryEnum.UNSTARTED,
    color: '3',
    position: 0,
  },
  {
    name: 'In Progress',
    category: WorkflowCategoryEnum.STARTED,
    color: '4',
    position: 0,
  },
  {
    name: 'In Review',
    category: WorkflowCategoryEnum.STARTED,
    color: '5',
    position: 1,
  },
  {
    name: 'Done',
    category: WorkflowCategoryEnum.COMPLETED,
    color: '6',
    position: 0,
  },
  {
    name: 'Canceled',
    category: WorkflowCategoryEnum.CANCELED,
    color: '7',
    position: 0,
  },
];
