import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import type { TeamType } from 'common/types/team';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from 'components/ui/alert-dialog';
import { TeamIcon } from 'components/ui/team-icon';

import { useMoveIssueToTeamMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CommonDialog } from './common-dialog';

interface AlertChangeProps {
  alertOpen: boolean;
  setAlertOpen: (value: boolean) => void;
  move: () => void;
}

function AlertChange({ alertOpen, setAlertOpen, move }: AlertChangeProps) {
  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
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
          <AlertDialogAction onClick={move}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface MoveIssueToTeamDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const MoveIssueToTeamDialog = observer(
  ({ open, setOpen }: MoveIssueToTeamDialogProps) => {
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [toTeamId, setToTeamId] = React.useState(undefined);
    const { applicationStore, issuesStore, teamsStore } = useContextStore();
    const {
      push,
      query: { workspaceSlug },
    } = useRouter();
    const { mutate: moveIssueToTeam } = useMoveIssueToTeamMutation({
      onSuccess: (data: IssueType) => {
        const team = teamsStore.getTeamWithId(data.teamId);
        const issueNumber = data.number;
        push(`/${workspaceSlug}/issue/${team.identifier}-${issueNumber}`);
      },
    });

    if (
      applicationStore.selectedIssues.length === 0 &&
      !applicationStore.hoverIssue
    ) {
      return null;
    }

    function getIssueIds() {
      if (applicationStore.hoverIssue) {
        return [applicationStore.hoverIssue];
      }

      return applicationStore.selectedIssues;
    }

    function getOptions() {
      const teams = teamsStore.getTeams;

      return teams.map((team: TeamType) => {
        return {
          Icon: <TeamIcon name={team.name} />,
          text: team.name,
          value: team.id,
        };
      });
    }

    function getCurrentValue() {
      const issues = getIssueIds();
      const issue = issuesStore.getIssueById(issues[0]);

      return [issue.stateId];
    }

    const onSelect = (teamId: string) => {
      setToTeamId(teamId);
      setAlertOpen(true);
    };

    const onMove = () => {
      const issueId = getIssueIds()[0];
      moveIssueToTeam({
        issueId,
        teamId: toTeamId,
      });
      setToTeamId(undefined);
    };

    return (
      <>
        {open && (
          <CommonDialog
            issueIds={getIssueIds()}
            placeholder="Choose team..."
            open={open}
            setOpen={setOpen}
            options={getOptions()}
            currentValue={getCurrentValue()}
            onSelect={onSelect}
          />
        )}
        {alertOpen && (
          <AlertChange
            alertOpen={alertOpen}
            setAlertOpen={setAlertOpen}
            move={onMove}
          />
        )}
      </>
    );
  },
);
