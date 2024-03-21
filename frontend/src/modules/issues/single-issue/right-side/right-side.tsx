/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssueLabelDropdown,
  IssueLabelDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueRelatedDropdown,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { Header } from './header';

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
    <div className="bg-background border-l dark:bg-slate-800/50 flex flex-col">
      <Header />
      <div className="grow pl-8 p-4 mt-2 flex flex-col">
        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">Status</div>
          <div>
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
          <div>
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
          <div>
            <IssueAssigneeDropdown
              value={issue.assigneeId}
              onChange={assigneeChange}
              variant={IssueAssigneeDropdownVariant.LINK}
            />
          </div>
        </div>

        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">Labels</div>
          <div>
            <IssueLabelDropdown
              value={issue.labelIds}
              onChange={labelsChange}
              variant={IssueLabelDropdownVariant.LINK}
            />
          </div>
        </div>

        <div className="flex justify-start items-center text-sm">
          <div className="text-muted-foreground w-[95px] text-left">
            Related
          </div>
          <div>
            <IssueRelatedDropdown />
          </div>
        </div>
      </div>
    </div>
  );
});
