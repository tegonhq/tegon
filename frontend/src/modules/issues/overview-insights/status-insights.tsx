/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { groupBy } from 'common/lib/common';
import { getWorkflowColor } from 'common/status-color';
import type { IssueType } from 'common/types/issue';
import { WORKFLOW_CATEGORY_ICONS } from 'common/types/status';
import type { WorkflowType } from 'common/types/team';

import { useContextStore } from 'store/global-context-provider';

interface StatusInsightsProps {
  issues: IssueType[];
}

export function StatusInsights({ issues }: StatusInsightsProps) {
  const { workflowsStore } = useContextStore();
  const groupedByIssues = groupBy(issues, 'stateId');

  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from(groupedByIssues.keys()).map((key: string) => {
        const workflow = workflowsStore.getWorkflowWithId(key) as WorkflowType;
        const CategoryIcon = WORKFLOW_CATEGORY_ICONS[workflow.name];

        return (
          <div key={key} className="flex justify-between py-1">
            <div className="text-xs flex gap-2 items-center">
              <CategoryIcon
                size={16}
                className="text-muted-foreground"
                color={getWorkflowColor(workflow).color}
              />
              {workflow.name}
            </div>

            <div className="text-xs text-muted-foreground">
              {groupedByIssues.get(key).length}
            </div>
          </div>
        );
      })}
    </div>
  );
}
