import type { DraggableProvided } from '@hello-pangea/dnd';

import { CalendarLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React from 'react';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';

import { useTeamWithId } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { IssueRelations } from './issue-relations';
import { IssueLabels } from '../issue-list-item/issue-labels';

interface BoardIssueItemProps {
  issueId: string;
  isDragging: boolean;
  provided: DraggableProvided;
}

function getStyle(provided: DraggableProvided) {
  return provided.draggableProps.style;
}

function formatDateToDayMonth(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };

  return date.toLocaleDateString('en-GB', options);
}

export const BoardIssueItem = observer(
  ({ issueId, isDragging, provided }: BoardIssueItemProps) => {
    const {
      push,
      query: { workspaceSlug },
    } = useRouter();
    const { mutate: updateIssue } = useUpdateIssueMutation({});
    const { issuesStore, applicationStore } = useContextStore();
    const issue = issuesStore.getIssueById(issueId);
    const team = useTeamWithId(issue.teamId);

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
      <a
        className="p-3 flex flex-col justify-between group cursor-default rounded-md bg-background-3 dark:bg-gray-300 w-[100%] gap-2"
        onClick={() => {
          push(`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`);
        }}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getStyle(provided)}
        data-is-dragging={isDragging}
        onMouseOver={() => {
          const { selectedIssues } = applicationStore;
          if (selectedIssues.length === 0) {
            applicationStore.setHoverIssue(issue.id);
          }
        }}
      >
        <div className="flex justify-between">
          <div className="pr-2">
            <IssueStatusDropdown
              value={issue.stateId}
              onChange={statusChange}
              variant={IssueStatusDropdownVariant.NO_BACKGROUND}
              teamIdentifier={team.identifier}
            />
          </div>
          <div className="text-muted-foreground font-mono">{`${team.identifier}-${issue.number}`}</div>
        </div>
        <div className="flex">
          <div className="line-clamp-2">{issue.title}</div>
        </div>

        <IssueLabels labelIds={issue.labelIds} />

        <IssueRelations issue={issue} />

        <div className="flex gap-2 items-center justify-between">
          <div className="inline-flex gap-2 items-end">
            <IssuePriorityDropdown
              value={issue.priority ?? 0}
              onChange={priorityChange}
              variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
            />
            {issue.dueDate && (
              <div className="inline-flex min-w-[70px] text-xs gap-1">
                <CalendarLine size={18} /> &nbsp;
                {formatDateToDayMonth(issue.dueDate)}
              </div>
            )}
          </div>

          <IssueAssigneeDropdown
            value={issue.assigneeId}
            onChange={assigneeChange}
            variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
          />
        </div>
      </a>
    );
  },
);
