/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiArrowRightSLine } from '@remixicon/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';

import type { IssueType } from 'common/types/issue';

import { useCurrentTeam } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { IssueLabels } from './issue-labels';

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

  const priorityChange = (priority: number) => {
    updateIssue({ id: issue.id, priority, teamId: issue.teamId });
  };

  return (
    <div className="pl-9 p-3 flex justify-between cursor-default text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/20 border-b-[0.5px]">
      <div className="flex items-center">
        <IssuePriorityDropdown
          value={issue.priority}
          onChange={priorityChange}
          variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
        />
        <div
          className="pr-3 text-muted-foreground min-w-[68px]"
          onClick={openIssue}
        >{`${team.identifier}-${issue.number}`}</div>
        <div className="pr-3">
          <IssueStatusDropdown
            value={issue.stateId}
            onChange={statusChange}
            variant={IssueStatusDropdownVariant.NO_BACKGROUND}
            teamIdentfier={team.identifier}
          />
        </div>
        <div className="font-medium max-w-[400px]" onClick={openIssue}>
          <div className="truncate">{issue.title}</div>
        </div>

        {issue.parentId && (
          <div
            className="font-medium max-w-[200px] text-muted-foreground flex items-center"
            onClick={openIssue}
          >
            <RiArrowRightSLine size={14} className="mx-2" />
            <div className="truncate ">{issue.parent.title}</div>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <div>
          <IssueLabels labelIds={issue.labelIds} />
        </div>
        <div className="text-muted-foreground text-sm">
          {dayjs(issue.createdAt).format('DD MMM')}
        </div>
        <IssueAssigneeDropdown
          value={issue.assigneeId}
          onChange={assigneeChange}
          variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
        />
      </div>
    </div>
  );
}
