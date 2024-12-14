import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import type { IssueCommentType, User } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { GenericCommentActivity } from './generic-comment-activity';
import { SyncCommentActivity } from './sync-comment-activity';

interface GenericCommentActivityPropsv2 {
  issueId: string;
  commentId: string;
  user: User;
  childComments: IssueCommentType[];
  allowReply?: boolean;
  html?: boolean;
  getUserData: (userId: string) => User;
  hasMore?: boolean;
}

export const CommentActivity = observer(
  (props: GenericCommentActivityPropsv2) => {
    const { issueId, commentId, hasMore } = props;
    const { commentsStore } = useContextStore();

    const comment = commentsStore
      .getComments(issueId)
      .find((comment: { id: string }) => comment.id === commentId);

    const sourceMetadata =
      comment && comment.sourceMetadata
        ? JSON.parse(comment.sourceMetadata)
        : undefined;
    if (comment === undefined) {
      return null;
    }

    if (sourceMetadata && sourceMetadata.type) {
      return <SyncCommentActivity comment={comment} {...props} />;
    }

    return (
      <TimelineItem
        className="w-full"
        key={`${comment.id}-comment`}
        hasMore={hasMore}
      >
        <GenericCommentActivity comment={comment} {...props} />
      </TimelineItem>
    );
  },
);
