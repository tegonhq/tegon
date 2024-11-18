import { observer } from 'mobx-react-lite';

import { groupBy } from 'common/lib/common';
import { type IssueType } from 'common/types';

import { usePriorities } from 'hooks/priorities';

import { PriorityIcons } from '../components';

interface PriorityInsightsProps {
  issues: IssueType[];
}

export const PriorityInsights = observer(
  ({ issues }: PriorityInsightsProps) => {
    const groupedByIssues = groupBy(issues, 'priority');

    const Priorities = usePriorities();

    return (
      <div className="flex flex-col gap-3 p-3">
        {Array.from(groupedByIssues.keys()).map((key: number) => {
          const PriorityIcon = PriorityIcons[key ?? 0];

          return (
            <div key={key} className="flex justify-between py-1">
              <div className="flex gap-2 items-center">
                <PriorityIcon.icon
                  size={16}
                  className="text-muted-foreground"
                />
                {Priorities[key]}
              </div>

              <div className="text-muted-foreground">
                {groupedByIssues.get(key)?.length}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
