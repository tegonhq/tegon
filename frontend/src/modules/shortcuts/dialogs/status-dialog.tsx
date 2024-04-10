/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { observer } from 'mobx-react-lite';
import React from 'react';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import type { WorkflowType } from 'common/types/team';

import { useIssuesHotKeys } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CommonDialog } from './common-dialog';

export const StatusDialog = observer(() => {
  const [open, setOpen] = React.useState(false);
  const { applicationStore, workflowsStore, issuesStore } = useContextStore();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const team = useCurrentTeam();

  useIssuesHotKeys('s', setOpen, ['all-issues']);

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
    const workflows = workflowsStore.getWorkflowsForTeam(team.id);

    return workflows.map((workflow: WorkflowType) => {
      const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

      return {
        Icon: <CategoryIcon size={14} color={workflow.color} />,
        text: workflow.name,
        value: workflow.id,
      };
    });
  }

  function getCurrentValue() {
    const issues = getIssueIds();
    const issue = issuesStore.getIssueById(issues[0]);

    return [issue.stateId];
  }

  const onSelect = (newStateId: string) => {
    const issues = getIssueIds();

    issues.forEach((issueId: string) => {
      updateIssue({
        id: issueId,
        teamId: team.id,
        stateId: newStateId,
      });
    });
  };

  return (
    <>
      {open && (
        <CommonDialog
          issueIds={getIssueIds()}
          placeholder="Change Status..."
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
