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
import { useRouter } from 'next/router';
import React from 'react';

import type { IssueType } from 'common/types';

import { useCurrentTeam } from 'hooks/teams';

import { useDeleteIssueMutation } from 'services/issues';

interface MoveToTeamDialogProps {
  moveToTeamDialog: boolean;
  setMoveToTeamDialog: (value: boolean) => void;
  issue: IssueType;
}

export function MoveToTeamDialog({
  moveToTeamDialog,
  setMoveToTeamDialog,
  issue,
}: MoveToTeamDialogProps) {
  const { mutate: deleteIssue } = useDeleteIssueMutation({});
  const currentTeam = useCurrentTeam();
  const {
    query: { workspaceSlug },
    push,
  } = useRouter();

  const onDeleteIssue = () => {
    deleteIssue({ issueId: issue.id, teamId: currentTeam.id });
    setMoveToTeamDialog(false);
    push(`/${workspaceSlug}/team/${currentTeam.identifier}/all`);
  };

  return (
    <AlertDialog open={moveToTeamDialog} onOpenChange={setMoveToTeamDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently move this issue
            to the team
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
  );
}
