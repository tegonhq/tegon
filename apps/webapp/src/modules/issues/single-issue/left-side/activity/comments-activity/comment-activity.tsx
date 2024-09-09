import { TimelineItem } from '@tegonhq/ui/components/timeline';
import * as React from 'react';

import {
  GenericCommentActivity,
  type GenericCommentActivityProps,
} from './generic-comment-activity';

export function CommentActivity(props: GenericCommentActivityProps) {
  const { comment, hasMore } = props;

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
