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
  badgeContent?: React.ReactNode;
}

export function ReplyComment({
  issueCommentId,
  badgeContent,
}: ReplyCommentProps) {
  const currentUser = React.useContext(UserContext);
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});
  const [showReplyButton, setShowReplyButton] = React.useState(false);

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
        <AvatarFallback className="bg-teal-500 dark:bg-teal-900 text-[0.6rem] rounded-sm">
          {getInitials(currentUser.fullname)}
        </AvatarFallback>
      </Avatar>

      <div className="w-full relative">
        <Textarea
          placeholder="Leave a reply..."
          rows={showReplyButton && !commentValue ? 5 : 1}
          value={commentValue}
          onFocus={() => {
            setShowReplyButton(true);
          }}
          onBlur={() => {
            !commentValue && setShowReplyButton(false);
          }}
          onChange={(e) => setCommentValue(e.currentTarget.value)}
          className="w-full resize-none text-foreground bg-transparent border-0 py-0 focus-visible:ring-0 outline-none"
        />
        <div className="flex justify-between items-center">
          {showReplyButton && (
            <>
              <div>{badgeContent}</div>
              <Button
                variant="outline"
                className="my-2 transition-all duration-500 ease-in-out"
                type="submit"
                size="sm"
                onClick={onSubmit}
              >
                Reply
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
