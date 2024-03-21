/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill } from '@remixicon/react';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { cn } from 'common/lib/utils';
import { type IssueCommentType } from 'common/types/issue';
import {
  LinkedIssueSubType,
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
}

export function GithubCommentActivity({
  comment,
  childComments,
  allowReply = false,
  getUserData,
}: CommentActivityProps) {
  const { linkedIssuesStore } = useContextStore();
  const linkedIssue = linkedIssuesStore.linkedIssues.find(
    (linkedIssue: LinkedIssueType) => {
      return (
        linkedIssue.issueId === comment.issueId &&
        JSON.parse(linkedIssue.source).subType ===
          LinkedIssueSubType.GithubIssue
      );
    },
  );

  const linkedSourceData = JSON.parse(linkedIssue.sourceData);
  const issueNumber =
    linkedIssue.url.split('/')[linkedIssue.url.split('/').length - 1];

  return (
    <div className="flex items-start text-xs text-muted-foreground">
      <div className="h-[20px] w-[25px] flex items-center justify-center mr-4">
        <RiGithubFill size={18} className="text-foreground" />
      </div>

      <div
        className={cn(
          'group relative w-full flex flex-col text-foreground rounded-md',
          comment.parentId && 'bg-transparent border-0',
          !comment.parentId &&
            'bg-background backdrop-blur-md dark:bg-slate-700/20 shadow-sm border',
        )}
      >
        <div className={cn('flex gap-2', !comment.parentId && 'p-3')}>
          <span className="text-foreground font-medium flex items-center gap-1">
            <RiGithubFill size={16} /> Github
          </span>
          <span className="text-muted-foreground"> thread connected in </span>
          <a href={linkedIssue.url}>
            # {issueNumber} {linkedSourceData.title}
          </a>
          <span>
            <ReactTimeAgo
              date={new Date(comment.updatedAt)}
              className="text-muted-foreground"
            />
          </span>
        </div>

        {childComments.length > 0 && (
          <div className="text-xs text-muted-foreground w-full border-t p-3 pb-0">
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
              <div className="text-xs border rounded-full flex items-center gap-1 p-1 px-2 bg-slate-100 dark:bg-slate-800">
                <RiGithubFill size={16} /> Comments are also posted on github
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
