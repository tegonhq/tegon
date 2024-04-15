/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { observer } from 'mobx-react-lite';
import React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { SCOPES } from 'common/scopes';
import { Priorities } from 'common/types/issue';

import { useShortcutHotKeys } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CommonDialog } from './common-dialog';

export const PriorityDialog = observer(() => {
  const [open, setOpen] = React.useState(false);
  const { applicationStore, issuesStore } = useContextStore();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const team = useCurrentTeam();

  useShortcutHotKeys('p', setOpen, [SCOPES.AllIssues]);

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
});
