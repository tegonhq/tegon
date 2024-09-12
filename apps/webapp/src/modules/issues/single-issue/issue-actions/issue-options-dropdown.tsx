import { Button } from '@tegonhq/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@tegonhq/ui/components/dropdown-menu';
import { ArrowForwardLine, MoreLine } from '@tegonhq/ui/icons';
import React from 'react';

import { AddIssueRelationModal } from 'modules/issues/components/modals';
import { MoveIssueToTeamDialog } from 'modules/shortcuts/dialogs';

import type { IssueRelationEnum } from 'common/types';

import { useIssueData } from 'hooks/issues';

import { DeleteIssueDialog } from './delete-issue-dialog';
import { DeleteIssueItem } from './delete-issue-item';
import { DropdownItem } from './dropdown-item';
import { RelatedDropdownItems } from './related-dropdown-items';
import { RemoveParentIssue } from './remove-parent-issue';

export function IssueOptionsDropdown() {
  const currentIssue = useIssueData();
  const [relatedModal, setRelatedModal] =
    React.useState<IssueRelationEnum>(undefined);
  const [deleteIssueDialog, setDeleteIssueDialog] = React.useState(false);

  const [moveIssueDialog, setMoveIssueDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <MoreLine size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setMoveIssueDialog(true)}>
            <DropdownItem Icon={ArrowForwardLine} title="Move to team" />
          </DropdownMenuItem>

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

      <MoveIssueToTeamDialog
        open={moveIssueDialog}
        setOpen={setMoveIssueDialog}
      />
    </>
  );
}
