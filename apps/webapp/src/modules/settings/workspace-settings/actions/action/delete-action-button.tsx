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
import { Button } from '@tegonhq/ui/components/button';
import { useRouter } from 'next/router';
import React from 'react';

import { useDeleteActionMutation } from 'services/action';
export const DeleteActionButton = ({ id }: { id: string }) => {
  const [open, setOpen] = React.useState(false);
  const { mutate: deleteActionAPI } = useDeleteActionMutation({});
  const {
    push,
    query: { workspaceSlug },
  } = useRouter();

  const deleteAction = () => {
    deleteActionAPI({ actionId: id });
    push(`/${workspaceSlug}/settings/actions`);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(true);
        }}
      >
        {' '}
        Delete action{' '}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this
              the action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
