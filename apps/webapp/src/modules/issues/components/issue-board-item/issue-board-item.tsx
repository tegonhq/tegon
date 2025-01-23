import type { DraggableProvided } from '@hello-pangea/dnd';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { type CSSProperties } from 'react';

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
import { IssueCycle } from '../issue-list-item/issue-cycle';
import { IssueDueDate } from '../issue-list-item/issue-duedate';
import { IssueLabels } from '../issue-list-item/issue-labels';
import { IssueProject } from '../issue-list-item/issue-project';

interface BoardIssueItemProps {
  issueId: string;
  isDragging: boolean;
  provided: DraggableProvided;
  style?: CSSProperties;
  key?: string;
  measure?: () => void;
}

function getStyle(provided: DraggableProvided, style?: CSSProperties) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

export const BoardIssueItem = observer(
  ({
    issueId,
    isDragging,
    provided,
    style,
    key,
    measure,
  }: BoardIssueItemProps) => {
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
        className="p-3 flex flex-col justify-between group rounded-md bg-background-3 dark:bg-grayAlpha-200 w-[100%] gap-2 mb-2 !cursor-default hover:bg-background-3/70"
        onClick={() => {
          push(`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`);
        }}
        ref={(el) => {
          provided.innerRef(el);
          // Debounce measure to prevent infinite loop
          if (el) {
            setTimeout(measure, 0);
          }
        }}
        key={key}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getStyle(provided, style)}
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
        <IssueProject
          projectId={issue.projectId}
          projectMilestoneId={issue.projectMilestoneId}
        />
        <IssueCycle cycleId={issue.cycleId} />

        <IssueRelations issue={issue} />

        <div className="flex gap-2 items-center justify-between">
          <div className="inline-flex gap-2 items-center">
            <IssuePriorityDropdown
              value={issue.priority ?? 0}
              onChange={priorityChange}
              variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
            />
            <IssueDueDate dueDate={issue.dueDate} />
          </div>

          <IssueAssigneeDropdown
            value={issue.assigneeId}
            onChange={assigneeChange}
            teamId={team.id}
            variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
          />
        </div>
      </a>
    );
  },
);
