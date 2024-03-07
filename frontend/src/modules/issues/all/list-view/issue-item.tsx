/** Copyright (c) 2024, Tegon, all rights reserved. **/
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import type { IssueType } from 'common/types/issue';

import { useCurrentTeam } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { IssueAssigneeDropdown } from './issue-assignee-dropdown';
import { IssueStatusDropdown } from './issue-status-dropdown';

interface IssueItemProps {
  issue: IssueType;
}

export function IssueItem({ issue }: IssueItemProps) {
  const team = useCurrentTeam();
  const {
    replace,
    query: { workspaceSlug },
  } = useRouter();
  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const openIssue = () => {
    replace(`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`);
  };

  const statusChange = (stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  return (
    <div className="pl-9 p-3 flex justify-between cursor-default text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/20 border-b-[0.5px]">
      <div className="flex items-center">
        <div
          className="pr-3 text-muted-foreground min-w-[68px]"
          onClick={openIssue}
        >{`${team.identifier}-${issue.number}`}</div>
        <div className="pr-3">
          <IssueStatusDropdown value={issue.stateId} onChange={statusChange} />
        </div>
        <div className="font-medium max-w-[400px]" onClick={openIssue}>
          <div className="truncate">{issue.title}</div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-muted-foreground text-sm">
          {dayjs(issue.createdAt).format('DD MMM')}
        </div>
        <IssueAssigneeDropdown
          value={issue.assigneeId}
          onChange={assigneeChange}
        />
      </div>
    </div>
  );
}
