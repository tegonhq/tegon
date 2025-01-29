import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { SendLine } from '@tegonhq/ui/icons';
import * as React from 'react';

import { getTiptapJSON } from 'common';

import {
  CustomMention,
  pendingUploads,
  useMentionSuggestions,
} from 'components/editor';
import { useIssueData } from 'hooks/issues';

import { useCreateIssueCommentMutation } from 'services/issues';

import { UserContext } from 'store/user-context';

import { FileUpload } from '../../file-upload';

interface ReplyCommentProps {
  issueCommentId: string;
}

export function ReplyComment({ issueCommentId }: ReplyCommentProps) {
  const currentUser = React.useContext(UserContext);
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});
  const suggestion = useMentionSuggestions();
  const { toast } = useToast();

  const onSubmit = () => {
    if (commentValue !== '') {
      const { json, text } = getTiptapJSON(commentValue);

      if (pendingUploads(json)) {
        toast({
          title: 'Uploads pending!',
          variant: 'destructive',
          description:
            'Some uploads are pending, please wait before you comment',
        });

        return;
      }

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
    <div className="flex items-start w-full border-t border-border px-2 py-2 pb-0 !mt-0">
      <AvatarText text={currentUser.fullname} className="text-[9px]" />

      <div className="w-full relative">
        <Editor
          placeholder="Leave a reply..."
          value={commentValue}
          extensions={[
            CustomMention.configure({
              suggestion,
            }),
          ]}
          autoFocus
          onSubmit={onSubmit}
          onChange={(e) => setCommentValue(e)}
          className="w-full min-h-[60px] bg-transparent mb-0 p-2 pt-0 grow text-foreground relative"
        >
          <div className="absolute right-1 bottom-1 flex items-center">
            <FileUpload withPosition={false} />

            <Button
              variant="ghost"
              className="transition-all duration-500 ease-in-out my-2"
              type="submit"
              size="sm"
              onClick={onSubmit}
            >
              <SendLine size={20} />
            </Button>
          </div>
          <EditorExtensions suggestionItems={suggestionItems} />
        </Editor>
      </div>
    </div>
  );
}
