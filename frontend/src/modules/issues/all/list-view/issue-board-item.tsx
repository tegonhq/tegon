/** Copyright (c) 2024, Tegon, all rights reserved. **/
import type { DraggableProvided } from '@hello-pangea/dnd';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import {
  IssueAssigneeDropdown,
  IssueAssigneeDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
} from 'modules/issues/components';

import { IssueRelationEnum } from 'common/types/issue-relation';

import { Badge } from 'components/ui/badge';
import { useTeamWithId } from 'hooks/teams/use-current-team';
import { BlockedFill, BlockingToLine } from 'icons';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { useContextStore } from 'store/global-context-provider';

import { IssueLabels } from './issue-labels';

interface BoardIssueItemProps {
  issueId: string;
  isDragging: boolean;
  provided: DraggableProvided;
}

function getStyle(provided: DraggableProvided) {
  return provided.draggableProps.style;
}

export const BoardIssueItem = observer(
  ({ issueId, isDragging, provided }: BoardIssueItemProps) => {
    const {
      push,
      query: { workspaceSlug },
    } = useRouter();
    const { mutate: updateIssue } = useUpdateIssueMutation({});
    const { issuesStore, issueRelationsStore } = useContextStore();
    const issue = issuesStore.getIssueById(issueId);
    const team = useTeamWithId(issue.teamId);
    const blockedIssues = issueRelationsStore.getIssueRelationForType(
      issue.id,
      IssueRelationEnum.BLOCKED,
    );
    const blocksIssues = issueRelationsStore.getIssueRelationForType(
      issue.id,
      IssueRelationEnum.BLOCKS,
    );

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
        className="p-2 flex flex-col justify-between group cursor-default text-sm rounded-md bg-background w-[100%]"
        onClick={() => {
          push(`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`);
        }}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getStyle(provided)}
        data-is-dragging={isDragging}
      >
        <div className="flex justify-between">
          <div className="text-muted-foreground min-w-[70px]">{`${team.identifier}-${issue.number}`}</div>
          <IssueAssigneeDropdown
            value={issue.assigneeId}
            onChange={assigneeChange}
            variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
          />
        </div>
        <div className="flex mb-3">
          <div className="pr-2">
            <IssueStatusDropdown
              value={issue.stateId}
              onChange={statusChange}
              variant={IssueStatusDropdownVariant.NO_BACKGROUND}
              teamIdentfier={team.identifier}
            />
          </div>
          <div className="font-medium mr-1 mt-[2px] line-clamp-2">
            {issue.title}
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <IssuePriorityDropdown
            value={issue.priority ?? 0}
            onChange={priorityChange}
            variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
          />
          {blockedIssues.length > 0 && (
            <Badge
              variant="outline"
              className="px-2 flex gap-2 text-muted-foreground"
            >
              <BlockedFill
                size={14}
                className="text-red-700 dark:text-red-400"
              />
              {blockedIssues.length}
            </Badge>
          )}
          {blocksIssues.length > 0 && (
            <Badge
              variant="outline"
              className="px-2 flex gap-2 text-muted-foreground"
            >
              <BlockingToLine
                size={14}
                className="text-red-700 dark:text-red-400"
              />
              {blocksIssues.length}
            </Badge>
          )}

          <IssueLabels labelIds={issue.labelIds} />
        </div>
      </a>
    );
  },
);
