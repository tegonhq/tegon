import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import { SendLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import { getTiptapJSON } from 'common';

import { useIssueData } from 'hooks/issues';

import { useCreateIssueCommentMutation } from 'services/issues';

import { UserContext } from 'store/user-context';

interface ReplyCommentProps {
  issueCommentId: string;
}

export function ReplyComment({ issueCommentId }: ReplyCommentProps) {
  const currentUser = React.useContext(UserContext);
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});
  const [showReplyButton, setShowReplyButton] = React.useState(false);

  const onSubmit = () => {
    if (commentValue !== '') {
      const { json, text } = getTiptapJSON(commentValue);
      if (text) {
        createIssueComment({
          body: JSON.stringify(json),
          issueId: issueData.id,
          parentId: issueCommentId,
        });
      }
    }
    setCommentValue(undefined);
  };

  return (
    <div className="flex items-start w-full border-t border-border px-3 py-2 pb-0 !mt-0">
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
          className="w-full bg-transparent px-3 py-2 pt-0 grow text-foreground"
        >
          <EditorExtensions suggestionItems={suggestionItems} />
        </Editor>
        <div className="flex justify-end items-center">
          {showReplyButton && (
            <>
              <Button
                variant="ghost"
                className="transition-all duration-500 ease-in-out my-2"
                type="submit"
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
