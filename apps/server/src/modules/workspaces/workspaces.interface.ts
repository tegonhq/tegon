import { IntegrationName, LLMModels, Role, Status } from '@prisma/client';
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
  status?: Status;
  joinedAt?: string;
  role?: Role;
}

export interface InviteUsersBody {
  emailIds: string;
  teamIds: string[];
  role: Role;
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
    name: IntegrationName.Github,
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
    name: IntegrationName.GithubPersonal,
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
    name: IntegrationName.Slack,
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
    name: IntegrationName.SlackPersonal,
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
    name: IntegrationName.Sentry,
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
    model: LLMModels.GPT35TURBO,
  },
  {
    name: 'IssueLabels',
    prompt: issueLabelPrompt,
    model: LLMModels.GPT35TURBO,
  },
  {
    name: 'IssueSummary',
    prompt: issueSummarizePrompt,
    model: LLMModels.GPT35TURBO,
  },
  {
    name: 'Filter',
    prompt: filterPrompt,
    model: LLMModels.GPT4TURBO,
  },
  {
    name: 'SubIssues',
    prompt: subIssuesPrompt,
    model: LLMModels.GPT4TURBO,
  },
  {
    name: 'ViewNameDescription',
    prompt: viewNameDescriptionPrompt,
    model: LLMModels.GPT35TURBO,
  },
  {
    name: 'IssueDescription',
    prompt: issueDescriptionPrompt,
    model: LLMModels.GPT4O,
  },
];
