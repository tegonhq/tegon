import type { IssueCommentType } from 'common/types';

import { useUpdateIssueCommentMutation } from 'services/issues';
import { Button } from '@tegonhq/ui/components/button';
import {
  Editor,
  EditorExtensions,
  suggestionItems,
} from '@tegonhq/ui/components/editor/index';
import React from 'react';

interface EditCommentProps {
  value: string;
  comment: IssueCommentType;
  onCancel: () => void;
}

export function EditComment({ value, onCancel, comment }: EditCommentProps) {
  const [commentValue, setCommentValue] = React.useState(value);

  const { mutate: updateComment } = useUpdateIssueCommentMutation({});

  const onSubmit = () => {
    updateComment({
      body: commentValue,
      parentId: comment.parentId,
      issueCommentId: comment.id,
    });
    onCancel();
  };

  return (
    <div className="mt-2">
      <Editor
        placeholder="Leave a reply..."
        value={commentValue}
        onChange={(e) => setCommentValue(e)}
        className="w-full bg-transparent p-3 pt-0 pl-0"
      >
        <EditorExtensions suggestionItems={suggestionItems} />
      </Editor>
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="ghost"
          className="my-2 transition-all duration-500 ease-in-out"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          className="my-2 transition-all duration-500 ease-in-out"
          onClick={onSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
