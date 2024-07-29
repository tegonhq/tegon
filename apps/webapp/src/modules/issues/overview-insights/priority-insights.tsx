import { Priorities, type IssueType } from '@tegonhq/types';

import { groupBy } from 'common/lib/common';

import { PriorityIcons } from '../components';

interface PriorityInsightsProps {
  issues: IssueType[];
}

export function PriorityInsights({ issues }: PriorityInsightsProps) {
  const groupedByIssues = groupBy(issues, 'priority');

  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from(groupedByIssues.keys()).map((key: number) => {
        const PriorityIcon = PriorityIcons[key ?? 0];

        return (
          <div key={key} className="flex justify-between py-1">
            <div className="text-xs flex gap-2 items-center">
              <PriorityIcon.icon size={16} className="text-muted-foreground" />
              {Priorities[key]}
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
