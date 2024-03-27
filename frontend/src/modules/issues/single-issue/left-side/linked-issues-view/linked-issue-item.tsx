/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiDeleteBin7Fill,
  RiGithubFill,
  RiMoreFill,
  RiPencilFill,
} from '@remixicon/react';
import React from 'react';

import type { LinkedIssueType } from 'common/types/linked-issue';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components/ui/alert-dialog';
import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

import { useDeleteLinkedIssueMutation } from 'services/linked-issues';

import { EditLink } from './edit-link';

interface LinkedIssueItemProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueItem({ linkedIssue }: LinkedIssueItemProps) {
  const sourceData = JSON.parse(linkedIssue.sourceData);
  const number =
    linkedIssue.url.split('/')[linkedIssue.url.split('/').length - 1];
  const { mutate: deleteLinkedIssue } = useDeleteLinkedIssueMutation({});
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <a
        href={linkedIssue.url}
        target="_blank"
        className="cursor-pointer w-full mb-1 border-1 hover:bg-slate-100 dark:hover:bg-slate-700/50 shadow-sm bg-white dark:bg-slate-700/20  p-3 py-3 rounded-md flex gap-2 items-center justify-between text-sm"
      >
        <div className="flex items-center gap-2">
          <RiGithubFill size={18} className="text-muted-foreground" />
          <div className="text-foreground">
            #{number} {sourceData.title}
          </div>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <RiMoreFill size={16} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RiPencilFill size={14} /> Edit
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RiDeleteBin7Fill size={14} /> Remove
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
