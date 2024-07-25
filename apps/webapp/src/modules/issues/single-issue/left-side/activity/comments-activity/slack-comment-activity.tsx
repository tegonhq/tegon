import { RiSlackFill } from '@remixicon/react';
import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { SlackIcon } from '@tegonhq/ui/icons/index';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { type IssueCommentType } from 'common/types/issue';
import {
  LinkedSlackMessageType,
  type LinkedIssueType,
} from 'common/types/linked-issue';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

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

export function SlackCommentActivity({
  comment,
  childComments,
  hasMore,
  allowReply = false,
  getUserData,
}: CommentActivityProps) {
  const { linkedIssuesStore } = useContextStore();
  const linkedIssue = linkedIssuesStore.linkedIssues.find(
    (linkedIssue: LinkedIssueType) => {
      const source = JSON.parse(linkedIssue.source);

      return (
        linkedIssue.issueId === comment.issueId &&
        source &&
        source.subType === LinkedSlackMessageType.Thread
      );
    },
  );

  if (!linkedIssue) {
    return null;
  }

  return (
    <TimelineItem
      className="w-full"
      key={`${comment.id}-comment`}
      hasMore={hasMore}
    >
      <div className="flex items-start text-muted-foreground ">
        <SlackIcon size={20} className="text-foreground mr-4" />

        <div
          className={cn(
            'group relative w-full flex flex-col rounded-md',
            !comment.parentId && 'bg-grayAlpha-100',
          )}
        >
          <div
            className={cn(
              'flex gap-2 justify-between',
              !comment.parentId && 'p-3',
            )}
          >
            <div>
              <span className="text-foreground font-medium flex items-center gap-1">
                <SlackIcon size={16} className="mr-2" /> Slack
              </span>
              <span className="text-muted-foreground"> thread connected </span>
            </div>

            <span>
              <ReactTimeAgo
                date={new Date(comment.updatedAt)}
                className="text-muted-foreground font-mono text-xs"
              />
            </span>
          </div>

          {childComments.length > 0 && (
            <div className="text-muted-foreground w-full border-t p-3 pb-0">
              {childComments.map(
                (subComment: IssueCommentType, index: number) => (
                  <div
                    key={subComment.id}
                    className={cn(
                      index < childComments.length - 1 && 'border-b mb-4',
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

          {allowReply && (
            <ReplyComment
              issueCommentId={comment.id}
              badgeContent={
                <div className="rounded flex items-center gap-1 p-1 px-2 bg-grayAlpha-100">
                  <RiSlackFill size={16} /> Comments are also posted on slack
                  thread
                </div>
              }
            />
          )}
        </div>
      </div>
    </TimelineItem>
  );
}
