import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';

import {
  DueDate,
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssueLabelDropdown,
  IssueLabelDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

import { IssueRelatedProperties } from './issue-related-properties';

export const RightSide = observer(() => {
  const issue = useIssueData();
  const { mutate: updateIssue } = useUpdateIssueMutation({
    onMutate: (variables) => {
      console.log('UpdateIssueMutation: Starting mutation with variables:', variables);
    },
    onSuccess: (data, variables) => {
      console.log('UpdateIssueMutation: Success. Updated data:', data);
      console.log('UpdateIssueMutation: Variables used:', variables);
    },
    onError: (error, variables) => {
      console.error('UpdateIssueMutation: Error updating issue:', error);
      console.error('UpdateIssueMutation: Variables used:', variables);
    },
  });
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

  const dueDateChange = (date: Date | null) => {
    console.log('RightSide: Updating due date to:', date);
    const isoDate = date ? date.toISOString() : null;
    console.log('RightSide: Converted ISO date:', isoDate);
    updateIssue(
      { id: issue.id, dueDate: isoDate, teamId: issue.teamId },
      {
        onSuccess: (data) => {
          console.log('RightSide: updateIssue succeeded with data:', data);
        },
        onError: (error) => {
          console.error('RightSide: updateIssue failed with error:', error);
        },
      }
    );
  };

  React.useEffect(() => {
    console.log('RightSide: Issue data changed:', issue);
  }, [issue]);

  return (
    <>
      <div className="grow p-6 flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label className="text-xs">Status</label>
          <IssueStatusDropdown
            value={issue.stateId}
            onChange={statusChange}
            variant={IssueStatusDropdownVariant.LINK}
            teamIdentifier={currentTeam.identifier}
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs">Priority</label>

          <IssuePriorityDropdown
            value={issue.priority ?? 0}
            onChange={priorityChange}
            variant={IssuePriorityDropdownVariant.LINK}
          />
        </div>

        <div className="flex flex-col items-start">
          <label className="text-xs">Assignee</label>

          <IssueAssigneeDropdown
            value={issue.assigneeId}
            onChange={assigneeChange}
            variant={IssueAssigneeDropdownVariant.LINK}
          />
        </div>

        <IssueRelatedProperties />

        <div className={cn('flex flex-col justify-start items-start gap-1')}>
          <div className="text-xs text-left">Labels</div>

          <IssueLabelDropdown
            value={issue.labelIds}
            onChange={labelsChange}
            variant={IssueLabelDropdownVariant.LINK}
            teamIdentifier={currentTeam.identifier}
          />
        </div>
        <div className={cn('flex flex-col justify-start items-start gap-1')}>
          <div className="text-xs text-left">Due Date</div>
          <DueDate dueDate={issue.dueDate} dueDateChange={dueDateChange} />
        </div>
      </div>
    </>
  );
});
