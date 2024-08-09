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

export interface IntegrationAccountType {
  id: string;
  createdAt: string;
  updatedAt: string;

  accountId: string;
  settings: string;
  personal: boolean;

  integratedById: string;
  integrationDefinitionId: string;
  workspaceId: string;
}
