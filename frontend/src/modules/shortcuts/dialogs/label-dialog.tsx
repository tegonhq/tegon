/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { observer } from 'mobx-react-lite';
import React from 'react';

import type { LabelType } from 'common/types/label';

import { BadgeColor } from 'components/ui/badge';
import { useShortcutHotKeys } from 'hooks';
import { useTeamLabels } from 'hooks/labels';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { CommonDialog } from './common-dialog';

export const LabelDialog = observer(() => {
  const [open, setOpen] = React.useState(false);
  const { applicationStore, issuesStore } = useContextStore();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const team = useCurrentTeam();
  const labels = useTeamLabels(team.identifier);

  useShortcutHotKeys('l', setOpen, ['all-issues']);

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
    return labels.map((label: LabelType) => {
      return {
        Icon: <BadgeColor style={{ background: label.color }} />,
        text: label.name,
        value: label.id,
      };
    });
  }

  const onSelect = (labelId: string) => {
    const issues = getIssueIds();

    issues.forEach((issueId: string) => {
      const issue = issuesStore.getIssueById(issueId);
      if (!issue.labelIds.includes(labelId)) {
        const labelIds = [...issue.labelIds, labelId];

        updateIssue({
          id: issueId,
          teamId: team.id,
          labelIds,
        });
      }
    });
  };

  const getCurrentValue = () => {
    const issues = getIssueIds();

    if (issues.length === 1) {
      return issues[0].labelIds;
    }

    return [];
  };

  return (
    <>
      {open && (
        <CommonDialog
          issueIds={getIssueIds()}
          placeholder="Add Label..."
          open={open}
          setOpen={setOpen}
          options={getOptions()}
          onSelect={onSelect}
          currentValue={getCurrentValue()}
          multiple
        />
      )}
    </>
  );
});