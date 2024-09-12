import { RiLink } from '@remixicon/react';
import { RoleEnum } from '@tegonhq/types';
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
import { DeleteLine, EditLine, MoreLine } from '@tegonhq/ui/icons';
import React from 'react';

import { getBotIcon } from 'common';
import { type LinkedIssueType } from 'common/types';

import { useUserData } from 'hooks/users';

import { useDeleteLinkedIssueMutation } from 'services/linked-issues';

import { EditLink } from './edit-link';

interface LinkedIssueItemProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueItem({ linkedIssue }: LinkedIssueItemProps) {
  const sourceData = JSON.parse(linkedIssue.sourceData);
  const { mutate: deleteLinkedIssue } = useDeleteLinkedIssueMutation({});
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const { user } = useUserData(linkedIssue.createdById);

  function getIconComponent() {
    if (user && user.role === RoleEnum.BOT) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Component = getBotIcon(user.image as any);
      return (
        <Component className="text-[9px] w-5 h-5 bg-background-3 rounded-sm p-[2px]" />
      );
    }

    return <RiLink size={20} />;
  }

  return (
    <>
      <a
        href={linkedIssue.url}
        target="_blank"
        className="cursor-pointer w-full hover:bg-grayAlpha-100 p-3 pr-0 py-2 rounded-md flex gap-2 items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {getIconComponent()}
          <div className="text-foreground">
            <div className="flex">{sourceData?.title}</div>
          </div>
        </div>

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
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <div className="flex items-center gap-1">
                    <EditLine size={16} /> Edit
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                  <div className="flex items-center gap-1">
                    <DeleteLine size={16} /> Remove
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </a>
      {editOpen && (
        <EditLink
          linkedIssueId={linkedIssue.id}
          url={linkedIssue.url}
          title={sourceData.title}
          onClose={() => setEditOpen(false)}
        />
      )}
      {deleteOpen && (
        <AlertDialog open onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove this
                link from the issue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteLinkedIssue({
                    linkedIssueId: linkedIssue.id,
                  });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
