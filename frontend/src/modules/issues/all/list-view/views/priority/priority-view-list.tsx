/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { Priorities, type IssueType } from 'common/types/issue';

import { useCurrentTeam } from 'hooks/teams';

import { useContextStore } from 'store/global-context-provider';

import { IssueItem } from '../../issue-item';
import { useFilterIssues } from '../../list-view-utils';

interface PriorityViewListProps {
  priority: number;
}

export const PriorityViewList = observer(
  ({ priority }: PriorityViewListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const issues = issuesStore.getIssuesForPriority(
      priority,
      team.id,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = useFilterIssues(issues);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    const PriorityIcon = PriorityIcons[priority];

    return (
      <div className="flex flex-col">
        <div className="flex items-center w-full pl-8 p-2 bg-active dark:bg-slate-800/60">
          <PriorityIcon.icon size={16} className="text-muted-foreground mr-2" />
          <h3 className="pl-2 text-sm font-medium">
            {Priorities[priority]}
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
