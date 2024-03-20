/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import {
  GenericCommentActivity,
  type GenericCommentActivityProps,
} from './generic-comment-activity';
import { GithubCommentActivity } from './github-comment-activity';

export function CommentActivity(props: GenericCommentActivityProps) {
  const { comment } = props;
  const sourceMetadata = comment.sourceMetadata
    ? JSON.parse(comment.sourceMetadata)
    : undefined;

  if (sourceMetadata) {
    return <GithubCommentActivity {...props} />;
  }

  return <GenericCommentActivity {...props} />;
}
