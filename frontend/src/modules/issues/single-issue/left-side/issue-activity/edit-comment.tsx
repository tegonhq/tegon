/** Copyright (c) 2024, Tegon, all rights reserved. **/

import React from 'react';

import type { IssueCommentType } from 'common/types/issue';

import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';

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
      <Textarea
        placeholder="Leave a reply..."
        rows={5}
        value={commentValue}
        onChange={(e) => setCommentValue(e.currentTarget.value)}
        className="w-full resize-none text-foreground bg-transparent border-0 py-0 focus-visible:ring-0 outline-none px-0"
      />
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="ghost"
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
