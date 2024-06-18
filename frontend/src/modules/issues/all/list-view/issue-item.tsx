/** Copyright (c) 2024, Tegon, all rights reserved. **/
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

import { Checkbox } from 'components/ui/checkbox';
import { useTeamWithId } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { useContextStore } from 'store/global-context-provider';

import { IssueLabels } from '../../components/issue-list-item/issue-labels';

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
    <>
      <a
        className={cn(
          'pl-1 pr-4 flex group cursor-default hover:bg-active/50 gap-2',
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
              'flex items-center py-2.5 pl-4 group-hover:pl-0',
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
                  'hidden group-hover:block',
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
          </div>
          <div
            className={cn(
              'flex w-full items-center gap-2 pl-2 ml-1 pr-4 group-hover:bg-grayAlpha-100 rounded-xl',
              issueSelected && 'bg-primary/10',
            )}
          >
            <div>
              <IssueStatusDropdown
                value={issue.stateId}
                onChange={statusChange}
                variant={IssueStatusDropdownVariant.NO_BACKGROUND}
                teamIdentifier={team.identifier}
              />
            </div>
            <div className="py-2.5 flex w-full border-b">
              <div className="flex flex-wrap shrink w-full">
                <span className="flex items-center justify-start shrink min-w-[0px]">
                  <span className="truncate text-left">{issue.title}</span>
                </span>

                <div className="flex items-center gap-2 ml-2">
                  <IssueLabels labelIds={issue.labelIds} />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-8">
                <div className="w-[80px]">
                  <IssuePriorityDropdown
                    value={issue.priority ?? 0}
                    onChange={priorityChange}
                    variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
                  />
                </div>
                <div className="min-w-[70px] text-muted-foreground text-xs font-mono">{`${team.identifier}-${issue.number}`}</div>
                <IssueAssigneeDropdown
                  value={issue.assigneeId}
                  onChange={assigneeChange}
                  variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
                />
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  );
});
