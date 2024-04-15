/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiDeleteBin7Fill,
  RiGithubFill,
  RiLink,
  RiMoreFill,
  RiPencilFill,
} from '@remixicon/react';
import React from 'react';

import {
  Integration,
  LinkedSlackMessageType,
  type LinkedIssueType,
} from 'common/types/linked-issue';

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
import { SlackIcon } from 'icons';

import { useDeleteLinkedIssueMutation } from 'services/linked-issues';

import { EditLink } from './edit-link';

interface LinkedIssueItemProps {
  linkedIssue: LinkedIssueType;
}

export function LinkedIssueItem({ linkedIssue }: LinkedIssueItemProps) {
  const sourceData = JSON.parse(linkedIssue.sourceData);
  const sourceMetaData = JSON.parse(linkedIssue.source);

  const number =
    linkedIssue.url.split('/')[linkedIssue.url.split('/').length - 1];
  const { mutate: deleteLinkedIssue } = useDeleteLinkedIssueMutation({});
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  function getIcon() {
    if (sourceMetaData.type === Integration.Slack) {
      return <SlackIcon size={16} className="text-foreground" />;
    }

    if (sourceMetaData.type === Integration.Github) {
      return <RiGithubFill size={18} className="text-foreground" />;
    }

    return <RiLink size={18} className="text-foreground" />;
  }

  function getTitle() {
    if (sourceMetaData.type === Integration.Slack) {
      return (
        <div className="flex">
          <div className="mr-1">
            {sourceMetaData.subType === LinkedSlackMessageType.Thread
              ? 'Thread'
              : 'Message'}
          </div>
          from slack
          <div className="mx-1 text-muted-foreground max-w-[200px]">
            <div className="truncate">{sourceData.message}</div>
          </div>
        </div>
      );
    }

    if (sourceMetaData.type === Integration.Github) {
      return ` #${number} ${sourceData.title}`;
    }

    return <RiLink size={18} className="text-foreground" />;
  }

  return (
    <>
      <a
        href={linkedIssue.url}
        target="_blank"
        className="cursor-pointer w-full mb-1 border-1 hover:bg-active/50 shadow-sm bg-white dark:bg-slate-700/20  p-3 py-2 rounded-md flex gap-2 items-center justify-between text-sm"
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="text-foreground">{getTitle()}</div>
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
