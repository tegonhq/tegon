import { IntegrationName } from '@prisma/client';
import { IsString } from 'class-validator';

import { IntegrationAccountWithRelations } from 'modules/integration-account/integration-account.interface';
import { UpdateIssueInput } from 'modules/issues/issues.interface';
import { LinkIssueData } from 'modules/linked-issue/linked-issue.interface';

import { EventBody } from '../../integrations-interface';

export class WorkspaceQueryParams {
  @IsString()
  workspaceId: string;
}

export class IntegrationAccountQueryParams {
  @IsString()
  integrationAccountId: string;
}

export class ChannelBody {
  @IsString()
  redirectURL: string;
}

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

export enum ModelViewType {
  CREATE,
  UPDATE,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModalBlockType = Record<string, any>;

export interface ModalType {
  type: string;
  title: Record<string, string>;
  blocks: ModalBlockType[];
  submit?: Record<string, string>;
  close?: Record<string, string>;
}

export interface slackIssueData {
  linkIssueData?: LinkIssueData;
  issueInput: UpdateIssueInput;
  sourceMetadata: {
    id: string;
    type: IntegrationName;
    channelId: string;
  };
  userId: string | null;
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

export interface SlackPayload {
  eventBody: EventBody;
  integrationAccount: IntegrationAccountWithRelations;
}
