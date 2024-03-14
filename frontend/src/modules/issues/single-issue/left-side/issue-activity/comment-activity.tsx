/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiReplyFill } from '@remixicon/react';
import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { cn } from 'common/lib/utils';
import { type IssueCommentType } from 'common/types/issue';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Button } from 'components/ui/button';

import type { User } from 'store/user-context';

import { ReplyComment } from './reply-comment';

interface CommentActivityProps {
  comment: IssueCommentType;
  user: User;
  childComments: IssueCommentType[];
  allowReply?: boolean;
  getUserData: (userId: string) => User;
}

export function CommentActivity({
  user,
  comment,
  childComments,
  allowReply = false,
  getUserData,
}: CommentActivityProps) {
  const [openComment, setOpenComment] = React.useState(false);

  return (
    <div className="flex items-start text-xs text-muted-foreground">
      <Avatar className="h-[20px] w-[25px] mr-3 text-foreground">
        <AvatarImage />
        <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-xs rounded-sm">
          {getInitials(user.fullname)}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'group relative w-full flex flex-col text-foreground rounded-md',
          comment.parentId && 'bg-transparent border-0',
          !comment.parentId &&
            'bg-background backdrop-blur-md dark:bg-gray-700/20 shadow-sm border',
        )}
      >
        <div className={cn('flex gap-2', !comment.parentId && 'p-3 pb-0')}>
          <span className="text-foreground font-medium">{user.username}</span>
          <span>
            <ReactTimeAgo
              date={new Date(comment.updatedAt)}
              className="text-muted-foreground"
            />
          </span>
        </div>

        {allowReply && (
          <div className="hidden group-hover:flex gap-1 absolute right-2 top-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenComment(true)}
            >
              <RiReplyFill size={14} className="text-muted-foreground" />
            </Button>
          </div>
        )}

        <div
          className={cn(
            'text-base mt-2',
            !comment.parentId && 'p-3 pt-0',
            comment.parentId && 'pb-3',
          )}
        >
          {comment.body}
        </div>

        {childComments.length > 0 && (
          <div className="text-xs text-muted-foreground w-full border-t p-3 pb-0">
            {childComments.map((subComment: IssueCommentType) => (
              <CommentActivity
                comment={subComment}
                key={subComment.id}
                user={getUserData(subComment.userId)}
                childComments={[]}
                allowReply={false}
                getUserData={getUserData}
              />
            ))}
          </div>
        )}

        {allowReply && openComment && (
          <ReplyComment issueCommentId={comment.id} />
        )}
      </div>
    </div>
  );
}
