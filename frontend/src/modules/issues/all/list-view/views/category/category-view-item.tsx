/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { WORKFLOW_CATEGORY_ICONS } from 'modules/team-settings/workflow/workflow-item';

import type { IssueType } from 'common/types/issue';
import type { WorkflowType } from 'common/types/team';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { IssueItem } from '../../issue-item';
import { useFilterIssues } from '../../list-view-utils';

interface CategoryViewItemProps {
  workflow: WorkflowType;
}

export const CategoryViewItem = observer(
  ({ workflow }: CategoryViewItemProps) => {
    const CategoryIcon =
      WORKFLOW_CATEGORY_ICONS[workflow.name] ??
      WORKFLOW_CATEGORY_ICONS['Backlog'];
    const currentTeam = useCurrentTeam();
    const { issuesStore, applicationStore } = useContextStore();
    const issues = issuesStore.getIssuesForState(
      workflow.id,
      currentTeam.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    return (
      <div className="flex flex-col">
        <div className="flex items-center w-full pl-8 p-2 bg-active dark:bg-slate-800/60">
          <CategoryIcon
            size={18}
            className="text-muted-foreground"
            color={workflow.color}
          />
          <h3 className="pl-2 text-sm font-medium">
            {workflow.name}
            <span className="text-muted-foreground ml-2">
              {computedIssues.length}
            </span>
          </h3>
        </div>

        <div>
          {computedIssues.map((issue: IssueType) => (
            <IssueItem key={issue.id} issueId={issue.id} />
          ))}
        </div>
      </div>
    );
  },
);
