/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from 'components/ui/alert-dialog';
import { useToast } from 'components/ui/use-toast';

import { useDeleteViewMutation } from 'services/views';

interface DeleteViewAlertProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  viewId: string;
}

export function DeleteViewAlert({
  open,
  setOpen,
  viewId,
}: DeleteViewAlertProps) {
  const { toast } = useToast();

  const { mutate: deleteViewAPI } = useDeleteViewMutation({
    onSuccess: () => {
      toast({
        title: 'Your view has been successfully deleted',
      });
    },
  });

  const deleteView = () => {
    deleteViewAPI({ viewId });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove this the
            view.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteView()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
