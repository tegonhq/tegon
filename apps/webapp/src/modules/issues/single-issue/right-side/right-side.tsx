import type { DateValue } from '@react-types/calendar';

import { CalendarDate } from '@internationalized/date';
import { DatePicker } from '@nextui-org/date-picker';
import { useUpdateIssueMutation } from '@tegonhq/services/issues';
import { cn } from '@tegonhq/ui/lib/utils';
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

import { IssueRelatedProperties } from './issue-related-properties';

interface Calendar {
  calendar: {
    identifier: string;
  };
  day: number;
  era: string;
  month: number;
  year: number;
}

function calendarToDate(calendar: Calendar): Date {
  if (calendar === null || calendar === undefined) {
    return null;
  }
  const { day, month, year, era } = calendar;

  // Adjust year based on era
  let adjustedYear = year;
  if (era === 'BC') {
    adjustedYear = -year + 1; // Simple example of BC handling
  }
  const jsMonth = month - 1;
  const date = new Date(adjustedYear, jsMonth, day);

  return date;
}

function convertToCalendarDate(dateStr: string): CalendarDate {
  if (!dateStr) {
    return null;
  }
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are 0-based in JavaScript
  const day = date.getDate();

  return new CalendarDate(year, month, day);
}

export const RightSide = observer(() => {
  const issue = useIssueData();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const currentTeam = useCurrentTeam();
  const [dueDate, setDueDate] = React.useState<DateValue>(
    convertToCalendarDate(issue.dueDate?.toString()),
  );
  useEffect(() => {
    dueDateChange();
  }, [dueDate]);
  const statusChange = (stateId: string) => {
    updateIssue({ id: issue.id, stateId, teamId: issue.teamId });
  };

  const assigneeChange = (assigneeId: string) => {
    updateIssue({ id: issue.id, assigneeId, teamId: issue.teamId });
  };

  const labelsChange = (labelIds: string[]) => {
    updateIssue({ id: issue.id, labelIds, teamId: issue.teamId });
  };

  const dueDateChange = () => {
    const convertedDate = calendarToDate(dueDate);
    updateIssue({ id: issue.id, dueDate: convertedDate, teamId: issue.teamId });
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
          <DatePicker
            className="selectorIcon"
            description="outside-left"
            labelPlacement="outside-left"
            variant="underlined"
            size="sm"
            value={dueDate}
            onChange={setDueDate}
          />
        </div>
      </div>
    </>
  );
});
