/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

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
