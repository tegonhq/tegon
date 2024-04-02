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
        <div className="flex justify-start items-center text-sm mb-3 -ml-3">
          <IssueStatusDropdown
            value={issue.stateId}
            onChange={statusChange}
            variant={IssueStatusDropdownVariant.LINK}
            teamIdentfier={currentTeam.identifier}
          />
        </div>

        <div className="flex justify-start items-center text-sm mb-3 -ml-3">
          <IssuePriorityDropdown
            value={issue.priority ?? 0}
            onChange={priorityChange}
            variant={IssuePriorityDropdownVariant.LINK}
          />
        </div>

        <div className="flex justify-start items-center text-sm mb-6 -ml-3">
          <IssueAssigneeDropdown
            value={issue.assigneeId}
            onChange={assigneeChange}
            variant={IssueAssigneeDropdownVariant.LINK}
          />
        </div>

        <IssueRelatedProperties />

        <div
          className={cn(
            'flex flex-col justify-start text-sm items-start gap-2',
          )}
        >
          <div className="text-muted-foreground  text-left">Labels</div>

          <IssueLabelDropdown
            value={issue.labelIds}
            onChange={labelsChange}
            variant={IssueLabelDropdownVariant.LINK}
            teamIdentfier={currentTeam.identifier}
          />
        </div>
      </div>
    </>
  );
});
