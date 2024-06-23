/** Copyright (c) 2024, Tegon, all rights reserved. **/

import * as React from 'react';

import { AvatarText } from 'components/ui/avatar';
import { Button } from 'components/ui/button';
import { Editor } from 'components/ui/editor';
import { useIssueData } from 'hooks/issues';
import { SendLine } from 'icons';

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
    <div className="flex items-start w-full border-t p-3 pb-0">
      <AvatarText text={currentUser.fullname} className="text-[9px]" />

      <div className="w-full relative">
        <Editor
          placeholder="Leave a reply..."
          value={commentValue}
          onFocus={() => {
            setShowReplyButton(true);
          }}
          onSubmit={onSubmit}
          onBlur={() => {
            !commentValue && setShowReplyButton(false);
          }}
          onChange={(e) => setCommentValue(e)}
          className="w-full bg-transparent p-3 pt-0"
        />
        <div className="flex justify-between items-center">
          {showReplyButton && (
            <>
              <div>{badgeContent}</div>
              <Button
                variant="ghost"
                className="my-2 transition-all duration-500 ease-in-out"
                type="submit"
                size="sm"
                onClick={onSubmit}
              >
                <SendLine size={20} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
