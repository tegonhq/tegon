/** Copyright (c) 2024, Tegon, all rights reserved. **/
import type { IntegrationName } from './integration-definition';

export interface GithubRepositories {
  id: string;
  fullName: string;
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

export interface Settings {
  [IntegrationName.Github]?: GithubSettings;
  [IntegrationName.GithubPersonal]?: GithubPersonalSettings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [IntegrationName.Slack]?: Record<string, any>;
}

export interface IntegrationAccountType {
  id: string;
  createdAt: string;
  updatedAt: string;

  accountId: string;
  settings: string;

  integratedById: string;
  integrationDefinitionId: string;
  workspaceId: string;
}
