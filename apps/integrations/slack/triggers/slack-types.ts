import {
  IntegrationAccountWithRelations,
  LinkIssueData,
  UpdateIssueInput,
} from "@tegonhq/types";

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
  integrationAccount: IntegrationAccountWithRelations;
  accessToken: string;
  sessionData: SlashCommandSessionRecord;
  issueData: slackIssueData;
}

export interface slackIssueData {
  linkIssueData?: LinkIssueData;
  issueInput: UpdateIssueInput;
  sourceMetadata: Record<string, any>;
  userId: string | null;
}
