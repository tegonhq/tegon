import type { IssueType } from '@tegonhq/types';
import type { LabelType } from '@tegonhq/types';

import { BadgeColor } from '@tegonhq/ui/components/badge';

import { groupByKeyArray } from 'common/lib/common';

import { useContextStore } from 'store/global-context-provider';

interface LabelInsightsProps {
  issues: IssueType[];
}

export function LabelInsights({ issues }: LabelInsightsProps) {
  const { labelsStore } = useContextStore();
  const groupedByIssues = groupByKeyArray(issues, 'labelIds');

  return (
    <div className="flex flex-col gap-3 p-3">
      {Array.from(groupedByIssues.keys()).map((key: string) => {
        const label = labelsStore.getLabelWithId(key) as LabelType;

        return (
          <div key={key} className="flex justify-between py-1">
            <div className="text-xs flex gap-2 items-center">
              <BadgeColor style={{ backgroundColor: label?.color }} />
              {label?.name}
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
