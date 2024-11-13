import { observer } from 'mobx-react-lite';
import React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { usePriorities } from 'hooks/priorities';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CommonDialog } from './common-dialog';

interface PriorityDialogProps {
  open: boolean;
  setOpen(value: boolean): void;
}

export const PriorityDialog = observer(
  ({ open, setOpen }: PriorityDialogProps) => {
    const { applicationStore, issuesStore } = useContextStore();
    const { mutate: updateIssue } = useUpdateIssueMutation({});
    const team = useCurrentTeam();
    const Priorities = usePriorities();

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
      return Priorities.map((priority: string, index: number) => {
        const PriorityIcon = PriorityIcons[index];

        return {
          Icon: <PriorityIcon.icon className="text-muted-foreground h-3 w-3" />,
          text: priority,
          value: priority,
        };
      });
    }

    function getCurrentValue() {
      const issues = getIssueIds();
      const issue = issuesStore.getIssueById(issues[0]);

      return [issue.priority];
    }

    const onSelect = (priority: string) => {
      const issues = getIssueIds();

      issues.forEach((issueId: string) => {
        updateIssue({
          id: issueId,
          teamId: team.id,
          stateId: priority,
        });
      });
    };

    return (
      <>
        {open && (
          <CommonDialog
            issueIds={getIssueIds()}
            placeholder="Change Priority..."
            open={open}
            setOpen={setOpen}
            options={getOptions()}
            currentValue={getCurrentValue()}
            onSelect={onSelect}
          />
        )}
      </>
    );
  },
);
