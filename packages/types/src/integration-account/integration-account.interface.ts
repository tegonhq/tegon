import { IntegrationNameEnum } from '../integration-definition';

export interface Settings {
  [IntegrationNameEnum.Github]?: GithubSettings;
  [IntegrationNameEnum.GithubPersonal]?: GithubPersonalSettings;
  [IntegrationNameEnum.Slack]?: SlackSettings;
  [IntegrationNameEnum.Sentry]?: SentrySettings;
}

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

export interface SentrySettings {
  orgSlug: string;
}
