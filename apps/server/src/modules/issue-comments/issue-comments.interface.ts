import { IsString } from 'class-validator';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedCommentSource = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkedCommentSourceData = Record<string, any>;
