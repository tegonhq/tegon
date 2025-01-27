import { IntegrationAccount, ModelNameEnum } from '@tegonhq/sdk';

export interface SlashCommandSessionRecord {
  slackTeamId?: string;
  channelId?: string;
  IntegrationAccountId?: string;
  containsDescription?: boolean;
  teamId?: string;
  slackTeamDomain?: string;
  threadTs?: string;
  parentTs?: string;
  messageText?: string;
  messagedById?: string;
}

export interface SlackBlock {
  type: string;
  elements?: SlackElement[];
  text?: Record<string, string | boolean>;
  image_url?: string;
  alt_text?: string;
}

export interface SlackElement {
  type: string;
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  url?: string;
  elements?: SlackElement[];
}

export interface SlackCreateIssuePayload {
  integrationAccount: IntegrationAccount;
  sessionData: SlashCommandSessionRecord;
  issueData: slackIssueData;
}

export interface slackIssueData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linkIssueData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issueInput: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceMetadata?: Record<string, any>;
  userId: string | null;
}

export const slackLinkRegex =
  /^https:\/\/(\w+)\.slack\.com\/archives\/([A-Z0-9]+)\/p(\d{10})(\d{6})(?:\?thread_ts=(\d{10}\.\d{6}))?/;

export const twoWaySyncModels = new Map([[ModelNameEnum.IssueComment, true]]);

export interface SlackChannelMappings {
  teamId: string;
  channelId: string;
}
export interface SlackIntegrationSettings {
  teamId: string;
  teamName: string;
  teamDomain: string;
  teamUrl: string;
  botUserId: string;
  mappings: SlackChannelMappings[];
}

export interface SlackSourceMetadata {
  id: string;
  type: string;
  channelId: string;
  userDisplayName: string;
}
