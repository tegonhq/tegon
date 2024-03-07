/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { useIssueData } from 'hooks/issues';

import { Header } from './header';
import { IssueAssigneeDropdown } from './issue-assignee-dropdown';
import { IssuePriorityDropdown } from './issue-priority-dropdown';
import { IssueStatusDropdown } from './issue-status-dropdown';

export function RightSide() {
  const issue = useIssueData();

  return (
    <div className="bg-gray-100 border-l dark:bg-gray-800/50 flex flex-col">
      <Header />
      <div className="grow pl-8 p-4 mt-2 flex flex-col">
        <div className="flex justify-start items-center text-sm mb-4">
          <div className="text-muted-foreground w-[95px] text-left">Status</div>
          <div>
            <IssueStatusDropdown value={issue.status} />
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

        <div className="flex justify-start items-center text-sm">
          <div className="text-muted-foreground w-[95px] text-left">
            Assignee
          </div>
          <div>
            <IssueAssigneeDropdown value={issue.assigneeId} />
          </div>
        </div>
      </div>
    </div>
  );
}
