/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiDeleteBin7Line,
  RiExternalLinkLine,
  RiGithubFill,
  RiMoreFill,
  type RemixiconComponentType,
} from '@remixicon/react';
import {
  BlockedFill,
  BlockingToLine,
  DuplicateLine,
  ParentIssueLine,
  RelatedIssueLine,
  SubIssueLine,
} from 'icons';
import { useRouter } from 'next/router';
import React from 'react';

import { AddIssueRelationModal } from 'modules/issues/components/modals';

import { IssueRelationEnum } from 'common/types/issue-relation';
import { LinkedIssueSubType } from 'common/types/linked-issue';

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
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useDeleteIssueMutation } from 'services/issues';

import { AddLinkedIssueDialog } from './linked-issues-view/add-linked-issue-dialog';

function DropdownItem({
  Icon,
  title,
}: {
  Icon: RemixiconComponentType;
  title: string;
}) {
  return (
    <div className="flex gap-2 items-center hover:text-foreground mr-2">
      <Icon size={16} />
      <span className="text-foreground">{title}</span>
    </div>
  );
}

export function IssueOptionsDropdown() {
  const [relatedModal, setRelatedModal] =
    React.useState<IssueRelationEnum>(undefined);
  const [dialogOpen, setDialogOpen] =
    React.useState<LinkedIssueSubType>(undefined);
  const currentIssue = useIssueData();
  const currentTeam = useCurrentTeam();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const {
    query: { workspaceSlug },
    push,
  } = useRouter();
  const { mutate: deleteIssue } = useDeleteIssueMutation({});

  const onDeleteIssue = () => {
    deleteIssue({ issueId: currentIssue.id });
    setDeleteOpen(false);
    push(`/${workspaceSlug}/team/${currentTeam.identifier}/all`);
  };

  return (
    <>
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
        <DropdownMenuContent align="start" className="text-muted-foreground">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DropdownItem Icon={RiExternalLinkLine} title="Add link" />
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="text-muted-foreground">
                <DropdownMenuItem
                  onClick={() => setDialogOpen(LinkedIssueSubType.GithubIssue)}
                >
                  <DropdownItem Icon={RiGithubFill} title="Github issue" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setDialogOpen(LinkedIssueSubType.GithubPullRequest)
                  }
                >
                  <DropdownItem
                    Icon={RiGithubFill}
                    title="Github pull request"
                  />
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DropdownItem Icon={RelatedIssueLine} title="Add related" />
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="text-muted-foreground">
                <DropdownMenuItem
                  onClick={() => {
                    setRelatedModal(IssueRelationEnum.PARENT);
                  }}
                >
                  <DropdownItem Icon={ParentIssueLine} title="Parent of..." />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setRelatedModal(IssueRelationEnum.SUB_ISSUE);
                  }}
                >
                  <DropdownItem Icon={SubIssueLine} title=" Sub-issue of..." />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setRelatedModal(IssueRelationEnum.RELATED);
                  }}
                >
                  <DropdownItem
                    Icon={RelatedIssueLine}
                    title=" Related to..."
                  />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setRelatedModal(IssueRelationEnum.BLOCKED);
                  }}
                >
                  <DropdownItem Icon={BlockedFill} title=" Blocked by..." />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setRelatedModal(IssueRelationEnum.BLOCKS);
                  }}
                >
                  <DropdownItem Icon={BlockingToLine} title="Blocked to..." />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setRelatedModal(IssueRelationEnum.DUPLICATE_OF);
                  }}
                >
                  <DropdownItem Icon={DuplicateLine} title="Duplicate of..." />
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <DropdownItem Icon={RiDeleteBin7Line} title="Delete" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {relatedModal && (
        <AddIssueRelationModal
          isOpen
          type={relatedModal}
          onClose={() => setRelatedModal(undefined)}
        />
      )}

      <AddLinkedIssueDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        issueId={currentIssue.id}
      />

      {deleteOpen && (
        <AlertDialog open onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove this
                the issue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteIssue}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
