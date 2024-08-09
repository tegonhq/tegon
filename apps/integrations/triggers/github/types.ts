export const githubHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export interface GithubRepositories {
  id: string;
  fullName: string;
  name: string;
  private: boolean;
}

export interface GithubMappings {
  teamId: string;
  id: string;
  isBidirectional: string;
}

export interface GithubIntegrationSettings {
  orgAvatarURL: string;
  orgLogin: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repositories: GithubRepositories[];
  mappings: GithubMappings[];
}

export interface GithubPersonalIntegrationSettings {
  login: string;
}
