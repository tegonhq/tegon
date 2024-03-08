/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';

import { useIssueData } from 'hooks/issues';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { Header } from './header';
import { IssueAssigneeDropdown } from './issue-assignee-dropdown';
import { IssueLabels } from './issue-labels';
import { IssuePriorityDropdown } from './issue-priority-dropdown';
import { IssueStatusDropdown } from './issue-status-dropdown';

export const RightSide = observer(() => {
  const issue = useIssueData();
  const { mutate: updateIssue } = useUpdateIssueMutation({});

  const statusChange = (stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  const labelsChange = (labelIds: string[]) => {
    updateIssue({ id: issue.id, labelIds, teamId: issue.teamId });
  };

  return (
    <div className="bg-background border-l dark:bg-gray-800/50 flex flex-col">
      <Header />
      <div className="grow pl-8 p-4 mt-2 flex flex-col">
        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">Status</div>
          <div>
            <IssueStatusDropdown
              value={issue.stateId}
              onChange={statusChange}
            />
          </div>
        </div>

        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">
            Priority
          </div>
          <div>
            <IssuePriorityDropdown value={issue.priority} />
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
            />
          </div>
        </div>

        <div className="flex justify-start items-center text-sm">
          <div className="text-muted-foreground w-[95px] text-left">Labels</div>
          <div>
            <IssueLabels value={issue.labelIds} onChange={labelsChange} />
          </div>
        </div>
      </div>
    </div>
  );
});
