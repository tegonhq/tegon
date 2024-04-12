/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  IntegrationAccount,
  IntegrationDefinition,
  IntegrationName,
  Workspace,
} from '@prisma/client';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { WorkspaceIdRequestBody } from 'modules/workspaces/workspaces.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config = Record<string, any>;

export interface GithubRepositories {
  id: string;
  fullName: string;
  name?: string;
  private?: boolean;
  nodeId?: string;
}

export interface GithubRepositoryMappings {
  teamId: string;
  default: boolean;
  githubRepoId: string;
  bidirectional: boolean;
  githubRepoFullName: string;
}

export interface GithubSettings {
  orgLogin: string;
  orgAvatarURL: string;
  repositories: GithubRepositories[];
  repositoryMappings?: GithubRepositoryMappings[];
}

export interface GithubPersonalSettings {
  login: string;
}

export interface ChannelTeamMapping {
  teamId: string;
  teamName: string;
}
export interface ChannelMapping {
  botJoined: boolean;
  channelId: string;
  channelName: string;
  teams?: ChannelTeamMapping[];
  webhookUrl: string;
}
export interface SlackSettings {
  teamId: string;
  teamName: string;
  teamDomain: string;
  teamUrl: string;
  botUserId: string;
  channelMappings: ChannelMapping[];
}

export interface Settings {
  [IntegrationName.Github]?: GithubSettings;
  [IntegrationName.GithubPersonal]?: GithubPersonalSettings;
  [IntegrationName.Slack]?: SlackSettings;
}

export class IntegrationAccountRequestIdBody {
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountRequestBody extends WorkspaceIdRequestBody {
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountsRequestBody extends WorkspaceIdRequestBody {}

export class CreateIntegrationAccountBody extends WorkspaceIdRequestBody {
  @IsString()
  integrationDefinitionId: string;

  @IsObject()
  config: Config;

  @IsString()
  @IsOptional()
  accountIdentifier: string;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsObject()
  @IsOptional()
  settings?: Settings;

  @IsString()
  @IsOptional()
  userId: string;
}

export class UpdateIntegrationAccountBody {
  @IsOptional()
  @IsObject()
  integrationConfiguration: Config;

  @IsString()
  @IsOptional()
  accountIdentifier: string;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsObject()
  @IsOptional()
  settings: Settings;

  @IsString()
  @IsOptional()
  userId: string;
}

export interface IntegrationAccountWithRelations extends IntegrationAccount {
  workspace: Workspace;
  integrationDefinition: IntegrationDefinition;
}
