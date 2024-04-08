/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { observer } from 'mobx-react-lite';
import React from 'react';

import type { IssueType } from 'common/types/issue';
import type { LabelType } from 'common/types/label';

import { useContextStore } from 'store/global-context-provider';

import { IssueItem } from '../../issue-item';
import { useFilterIssues } from '../../list-view-utils';
import { useCurrentTeam } from 'hooks/teams';

interface LabelListItemProps {
  label: LabelType;
}

export const LabelListItem = observer(({ label }: LabelListItemProps) => {
  const { issuesStore, applicationStore } = useContextStore();
  const issues = issuesStore.getIssuesForLabel(
    label.id,
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
        <h3 className="text-sm font-medium">
          {label.name}

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
});

export const NoLabelList = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const issues = issuesStore.getIssuesForNoLabel(
    applicationStore.displaySettings.showSubIssues,
    team.id,
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
        <h3 className="text-sm font-medium">
          No Label
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
});
