/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { RiArrowRightSLine } from '@remixicon/react';
import dayjs from 'dayjs';
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

import { cn } from 'common/lib/utils';
import { IssueRelationEnum } from 'common/types/issue-relation';

import { Badge } from 'components/ui/badge';
import { Checkbox } from 'components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { useTeamWithId } from 'hooks/teams/use-current-team';
import { BlockedFill, BlockingToLine } from 'icons';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { useContextStore } from 'store/global-context-provider';

import { IssueLabels } from './issue-labels';

interface IssueItemProps {
  issueId: string;
}

export const IssueItem = observer(({ issueId }: IssueItemProps) => {
  const {
    push,
    query: { workspaceSlug },
  } = useRouter();
  const { mutate: updateIssue } = useUpdateIssueMutation({});
  const { issuesStore, issueRelationsStore, applicationStore } =
    useContextStore();
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
  const issueSelected = applicationStore.selectedIssues.includes(issue.id);

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
      className={cn(
        'p-2.5 pl-3 pr-4 flex justify-between group cursor-default text-sm hover:bg-active/50 border-b-[0.5px] gap-2',
        issueSelected && 'bg-primary/10',
      )}
      onClick={() => {
        push(`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`);
      }}
      onMouseOver={() => {
        const { selectedIssues } = applicationStore;
        if (selectedIssues.length === 0) {
          applicationStore.setHoverIssue(issue.id);
        }
      }}
    >
      <div className="w-full flex items-center">
        <div
          className={cn(
            'flex items-center pl-5 group-hover:pl-0',
            issueSelected && 'pl-0',
          )}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              className={cn(
                'hidden group-hover:block border-slate-300 shadow-none mr-1',
                issueSelected && 'block',
              )}
              checked={issueSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  applicationStore.addToSelectedIssues(issue.id);
                } else {
                  applicationStore.removeSelectedIssue(issue.id);
                }
              }}
            />
          </div>

          <div className="mr-2.5">
            <IssuePriorityDropdown
              value={issue.priority ?? 0}
              onChange={priorityChange}
              variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
            />
          </div>
          <div className="pr-3 text-muted-foreground min-w-[70px]">{`${team.identifier}-${issue.number}`}</div>
          <div className="pr-3">
            <IssueStatusDropdown
              value={issue.stateId}
              onChange={statusChange}
              variant={IssueStatusDropdownVariant.NO_BACKGROUND}
              teamIdentfier={team.identifier}
            />
          </div>
        </div>
        <span className="flex items-center justify-start shrink min-w-[0px]">
          <span className="truncate text-left">{issue.title}</span>

          {issue.parentId && (
            <>
              <RiArrowRightSLine
                size={14}
                className="mx-1 text-muted-foreground"
              />
              <span className="truncate text-muted-foreground">
                {issue.parent?.title}
              </span>
            </>
          )}
        </span>

        <div className="flex gap-2 items-center grow shrink min-w-max mx-2 overflow-hidden">
          <div className="flex items-center gap-2">
            {blockedIssues.length > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="mx-1 px-2 flex gap-2 text-muted-foreground"
                  >
                    <BlockedFill
                      size={14}
                      className="text-red-700 dark:text-red-400"
                    />
                    {blockedIssues.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Blocked by {blockedIssues.length} issues
                </TooltipContent>
              </Tooltip>
            )}
            {blocksIssues.length > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="mx-1 px-2 flex gap-2 text-muted-foreground"
                  >
                    <BlockingToLine
                      size={14}
                      className="text-red-700 dark:text-red-400"
                    />
                    {blocksIssues.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Blocking {blocksIssues.length} issues
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="grow"></div>
          <div className="flex items-center gap-2">
            <IssueLabels labelIds={issue.labelIds} />
          </div>
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          <div className="text-muted-foreground text-sm">
            {dayjs(issue.createdAt).format('DD MMM')}
          </div>
          <IssueAssigneeDropdown
            value={issue.assigneeId}
            onChange={assigneeChange}
            variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
          />
        </div>
      </div>
    </a>
  );
});
