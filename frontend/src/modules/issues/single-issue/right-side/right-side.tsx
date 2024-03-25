/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssueLabelDropdown,
  IssueLabelDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';

import { cn } from 'common/lib/utils';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { Header } from './header';
import { IssueRelatedProperties } from './issue-related-properties';

export const RightSide = observer(() => {
  const issue = useIssueData();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const currentTeam = useCurrentTeam();

  const statusChange = (stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  const labelsChange = (labelIds: string[]) => {
    updateIssue({ id: issue.id, labelIds, teamId: issue.teamId });
  };

  const priorityChange = (priority: number) => {
    updateIssue({
      id: issue.id,
      priority,
      teamId: issue.teamId,
    });
  };

  return (
    <>
      <Header />
      <div className="grow pl-8 p-4 mt-2 flex flex-col">
        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">Status</div>
          <div className="w-[calc(100%_-_95px)]">
            <IssueStatusDropdown
              value={issue.stateId}
              onChange={statusChange}
              variant={IssueStatusDropdownVariant.LINK}
              teamIdentfier={currentTeam.identifier}
            />
          </div>
        </div>

        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">
            Priority
          </div>
          <div className="w-[calc(100%_-_95px)]">
            <IssuePriorityDropdown
              value={issue.priority ?? 0}
              onChange={priorityChange}
              variant={IssuePriorityDropdownVariant.LINK}
            />
          </div>
        </div>

        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">
            Assignee
          </div>
          <div className="w-[calc(100%_-_95px)]">
            <IssueAssigneeDropdown
              value={issue.assigneeId}
              onChange={assigneeChange}
              variant={IssueAssigneeDropdownVariant.LINK}
            />
          </div>
        </div>

        <IssueRelatedProperties />

        <div
          className={cn(
            'flex justify-start text-sm items-center',
            issue.labelIds.length > 0 && 'items-start',
          )}
        >
          <div className="text-muted-foreground w-[95px] text-left">Labels</div>
          <div className="w-[calc(100%_-_95px)]">
            <IssueLabelDropdown
              value={issue.labelIds}
              onChange={labelsChange}
              variant={IssueLabelDropdownVariant.LINK}
            />
          </div>
        </div>
      </div>
    </>
  );
});
