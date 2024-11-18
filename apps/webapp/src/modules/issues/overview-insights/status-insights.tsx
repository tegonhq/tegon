import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';

import { groupBy } from 'common/lib/common';
import { getWorkflowColor } from 'common/status-color';
import { FilterTypeEnum, type IssueType } from 'common/types';
import type { WorkflowType } from 'common/types';
import { getWorkflowIcon } from 'common/workflow-icons';

import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { applyFilters } from './utils';

interface StatusInsightsProps {
  issues: IssueType[];
}

export const StatusInsights = observer(({ issues }: StatusInsightsProps) => {
  const { workflows } = useComputedWorkflows();
  const { applicationStore } = useContextStore();

  const groupedByIssues = groupBy(issues, 'stateId');

  const statusFilter = applicationStore.filters.status
    ? applicationStore.filters.status.value
    : [];

  return (
    <div className="flex flex-col px-4 gap-1 mt-2">
      {workflows.map((workflow: WorkflowType) => {
        const CategoryIcon = getWorkflowIcon(workflow);
        const isActive = statusFilter.includes(workflow.name);

        return (
          <Button
            key={workflow.id}
            className="flex justify-between p-2.5 h-auto group"
            variant="link"
            isActive={isActive}
            onClick={() =>
              applyFilters(
                FilterTypeEnum.IS,
                'status',
                workflow.name,
                statusFilter,
                applicationStore,
              )
            }
          >
            <div className="flex gap-2 items-center">
              <CategoryIcon
                size={18}
                className="text-muted-foreground"
                color={getWorkflowColor(workflow).color}
              />
              {workflow.name}
            </div>

            <div className="text-muted-foreground flex gap-2 items-center">
              <span className="group-hover:block hidden">
                {isActive ? 'Clear filter' : 'Apply filter'}
              </span>
              {groupedByIssues.get(workflow.id)?.length ?? 0}
            </div>
          </Button>
        );
      })}
    </div>
  );
});
