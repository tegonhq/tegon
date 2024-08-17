import { Button } from '@tegonhq/ui/components/button';
import { Calendar } from '@tegonhq/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@tegonhq/ui/components/popover';
import { cn } from '@tegonhq/ui/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

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

import { useIssueData } from 'hooks/issues';
import { useCurrentTeam } from 'hooks/teams';

import { useUpdateIssueMutation } from 'services/issues';

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

  const dueDateChange = (dueDate: Date) => {
    updateIssue({ id: issue.id, dueDate, teamId: issue.teamId });
  };

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const [dueDate, setDueDate] = React.useState<Date>(
    issue.dueDate ? new Date(issue.dueDate) : null,
  );

  useEffect(() => {
    dueDateChange(dueDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueDate]);

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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !dueDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                disabled={disablePastDates}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
});
