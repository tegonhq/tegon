import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { LinkLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { type LinkedIssueType } from 'common/types';
import { type IssueCommentType } from 'common/types';
import type { User } from 'common/types';

import { useContextStore } from 'store/global-context-provider';

import { GenericCommentActivity } from './generic-comment-activity';
import { ReplyComment } from './reply-comment';

interface CommentActivityProps {
  comment: IssueCommentType;
  user: User;
  childComments: IssueCommentType[];
  allowReply?: boolean;
  html?: boolean;
  getUserData: (userId: string) => User;
  hasMore?: boolean;
}

export function SyncCommentActivity({
  comment,
  childComments,
  allowReply = false,
  hasMore,
  getUserData,
}: CommentActivityProps) {
  const { linkedIssuesStore } = useContextStore();
  const linkedIssue = linkedIssuesStore.linkedIssues.find(
    (linkedIssue: LinkedIssueType) => {
      const source = JSON.parse(linkedIssue.sourceData);

      return source.syncedCommentId === comment.id;
    },
  );

  const linkedSourceData = JSON.parse(linkedIssue.sourceData);

  return (
    <TimelineItem
      className="w-full"
      key={`${comment.id}-comment`}
      hasMore={hasMore}
    >
      <div className="flex items-start text-muted-foreground ">
        <LinkLine size={20} className="text-foreground mr-4" />

        <div
          className={cn(
            'group relative w-full flex flex-col rounded-md',
            !comment.parentId && 'bg-grayAlpha-100',
          )}
        >
          <div className={cn('flex gap-2', !comment.parentId && 'p-3')}>
            <a href={linkedIssue.url}>{linkedSourceData.title}</a>
            <span>
              <ReactTimeAgo
                date={new Date(comment.updatedAt)}
                className="text-muted-foreground text-xs"
              />
            </span>
          </div>

          {childComments.length > 0 && (
            <div className="text-muted-foreground w-full border-t border-border p-3 pb-0">
              {childComments.map(
                (subComment: IssueCommentType, index: number) => (
                  <div
                    key={subComment.id}
                    className={cn(
                      index < childComments.length - 1 &&
                        'border-b border-border mb-4',
                    )}
                  >
                    <GenericCommentActivity
                      comment={subComment}
                      user={getUserData(subComment.userId)}
                      childComments={[]}
                      html
                      allowReply={false}
                      getUserData={getUserData}
                    />
                  </div>
                ),
              )}
            </div>
          )}

          {allowReply && <ReplyComment issueCommentId={comment.id} />}
        </div>
      </div>
    </TimelineItem>
  );
}
