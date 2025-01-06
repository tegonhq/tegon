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
import { useToast } from '@tegonhq/ui/components/use-toast';
import { useRouter } from 'next/router';

import { useCurrentTeam } from 'hooks/teams';

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
  const team = useCurrentTeam();
  const router = useRouter();

  const { mutate: deleteViewAPI } = useDeleteViewMutation({
    onSuccess: () => {
      toast({
        title: 'Your view has been successfully deleted',
      });

      if (team) {
        router.push(
          `/${router.query.workspaceSlug}/team/${team.identifier}/views`,
        );
      } else {
        router.push(`/${router.query.workspaceSlug}/views`);
      }
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
