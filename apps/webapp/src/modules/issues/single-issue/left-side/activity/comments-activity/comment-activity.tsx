import { TimelineItem } from '@tegonhq/ui/components/timeline';
import * as React from 'react';

import {
  GenericCommentActivity,
  type GenericCommentActivityProps,
} from './generic-comment-activity';
import { SyncCommentActivity } from './sync-comment-activity';

export function CommentActivity(props: GenericCommentActivityProps) {
  const { comment, hasMore } = props;
  const sourceMetadata = comment.sourceMetadata
    ? JSON.parse(comment.sourceMetadata)
    : undefined;

  if (sourceMetadata && sourceMetadata.type) {
    return <SyncCommentActivity {...props} />;
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
