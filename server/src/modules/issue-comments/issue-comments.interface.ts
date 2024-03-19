/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IssueComment } from '@@generated/issueComment/entities';
import { IsOptional, IsString } from 'class-validator';

import { IssueWithRelations } from 'modules/issues/issues.interface';

export class IssueCommentRequestParams {
  @IsString()
  issueCommentId: string;
}

export class IssueRequestParams {
  @IsString()
  issueId: string;
}

export class CommentInput {
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class ReactionInput {
  @IsString()
  emoji: string;
}

export class ReactionRequestParams {
  @IsString()
  issueCommentId: string;

  @IsString()
  reactionId: string;
}

export interface commentReactionType {
  id: string;
  reactedAt: string;
  userId: string;
}

export interface reactionDataType {
  emoji: string;
  reactions: commentReactionType[];
}

export enum IssueCommentAction {
  CREATED,
  UPDATED,
  DELETED,
}

export interface IssueCommentWithRelations extends IssueComment {
  issue: IssueWithRelations;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedCommentSource = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedCommentSourceData = Record<string, any>;
