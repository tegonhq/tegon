/** Copyright (c) 2024, Tegon, all rights reserved. **/
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

import { cn } from 'common/lib/utils';
import type { IssueType } from 'common/types/issue';
import type { IssueRelationType } from 'common/types/issue-relation';

import { Checkbox } from 'components/ui/checkbox';
import { useTeamWithId } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues/update-issue';

import { useContextStore } from 'store/global-context-provider';

import { IssueLabels } from './issue-labels';
import { IssueRelations, View } from './issue-relations';
import { getRelationIssues } from './utils';
import Link from 'next/link';

interface IssueListItemProps {
  issueId: string;
  subIssueView?: boolean;
  noBorder?: boolean;
}

interface IssueRelationIssuesProps {
  view: View;
  issue: IssueType;
}

export const IssueRelationIssues = observer(
  ({ view, issue }: IssueRelationIssuesProps) => {
    const { issuesStore, issueRelationsStore } = useContextStore();

    const issues = getRelationIssues({
      issueRelationsStore,
      issuesStore,
      issue,
      view,
    });

    return (
      <div className="pl-14 pr-6">
        {issues.map((issueRelation: IssueRelationType | IssueType) => {
          const id =
            view === View.SUB_ISSUES
              ? (issueRelation as IssueType).id
              : (issueRelation as IssueRelationType).relatedIssueId;

          return <IssueListItem key={id} subIssueView issueId={id} />;
        })}
      </div>
    );
  },
);

export const IssueListItem = observer(
  ({ issueId, subIssueView = false, noBorder = false }: IssueListItemProps) => {
    const {
      push,
      query: { workspaceSlug },
    } = useRouter();
    const [currentView, setCurrentView] = React.useState<View | undefined>();

    const { mutate: updateIssue } = useUpdateIssueMutation({});
    const { issuesStore, applicationStore } = useContextStore();
    const issue = issuesStore.getIssueById(issueId);

    const team = useTeamWithId(issue.teamId);

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
        <Link
          href={`/${workspaceSlug}/issue/${team.identifier}-${issue.number}`}
          className={cn(
            'pl-3 pr-4 flex group cursor-default hover:bg-active/50 gap-2',
            subIssueView && 'pl-0 pr-0',
          )}
          onMouseOver={() => {
            const { selectedIssues } = applicationStore;
            if (selectedIssues.length === 0) {
              applicationStore.setHoverIssue(issue.id);
            }
          }}
        >
          <div className="w-full flex items-center">
            {!subIssueView && (
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
            )}
            <div
              className={cn(
                'flex w-full items-start gap-2 pl-2 ml-1 pr-4 group-hover:bg-grayAlpha-100 rounded-xl',
                issueSelected && !subIssueView && 'bg-primary/10',
                subIssueView && 'pl-2 pr-2',
              )}
            >
              <div className="pt-2.5">
                <IssueStatusDropdown
                  value={issue.stateId}
                  onChange={statusChange}
                  variant={IssueStatusDropdownVariant.NO_BACKGROUND}
                  teamIdentifier={team.identifier}
                />
              </div>

              <div
                className={cn(
                  'flex flex-col w-full py-2.5 border-b',
                  noBorder && 'border-none',
                )}
              >
                <div className="flex w-full">
                  <div className="flex flex-wrap shrink w-full gap-2 justify-between pr-4">
                    <span className="flex items-center justify-start shrink min-w-[0px] max-w-[500px]">
                      <span className="truncate text-left">{issue.title}</span>
                    </span>

                    <div className="flex items-center gap-2 flex-wrap">
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

                {!subIssueView && (
                  <div>
                    <IssueRelations
                      issue={issue}
                      setCurrentView={setCurrentView}
                      currentView={currentView}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        {currentView && (
          <IssueRelationIssues view={currentView} issue={issue} />
        )}
      </>
    );
  },
);
