/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiGithubFill, RiLink, RiMoreFill } from '@remixicon/react';
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
import { DeleteLine, EditLine, SentryIcon, SlackIcon } from 'icons';

import { useDeleteLinkedIssueMutation } from 'services/linked-issues';

import { EditLink } from './edit-link';
import { SentryItem } from './sentry-item';

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
    if (sourceMetaData) {
      if (sourceMetaData.type === Integration.Slack) {
        return <SlackIcon size={16} />;
      }

      if (sourceMetaData.type === Integration.Github) {
        return <RiGithubFill size={20} />;
      }

      if (sourceMetaData.type === Integration.Sentry) {
        return <SentryIcon size={20} />;
      }
    }

    return <RiLink size={20} />;
  }

  function getTitle() {
    if (sourceMetaData) {
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

      if (sourceMetaData.type === Integration.Sentry) {
        return (
          <SentryItem title={sourceData.title} linkedIssueId={linkedIssue.id} />
        );
      }
    }

    return <div className="flex">{sourceData?.title}</div>;
  }

  return (
    <>
      <a
        href={linkedIssue.url}
        target="_blank"
        className="cursor-pointer w-full hover:bg-grayAlpha-100 p-3 pr-0 py-2 rounded-md flex gap-2 items-center justify-between"
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
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <RiMoreFill size={16} />
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
