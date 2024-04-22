/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import type { IssueCommentType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';

import { useUpdateIssueCommentMutation } from 'services/issues/update-issue-comment';
import { Editor } from 'components/ui/editor';

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
        className="w-full text-foreground bg-transparent p-3 pt-0 pl-0"
      />
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          className="my-2 transition-all duration-500 ease-in-out"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="my-2 transition-all duration-500 ease-in-out"
          size="sm"
          onClick={onSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
