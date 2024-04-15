/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiMoreFill } from '@remixicon/react';
import React from 'react';

import { AddIssueRelationModal } from 'modules/issues/components/modals';

import type { IssueRelationEnum } from 'common/types/issue-relation';
import type { LinkedIssueSubType } from 'common/types/linked-issue';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { useIssueData } from 'hooks/issues';

import { DeleteIssueDialog } from './delete-issue-dialog';
import { DeleteIssueItem } from './delete-issue-item';
import { LinkedIssueItems } from './linked-issue-items';
import { RelatedDropdownItems } from './related-dropdown-items';
import { RemoveParentIssue } from './remove-parent-issue';
import { AddLinkedIssueDialog } from '../linked-issues-view/add-linked-issue-dialog';

export function IssueOptionsDropdown() {
  const currentIssue = useIssueData();
  const [relatedModal, setRelatedModal] =
    React.useState<IssueRelationEnum>(undefined);
  const [deleteIssueDialog, setDeleteIssueDialog] = React.useState(false);
  const [dialogOpen, setDialogOpen] =
    React.useState<LinkedIssueSubType>(undefined);

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
          <LinkedIssueItems setDialogOpen={setDialogOpen} />
          <RelatedDropdownItems setRelatedModal={setRelatedModal} />
          <DropdownMenuSeparator />
          {currentIssue.parentId && <RemoveParentIssue issue={currentIssue} />}
          <DeleteIssueItem setDeleteIssueDialog={setDeleteIssueDialog} />
        </DropdownMenuContent>
      </DropdownMenu>

      <AddIssueRelationModal
        isOpen={!!relatedModal}
        type={relatedModal}
        onClose={() => setRelatedModal(undefined)}
      />
      <DeleteIssueDialog
        issue={currentIssue}
        deleteIssueDialog={deleteIssueDialog}
        setDeleteIssueDialog={setDeleteIssueDialog}
      />
      <AddLinkedIssueDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        issueId={currentIssue.id}
      />
    </>
  );
}
