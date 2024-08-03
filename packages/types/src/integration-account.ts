import type {
  IntegrationDefinitionType,
  IntegrationName,
} from './integration-definition';
import type { WorkspaceType } from './workspace';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [IntegrationName.Sentry]?: Record<string, any>;
}

export interface IntegrationAccountType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: Date;

  integrationConfiguration: any;
  accountId?: string;
  settings: any | null;

  isActive: boolean;
  integratedById: string;
  integrationDefinitionId: string;
  workspaceId: string;
}
export interface IntegrationAccountWithRelations
  extends IntegrationAccountType {
  workspace: WorkspaceType;
  integrationDefinition: IntegrationDefinitionType;
}
