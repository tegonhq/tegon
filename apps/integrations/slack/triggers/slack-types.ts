import { IntegrationAccount, ModelNameEnum } from "@tegonhq/types";

export interface SlashCommandSessionRecord {
  slackTeamId?: string;
  channelId?: string;
  IntegrationAccountId?: string;
  containsDescription?: boolean;
  teamId?: string;
  slackTeamDomain?: string;
  threadTs?: string;
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
  accesstoken: string;
  sessionData: SlashCommandSessionRecord;
  issueData: slackIssueData;
}

export interface slackIssueData {
  linkIssueData?: any;
  issueInput: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sourceMetadata?: Record<string, any>;
  userId: string | null;
}

export const twoWaySyncModels = new Map([[ModelNameEnum.IssueComment, true]]);
