import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@tegonhq/ui/components/alert-dialog';
import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { DeleteLine, MoreLine } from '@tegonhq/ui/icons';
import { useRouter } from 'next/router';
import React from 'react';

import { useProject } from 'hooks/projects';

import { useDeleteProjectMutation } from 'services/projects';

export function ProjectDetailsDropdown() {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const { mutate } = useDeleteProjectMutation({});
  const project = useProject();
  const router = useRouter();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <MoreLine size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              <div className="flex items-center gap-1">
                <DeleteLine size={16} /> Remove
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {deleteOpen && (
        <AlertDialog open onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will project milestone from
                the issues also.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  router.push(`/${router.query.workspaceSlug}/projects`);
                  mutate(project.id);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
