/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Editor } from 'components/ui/editor';
import { TimelineItem } from 'components/ui/timeline';
import { useIssueData } from 'hooks/issues';

import { useCreateIssueCommentMutation } from 'services/issues/create-issue-comment';

import { UserContext } from 'store/user-context';

export function IssueComment() {
  const currentUser = React.useContext(UserContext);
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});

  const onSubmit = () => {
    if (commentValue !== '') {
      createIssueComment({
        body: commentValue,
        issueId: issueData.id,
      });
    }
    setCommentValue('');
  };

  return (
    <TimelineItem hasMore className="w-full">
      <div className="flex items-start text-xs text-muted-foreground w-full">
        <Avatar className="h-[15px] w-[20px] mr-4 text-foreground">
          <AvatarImage />
          <AvatarFallback
            className={cn(
              'text-[0.55rem] rounded-sm',
              getTailwindColor(currentUser.username),
            )}
          >
            {getInitials(currentUser.fullname)}
          </AvatarFallback>
        </Avatar>

        <div className="w-full relative">
          <Editor
            value={commentValue}
            onChange={(e) => setCommentValue(e)}
            placeholder="Leave your comment..."
            className="w-full min-h-[60px] bg-white backdrop-blur-md dark:bg-slate-700/20 shadow-sm mb-0 p-2 border text-foreground"
          />
          <Button
            variant="outline"
            className="absolute right-3 bottom-3"
            type="submit"
            size="sm"
            onClick={onSubmit}
          >
            Comment
          </Button>
        </div>
      </div>
    </TimelineItem>
  );
}
