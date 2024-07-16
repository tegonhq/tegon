import React from 'react';

import type { IssueCommentType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Editor } from 'components/ui/editor';

import { useUpdateIssueCommentMutation } from 'services/issues/update-issue-comment';

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
      />
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
