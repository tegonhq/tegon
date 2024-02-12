/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

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
