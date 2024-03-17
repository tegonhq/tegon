/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import { PriorityIcons } from 'modules/issues/components';

import { Priorities, type IssueType } from 'common/types/issue';

import { useContextStore } from 'store/global-context-provider';

import { IssueItem } from '../../issue-item';
import { filterIssues } from '../../list-view-utils';

interface PriorityViewItemProps {
  priority: number;
}

export const PriorityViewItem = observer(
  ({ priority }: PriorityViewItemProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const issues = issuesStore.getIssuesForPriority(
      priority,
      applicationStore.displaySettings.showSubIssues,
    );
    const computedIssues = React.useMemo(() => {
      return filterIssues(issues, applicationStore.filters);
    }, [issues, applicationStore.filters]);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    const PriorityIcon = PriorityIcons[priority];

    return (
      <div className="flex flex-col">
        <div className="flex items-center w-full pl-8 p-2 bg-gray-100 dark:bg-gray-800/60">
          <PriorityIcon.icon size={18} className="text-muted-foreground mr-2" />
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
