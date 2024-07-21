import * as React from 'react';

import { Button } from 'components/ui/button';
import { Editor, type EditorT } from 'components/ui/editor';
import { useIssueData } from 'hooks/issues';
import { SendLine } from 'icons';

import { useCreateIssueCommentMutation } from 'services/issues/create-issue-comment';

import { FileUpload } from '../../file-upload/file-upload';

export function IssueComment() {
  const [editor, setEditor] = React.useState<EditorT>(undefined);
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
    <div className="flex items-start w-full">
      <div className="w-full relative">
        <Editor
          value={commentValue}
          onChange={(e) => setCommentValue(e)}
          onCreate={(editor) => setEditor(editor)}
          placeholder="Leave your comment..."
          onSubmit={onSubmit}
          className="w-full min-h-[44px] mb-0 p-2 border-border border"
        />
        <div className="absolute right-1 bottom-2 flex items-center gap-1">
          <FileUpload editor={editor} />

          <Button variant="ghost" type="submit" onClick={onSubmit}>
            <SendLine size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
