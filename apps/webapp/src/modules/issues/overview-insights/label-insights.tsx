import { BadgeColor } from '@tegonhq/ui/components/badge';
import { Button } from '@tegonhq/ui/components/button';
import { observer } from 'mobx-react-lite';

import { groupByKeyArray } from 'common/lib/common';
import { FilterTypeEnum, type IssueType } from 'common/types';
import type { LabelType } from 'common/types';

import { useComputedLabels } from 'hooks/labels';

import { useContextStore } from 'store/global-context-provider';

import { applyFilters } from './utils';

interface LabelInsightsProps {
  issues: IssueType[];
}

export const LabelInsights = observer(({ issues }: LabelInsightsProps) => {
  const groupedByIssues = groupByKeyArray(issues, 'labelIds');
  const { applicationStore } = useContextStore();
  const { labels } = useComputedLabels();

  const labelFilter = applicationStore.filters.label
    ? applicationStore.filters.label.value
    : [];

  return (
    <div className="flex flex-col px-4 gap-1 mt-2">
      {labels.map((label: LabelType) => {
        const isActive = labelFilter.includes(label.name);

        return (
          <Button
            key={label.id}
            className="flex justify-between p-2.5 h-auto group"
            variant="link"
            isActive={isActive}
            onClick={() =>
              applyFilters(
                FilterTypeEnum.INCLUDES,
                'label',
                label.name,
                labelFilter,
                applicationStore,
              )
            }
          >
            <div className="flex gap-2 items-center">
              <BadgeColor
                style={{ backgroundColor: label?.color }}
                className="w-2 h-2"
              />
              {label?.name}
            </div>

            <div className="text-muted-foreground flex gap-2 items-center">
              <span className="group-hover:block hidden">
                {isActive ? 'Clear filter' : 'Apply filter'}
              </span>
              {groupedByIssues.get(label.id)?.length ?? 0}
            </div>
          </Button>
        );
      })}
    </div>
  );
});
