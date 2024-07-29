import { Integration } from '@tegonhq/types';
import { TimelineItem } from '@tegonhq/ui/components/timeline';
import * as React from 'react';

import {
  GenericCommentActivity,
  type GenericCommentActivityProps,
} from './generic-comment-activity';
import { GithubCommentActivity } from './github-comment-activity';
import { SlackCommentActivity } from './slack-comment-activity';

export function CommentActivity(props: GenericCommentActivityProps) {
  const { comment, hasMore } = props;
  const sourceMetadata = comment.sourceMetadata
    ? JSON.parse(comment.sourceMetadata)
    : undefined;

  if (sourceMetadata && sourceMetadata.type === Integration.Github) {
    return <GithubCommentActivity {...props} />;
  }

  if (sourceMetadata && sourceMetadata.type === Integration.Slack) {
    return <SlackCommentActivity {...props} />;
  }

  return (
    <TimelineItem
      className="w-full"
      key={`${comment.id}-comment`}
      hasMore={hasMore}
    >
      <GenericCommentActivity {...props} />
    </TimelineItem>
  );
}
