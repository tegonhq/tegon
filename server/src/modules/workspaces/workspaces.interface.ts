/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationName } from '@prisma/client';
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

export const labelSeedData = [
  { name: 'Bug', color: '#EF4E4E' },
  { name: 'Feature', color: '#FADB5F' },
  { name: 'Design', color: '#A368FC' },
  { name: 'Documentation', color: '#62F4EB' },
  { name: 'Frontend', color: '#7BC47F' },
  { name: 'Backend', color: '#5ED0FA' },
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
      'app_mentions:read,chat:write,chat:write.customize,channels:history,groups:history,mpim:history,im:history,commands,links:read,links:write,users:read,users:read.email,channels:read,groups:read,im:read,mpim:read,reactions:read,reactions:write,files:read,files:write,channels:join,groups:write.invites,channels:write.invites',
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
];
