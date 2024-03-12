/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { type IssueCommentType } from 'common/types/issue';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { TimelineItem } from 'components/ui/timeline';

import type { User } from 'store/user-context';

interface CommentActivityProps {
  comment: IssueCommentType;
  user: User;
}
export function CommentActivity({ user, comment }: CommentActivityProps) {
  return (
    <TimelineItem className="my-2 w-full" key={`${comment.id}-comment`} hasMore>
      <div className="flex items-center text-xs text-muted-foreground">
        <Avatar className="h-[20px] w-[25px] mr-4 text-foreground">
          <AvatarImage />
          <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-xs rounded-sm">
            {getInitials(user.fullname)}
          </AvatarFallback>
        </Avatar>

        <div className="w-full flex flex-col text-foreground bg-background backdrop-blur-md dark:bg-gray-700/20 shadow-sm p-3 border rounded-md">
          <div className="flex gap-2">
            <span className="text-foreground font-medium">{user.username}</span>
            <span>
              {' '}
              <ReactTimeAgo
                date={new Date(comment.updatedAt)}
                className="text-muted-foreground"
              />
            </span>
          </div>
          <div className="text-base mt-2">{comment.body}</div>
        </div>
      </div>
    </TimelineItem>
  );
}
