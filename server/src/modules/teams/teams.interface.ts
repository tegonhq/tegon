/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { Preference, WorkflowCategory } from '@prisma/client';
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

export class WorkspaceRequestParams {
  @IsString()
  workspaceId: string;
}

export class PreferenceInput {
  @IsString()
  preference: Preference;

  @IsString()
  value: IssueEstimateValues | Priorities;
}

export class TeamMemberInput {
  @IsString()
  userId: string;
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
    category: WorkflowCategory.TRIAGE,
    color: '#D94B0E',
    position: 0,
  },
  {
    name: 'Unscoped',
    category: WorkflowCategory.BACKLOG,
    color: '#9F3DEF',
    position: 1,
  },
  {
    name: 'Backlog',
    category: WorkflowCategory.BACKLOG,
    color: '#8E862C',
    position: 2,
  },
  {
    name: 'Todo',
    category: WorkflowCategory.UNSTARTED,
    color: '#5C5C5C',
    position: 3,
  },
  {
    name: 'In Progress',
    category: WorkflowCategory.STARTED,
    color: '#C28C11',
    position: 4,
  },
  {
    name: 'In Review',
    category: WorkflowCategory.STARTED,
    color: '#3F8EF7',
    position: 5,
  },
  {
    name: 'Done',
    category: WorkflowCategory.COMPLETED,
    color: '#3CAF20',
    position: 6,
  },
  {
    name: 'Canceled',
    category: WorkflowCategory.CANCELED,
    color: '#5C5C5C',
    position: 7,
  },
];
