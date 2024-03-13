/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface GithubRepositories {
  id: string;
  fullName: string;
}

export interface RepositoryMapping {
  bidirectional: boolean;
  teamId: string;
  repoId: string;
  defaullt: boolean;
}

export interface GithubSettings {
  orgAvatarURL: string;
  orgLogin: string;
  repositories: GithubRepositories[];
  respositoryMappings: RepositoryMapping[];
}

export type labelDataType = Record<string, string>

export const eventsToListen = new Map([
    ['issues', true],
    ['issue_comment', true],
    ['label', true],
  ]);
  