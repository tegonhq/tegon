/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { Integration } from 'common/types/linked-issue';

import {
  GenericCommentActivity,
  type GenericCommentActivityProps,
} from './generic-comment-activity';
import { GithubCommentActivity } from './github-comment-activity';
import { SlackCommentActivity } from './slack-comment-activity';

export function CommentActivity(props: GenericCommentActivityProps) {
  const { comment } = props;
  const sourceMetadata = comment.sourceMetadata
    ? JSON.parse(comment.sourceMetadata)
    : undefined;

  if (sourceMetadata && sourceMetadata.type === Integration.Github) {
    return <GithubCommentActivity {...props} />;
  }

  if (sourceMetadata && sourceMetadata.type === Integration.Slack) {
    return <SlackCommentActivity {...props} />;
  }

  return <GenericCommentActivity {...props} />;
}
