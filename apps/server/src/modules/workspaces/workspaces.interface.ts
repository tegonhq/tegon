import {
  IntegrationNameEnum,
  LLMModelsEnum,
  RoleEnum,
  WorkspaceStatusEnum,
} from '@tegonhq/types';
import { IsOptional, IsString } from 'class-validator';

import {
  filterPrompt,
  issueDescriptionPrompt,
  issueLabelPrompt,
  issueSummarizePrompt,
  issueTitlePrompt,
  subIssuesPrompt,
  viewNameDescriptionPrompt,
} from 'modules/prompts/prompts.interface';

export class CreateWorkspaceInput {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class UpdateWorkspaceInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class WorkspaceIdRequestBody {
  @IsString()
  workspaceId: string;
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

export const integrationDefinitionSeedData = [
  {
    name: IntegrationNameEnum.Github,
    icon: 'github.svg',
    spec: {
      other_data: { app_id: '804579' },
      auth_specification: {
        OAuth2: {
          token_url: 'https://github.com/login/oauth/access_token',
          authorization_url:
            'https://github.com/apps/tegon-bot/installations/new',
        },
      },
    },
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scopes: 'repo',
  },
  {
    name: IntegrationNameEnum.GithubPersonal,
    icon: 'github.svg',
    spec: {
      auth_specification: {
        OAuth2: {
          token_url: 'https://github.com/login/oauth/access_token',
          authorization_url: 'https://github.com/login/oauth/authorize',
        },
      },
    },
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scopes: '',
  },
  {
    name: IntegrationNameEnum.Slack,
    icon: 'slack.svg',
    spec: {
      auth_specification: {
        OAuth2: {
          token_url: 'https://slack.com/api/oauth.v2.access',
          authorization_url: 'https://slack.com/oauth/v2/authorize',
        },
      },
    },
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    scopes:
      'app_mentions:read,chat:write,chat:write.customize,channels:history,groups:history,mpim:history,im:history,commands,links:read,links:write,users:read,users:read.email,channels:read,groups:read,im:read,mpim:read,reactions:read,reactions:write,files:read,files:write,channels:join,groups:write.invites,channels:write.invites,team:read',
  },
  {
    name: IntegrationNameEnum.SlackPersonal,
    icon: 'slack.svg',
    spec: {
      auth_specification: {
        OAuth2: {
          token_url: 'https://slack.com/api/oauth.v2.access',
          authorization_url: 'https://slack.com/oauth/v2/authorize',
        },
      },
    },
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    scopes: 'chat:write,im:history,im:write,reactions:read',
  },
  {
    name: IntegrationNameEnum.Sentry,
    icon: 'sentry.svg',
    spec: {
      auth_specification: {
        OAuth2: {
          token_url:
            'https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/',
          authorization_url:
            'https://sentry.io/sentry-apps/tegon/external-install',
        },
      },
    },
    clientId: process.env.SENTRY_CLIENT_ID,
    clientSecret: process.env.SENTRY_CLIENT_SECRET,
    scopes:
      'event:read,event:write,issue:read,issue:write,org:read,org:write,member:read,member:write',
  },
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
