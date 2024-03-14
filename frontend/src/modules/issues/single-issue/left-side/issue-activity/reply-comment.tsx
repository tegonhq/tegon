/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';
import { useIssueData } from 'hooks/issues';

import { useCreateIssueCommentMutation } from 'services/issues/create-issue-comment';

import { UserContext } from 'store/user-context';

interface ReplyCommentProps {
  issueCommentId: string;
}

export function ReplyComment({ issueCommentId }: ReplyCommentProps) {
  const currentUser = React.useContext(UserContext);
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});

  const onSubmit = () => {
    createIssueComment({
      body: commentValue,
      issueId: issueData.id,
      parentId: issueCommentId,
    });
    setCommentValue('');
  };

  return (
    <div className="flex items-start text-xs text-muted-foreground w-full border-t p-3 pb-0">
      <Avatar className="h-[20px] w-[25px] text-foreground">
        <AvatarImage />
        <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-xs rounded-sm">
          {getInitials(currentUser.fullname)}
        </AvatarFallback>
      </Avatar>

      <div className="w-full relative">
        <Textarea
          placeholder="Leave a reply..."
          rows={5}
          value={commentValue}
          onChange={(e) => setCommentValue(e.currentTarget.value)}
          className="w-full text-foreground bg-transparent border-0 py-0 focus-visible:ring-0"
        />
        <Button
          variant="outline"
          className="absolute right-3 bottom-3"
          type="submit"
          size="sm"
          onClick={onSubmit}
        >
          Reply
        </Button>
      </div>
    </div>
  );
}
