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

export function IssueComment() {
  const issueData = useIssueData();
  const [commentValue, setCommentValue] = React.useState('');
  const { mutate: createIssueComment } = useCreateIssueCommentMutation({});

  const onSubmit = () => {
    if (commentValue !== '') {
      const { json, text } = getTiptapJSON(commentValue);
      if (text) {
        createIssueComment({
          body: JSON.stringify(json),
          issueId: issueData.id,
        });
      }
    }

    setCommentValue(undefined);
  };

  return (
    <div className="flex items-start w-full">
      <div className="w-full relative">
        <Editor
          value={commentValue}
          onChange={(e) => {
            setCommentValue(e);
          }}
          placeholder="Leave your comment..."
          onSubmit={onSubmit}
          className="w-full min-h-[44px] mb-0 p-2 border-border border"
        >
          <EditorExtensions suggestionItems={suggestionItems} />
        </Editor>
        <div className="absolute right-1 bottom-2 flex items-center gap-1">
          <Button variant="ghost" type="submit" onClick={onSubmit}>
            <SendLine size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
