import { Checkbox } from '@tegonhq/ui/components/checkbox';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React, { Suspense } from 'react';

import {
  IssueAssigneeDropdownVariant,
  IssuePriorityDropdown,
  IssuePriorityDropdownVariant,
  IssueStatusDropdown,
  IssueStatusDropdownVariant,
  LazyIssueAssigneeDropdown,
} from 'modules/issues/components';

import type { IssueType } from 'common/types';

import { IssueViewContext } from 'components/side-issue-view';
import { useTeamWithId } from 'hooks/teams/use-current-team';

import { useUpdateIssueMutation } from 'services/issues';

import { useContextStore } from 'store/global-context-provider';

import { IssueCycle } from './issue-cycle';
import { IssueDueDate } from './issue-duedate';
import { IssueLabels } from './issue-labels';
import { IssueProject } from './issue-project';
import { IssueRelations, View } from './issue-relations';
import { getRelationIssues, useSortIssues } from './utils';

interface IssueListItemProps {
  issueId: string;
  subIssueView?: boolean;
  noBorder?: boolean;
  changeHeight?: (issueCount: number) => void;
}

interface IssueRelationIssuesProps {
  view: View;
  issue: IssueType;
}

export const IssueRelationIssues = observer(
  ({ view, issue }: IssueRelationIssuesProps) => {
    const { issuesStore, issueRelationsStore } = useContextStore();

    let issues = getRelationIssues({
      issueRelationsStore,
      issuesStore,
      issue,
      view,
    });

    issues = useSortIssues(issues);

    return (
      <div className="pl-12 pr-2">
        {issues.map((issue: IssueType) => {
          return (
            <IssueListItem key={issue.id} subIssueView issueId={issue.id} />
          );
        })}
      </div>
    );
  },
);

export const IssueListItem = observer(
  ({
    issueId,
    subIssueView = false,
    noBorder = false,
    changeHeight,
  }: IssueListItemProps) => {
    const [currentView, setCurrentView] = React.useState<View | undefined>();
    const {
      openIssue,
      issueId: currentViewIssueId,
      closeIssueView,
    } = React.useContext(IssueViewContext);

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
        <a
          onClick={(e) => {
            if (!e.metaKey && currentViewIssueId === issue.id) {
              closeIssueView();
              return;
            }
            openIssue(issue.id, e.metaKey);
          }}
          className={cn(
            'pl-1 pr-2 flex group cursor-default gap-2',
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
                'flex grow items-start gap-2 pl-2 ml-1 pr-2 group-hover:bg-grayAlpha-100 rounded-xl shrink min-w-[0px]',
                issueSelected && !subIssueView && 'bg-primary/10',
                subIssueView && 'pl-2 pr-2',
              )}
            >
              <div className="pt-2.5 shrink-0">
                <IssueStatusDropdown
                  value={issue.stateId}
                  onChange={statusChange}
                  variant={IssueStatusDropdownVariant.NO_BACKGROUND}
                  teamIdentifier={team.identifier}
                />
              </div>

              <div
                className={cn(
                  'flex flex-col w-full py-2.5 border-b border-border shrink min-w-[0px]',
                  noBorder && 'border-none',
                )}
              >
                <div className="flex w-full justify-between gap-4">
                  <div className="inline-flex items-center justify-start shrink min-w-[0px]">
                    <div className="text-left truncate">{issue.title}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pr-1 shrink-0">
                    <IssueDueDate dueDate={issue.dueDate} />

                    <IssueCycle cycleId={issue.cycleId} />
                    <IssueProject
                      projectId={issue.projectId}
                      projectMilestoneId={issue.projectMilestoneId}
                    />
                    <IssueLabels labelIds={issue.labelIds} />
                    <div className="w-[20px] mr-8">
                      <IssuePriorityDropdown
                        value={issue.priority ?? 0}
                        onChange={priorityChange}
                        variant={IssuePriorityDropdownVariant.NO_BACKGROUND}
                        className="text-xs"
                      />
                    </div>
                    <div className="min-w-[70px] text-muted-foreground text-xs font-mono">{`${team.identifier}-${issue.number}`}</div>
                    <Suspense>
                      <LazyIssueAssigneeDropdown
                        value={issue.assigneeId}
                        onChange={assigneeChange}
                        teamId={team.id}
                        variant={IssueAssigneeDropdownVariant.NO_BACKGROUND}
                      />
                    </Suspense>
                  </div>
                </div>

                {!subIssueView && (
                  <div>
                    <IssueRelations
                      issue={issue}
                      setCurrentView={setCurrentView}
                      currentView={currentView}
                      changeHeight={changeHeight}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>

        {currentView && (
          <IssueRelationIssues view={currentView} issue={issue} />
        )}
      </>
    );
  },
);

IssueListItem.displayName = 'IssueListItem';
