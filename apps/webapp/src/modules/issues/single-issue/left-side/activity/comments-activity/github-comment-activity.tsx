import type { User } from 'common/types';

import { RiGithubFill } from '@remixicon/react';
import { type IssueCommentType } from 'common/types';
import { LinkedIssueSubType, type LinkedIssueType } from 'common/types';
import { TimelineItem } from '@tegonhq/ui/components/timeline';
import { cn } from '@tegonhq/ui/lib/utils';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

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

export function GithubCommentActivity({
  comment,
  childComments,
  allowReply = false,
  hasMore,
  getUserData,
}: CommentActivityProps) {
  const { linkedIssuesStore } = useContextStore();
  const linkedIssue = linkedIssuesStore.linkedIssues.find(
    (linkedIssue: LinkedIssueType) => {
      const source = JSON.parse(linkedIssue.source);

      return (
        source.syncedCommentId === comment.id &&
        source.subType === LinkedIssueSubType.GithubIssue
      );
    },
  );

  const linkedSourceData = JSON.parse(linkedIssue.sourceData);
  const issueNumber =
    linkedIssue.url.split('/')[linkedIssue.url.split('/').length - 1];

  return (
    <TimelineItem
      className="w-full"
      key={`${comment.id}-comment`}
      hasMore={hasMore}
    >
      <div className="flex items-start text-muted-foreground ">
        <RiGithubFill size={20} className="text-foreground mr-4" />

        <div
          className={cn(
            'group relative w-full flex flex-col rounded-md',
            !comment.parentId && 'bg-grayAlpha-100',
          )}
        >
          <div className={cn('flex gap-2', !comment.parentId && 'p-3')}>
            <span className="text-foreground font-medium flex items-center gap-1">
              <RiGithubFill size={16} className="mr-2" /> Github
            </span>
            <span className="text-muted-foreground"> thread connected in </span>
            <a href={linkedIssue.url}>
              #{issueNumber} {linkedSourceData.title}
            </a>
            <span>
              <ReactTimeAgo
                date={new Date(comment.updatedAt)}
                className="text-muted-foreground text-xs"
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
                <div className="border rounded-full flex items-center gap-1 p-1 px-2 bg-grayAlpha-100">
                  <RiGithubFill size={16} /> Comments are also posted on github
                </div>
              }
            />
          )}
        </div>
      </div>
    </TimelineItem>
  );
}
