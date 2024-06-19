/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { useRouter } from 'next/router';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';
import { IssueLabels } from 'modules/issues/components/issue-list-item/issue-labels';

import type { IssueType } from 'common/types/issue';

import { useCurrentTeam } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

interface SubIssueItemProps {
  issue: IssueType;
}

export function SubIssueItem({ issue }: SubIssueItemProps) {
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
    <div className="p-2 flex justify-between cursor-default text-sm hover:bg-active/50 rounded-md">
      <div className="w-full flex items-center">
        <div className="flex items-center">
          <div className="pr-3">
            <IssueStatusDropdown
              value={issue.stateId}
              onChange={statusChange}
              variant={IssueStatusDropdownVariant.NO_BACKGROUND}
              teamIdentifier={team.identifier}
            />
          </div>
        </div>
        <span className="flex items-center justify-start shrink min-w-[0px] grow">
          <span className="truncate text-left">{issue.title}</span>
        </span>
        <div className="flex gap-2 items-center shrink min-w-max mx-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <IssueLabels labelIds={issue.labelIds} />
          </div>
          <div className="flex gap-2 shrink-0 items-center">
            <div className="w-[80px]">
              <IssuePriorityDropdown
                value={issue.priority}
                onChange={priorityChange}
                variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
              />
            </div>
            <div
              className="ml-2 pr-3 text-muted-foreground min-w-[70px]"
              onClick={openIssue}
            >{`${team.identifier}-${issue.number}`}</div>

            <IssueAssigneeDropdown
              value={issue.assigneeId}
              onChange={assigneeChange}
              variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
