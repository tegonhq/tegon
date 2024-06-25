/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { observer } from 'mobx-react-lite';
import React from 'react';

import { AvatarText } from 'components/ui/avatar';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { CommonDialog } from './common-dialog';

interface AssigneeDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const AssigneeDialog = observer(
  ({ open, setOpen }: AssigneeDialogProps) => {
    const { applicationStore, issuesStore } = useContextStore();
    const { mutate: updateIssue } = useUpdateIssueMutation({});
    const team = useCurrentTeam();
    const { usersData, isLoading } = useUsersData(team.id);

    if (
      isLoading ||
      (applicationStore.selectedIssues.length === 0 &&
        !applicationStore.hoverIssue)
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
      return usersData.map((user: User) => {
        return {
          Icon: <AvatarText text={user.fullname} className="text-[9px]" />,
          text: user.username,
          value: user.id,
        };
      });
    }

    const onSelect = (assigneeId: string) => {
      const issues = getIssueIds();
      const issue = issuesStore.getIssueById(issues[0]);
      const teamId = issue.teamId;

      issues.forEach((issueId: string) => {
        updateIssue({
          id: issueId,
          teamId,
          assigneeId,
        });
      });
    };

    return (
      <>
        {open && (
          <CommonDialog
            issueIds={getIssueIds()}
            placeholder="Change Assignee..."
            open={open}
            setOpen={setOpen}
            options={getOptions()}
            onSelect={onSelect}
          />
        )}
      </>
    );
  },
);
