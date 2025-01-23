import { Button } from '@tegonhq/ui/components/button';
import { BadgeColor } from '@tegonhq/ui/components/ui/badge';
import { LabelLine } from '@tegonhq/ui/icons';
import { cn } from '@tegonhq/ui/lib/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  type Index,
  type ListRowProps,
} from 'react-virtualized';

import { IssueListItem } from 'modules/issues/components';
import { useFilterIssues } from 'modules/issues/issues-utils';

import type { LabelType } from 'common/types';

import { ScrollManagedList } from 'components/scroll-managed-list';
import { useCycle } from 'hooks/cycles';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useIssueRowsLabel } from './utils';

interface LabelListProps {
  labels: LabelType[];
}

export const LabelList = observer(({ labels }: LabelListProps) => {
  const project = useProject();
  const cycle = useCycle();
  const team = useCurrentTeam();

  const [_heightChange, setHeightChange] = React.useState(false);

  const { issuesStore } = useContextStore();
  const issues = issuesStore.getIssues({
    teamId: team?.id,
    projectId: project?.id,
    cycleId: cycle?.id,
  });
  const { workflows } = useComputedWorkflows();
  const filteredIssues = useFilterIssues(issues, workflows);

  const rows = useIssueRowsLabel(filteredIssues, labels);

  // Create a CellMeasurerCache instance
  const cache = new CellMeasurerCache({
    defaultHeight: 45, // Default row height
    fixedWidth: true, // Rows have fixed width but dynamic height
  });

  React.useEffect(() => {
    cache.clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const getHeaderRow = (row: { type: string; key: string }, index: number) => {
    let childContent;

    if (row.key === 'no-value') {
      childContent = (
        <>
          <LabelLine className="h-5 w-5" />
          <h3 className="pl-2">No label</h3>
        </>
      );
    } else {
      const label = labels.find((label) => label.id.includes(row.key));

      childContent = (
        <>
          <div className="h-5 w-5 flex items-center justify-center">
            <BadgeColor
              style={{ backgroundColor: label.color }}
              className="w-2 h-2"
            />
          </div>
          <h3 className="pl-1">{label.name}</h3>
        </>
      );
    }

    return (
      <>
        <Button
          className={cn(
            'flex items-center group ml-4 w-fit rounded-2xl bg-grayAlpha-100 mb-2 cursor-default',
            index !== 0 && 'mt-4',
          )}
          variant="ghost"
          size="lg"
        >
          {childContent}
        </Button>
      </>
    );
  };

  const changeHeight = (_issueCount: number, index: number) => {
    cache.clear(index, 0);
    setHeightChange(!_heightChange);
  };

  const rowRender = ({ index, style, key, parent }: ListRowProps) => {
    const row = rows[index];

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
      >
        <div style={style} key={key}>
          {row.type === 'header' ? (
            getHeaderRow(row, index)
          ) : (
            <IssueListItem
              issueId={row.issueId}
              key={index}
              changeHeight={(issueCount) => changeHeight(issueCount, index)}
            />
          )}
        </div>
      </CellMeasurer>
    );
  };

  const rowHeight = ({ index }: Index) => {
    const row = rows[index];

    if (row && row.type === 'issue') {
      const defaultHeight = row.hasRelations ? 73 : 45;

      return Math.max(cache.getHeight(index, 0), defaultHeight);
    }

    return cache.getHeight(index, 0);
  };

  return (
    <AutoSizer className="pb-10 h-full">
      {({ width, height }) => (
        <ScrollManagedList
          className=""
          listId="label-list"
          height={height}
          overscanRowCount={10}
          noRowsRenderer={() => <></>}
          rowCount={rows.length}
          rowHeight={rowHeight}
          deferredMeasurementCache={cache}
          rowRenderer={rowRender}
          width={width}
          shallowCompare
        />
      )}
    </AutoSizer>
  );
});
