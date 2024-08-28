import { LLMModelsEnum, RoleEnum, WorkspaceStatusEnum } from '@tegonhq/types';
import {
  filterPrompt,
  issueDescriptionPrompt,
  issueLabelPrompt,
  issueSummarizePrompt,
  issueTitlePrompt,
  subIssuesPrompt,
  viewNameDescriptionPrompt,
} from '@tegonhq/types';
import { IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceInput {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class CreateInitialResourcesDto {
  @IsString()
  workspaceName: string;

  @IsString()
  fullname: string;

  @IsString()
  teamName: string;

  @IsString()
  teamIdentifier: string;
}

export class UpdateWorkspaceInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class UserBody {
  @IsString()
  userId: string;
}

export interface UserWorkspaceOtherData {
  teamIds?: string[];
  status?: WorkspaceStatusEnum;
  joinedAt?: string;
  role?: RoleEnum;
}

export interface InviteUsersBody {
  emailIds: string;
  teamIds: string[];
  role: RoleEnum;
}

export interface InviteActionBody {
  accept: boolean;
  inviteId: string;
}

export const labelSeedData = [
  { name: 'Bug', color: '#ed5b4a' },
  { name: 'Feature', color: '#00aa91' },
  { name: 'Design', color: '#00a5b5' },
  { name: 'Documentation', color: '#009dde' },
  { name: 'Frontend', color: '#a074f3' },
  { name: 'Backend', color: '#d55eba' },
];

export const promptsSeedData = [
  {
    name: 'IssueTitle',
    prompt: issueTitlePrompt,
    model: LLMModelsEnum.GPT35TURBO,
  },
  {
    name: 'IssueLabels',
    prompt: issueLabelPrompt,
    model: LLMModelsEnum.GPT35TURBO,
  },
  {
    name: 'IssueSummary',
    prompt: issueSummarizePrompt,
    model: LLMModelsEnum.GPT35TURBO,
  },
  {
    name: 'Filter',
    prompt: filterPrompt,
    model: LLMModelsEnum.GPT4TURBO,
  },
  {
    name: 'SubIssues',
    prompt: subIssuesPrompt,
    model: LLMModelsEnum.GPT4TURBO,
  },
  {
    name: 'ViewNameDescription',
    prompt: viewNameDescriptionPrompt,
    model: LLMModelsEnum.GPT35TURBO,
  },
  {
    name: 'IssueDescription',
    prompt: issueDescriptionPrompt,
    model: LLMModelsEnum.GPT4O,
  },
];
