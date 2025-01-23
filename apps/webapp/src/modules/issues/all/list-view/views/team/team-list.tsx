import { Button } from '@tegonhq/ui/components/button';
import { TeamIcon } from '@tegonhq/ui/components/team-icon';
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

import type { TeamType } from 'common/types';

import { ScrollManagedList } from 'components/scroll-managed-list';
import { useCycle } from 'hooks/cycles';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useIssueRowsTeam } from './utils';

interface TeamListProps {
  teams: TeamType[];
}

export const TeamList = observer(({ teams }: TeamListProps) => {
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

  const rows = useIssueRowsTeam(filteredIssues, teams);

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
    const team = teams.find((team) => team.id.includes(row.key));

    return (
      <Button
        className={cn(
          'flex group items-center ml-4 w-fit rounded-2xl bg-grayAlpha-100 mb-2 cursor-default',
          index !== 0 && 'mt-4',
        )}
        size="lg"
        variant="ghost"
      >
        <TeamIcon name={team.name} />

        <h3 className="pl-2">{team.name}</h3>
      </Button>
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
          listId="category-list"
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
