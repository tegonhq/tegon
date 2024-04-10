/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { observer } from 'mobx-react-lite';
import React from 'react';

import { getTailwindColor } from 'common/color-utils';
import { cn } from 'common/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from 'components/ui/avatar';
import { useIssuesHotKeys } from 'hooks';
import { useCurrentTeam } from 'hooks/teams';
import { useUsersData } from 'hooks/users';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';
import type { User } from 'store/user-context';

import { CommonDialog } from './common-dialog';

export const AssigneeDialog = observer(() => {
  const [open, setOpen] = React.useState(false);
  const { applicationStore, issuesStore } = useContextStore();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const team = useCurrentTeam();
  const { usersData, isLoading } = useUsersData(team.id);

  useIssuesHotKeys('a', setOpen, ['all-issues']);

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
        Icon: (
          <Avatar className="h-[20px] w-[25px] flex items-center">
            <AvatarImage />
            <AvatarFallback
              className={cn(
                'text-[0.6rem] rounded-sm',
                getTailwindColor(user.username),
              )}
            >
              {getInitials(user.fullname)}
            </AvatarFallback>
          </Avatar>
        ),
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
});
