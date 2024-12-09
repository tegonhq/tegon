import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@tegonhq/ui/components/alert-dialog';
import React from 'react';

import { useDeleteCommentMutation } from 'services/comments';

interface DeleteCommentDialogProps {
  deleteCommentDialog: boolean;
  setDeleteCommentDialog: (value: boolean) => void;
  issueCommentId: string;
}

export function DeleteCommentDialog({
  deleteCommentDialog,
  setDeleteCommentDialog,
  issueCommentId,
}: DeleteCommentDialogProps) {
  const { mutate: deleteComment } = useDeleteCommentMutation({});

  const onDeleteComment = () => {
    deleteComment({ issueCommentId });
    setDeleteCommentDialog(false);
  };

  return (
    <AlertDialog
      open={deleteCommentDialog}
      onOpenChange={setDeleteCommentDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove this the
            comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteComment}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
