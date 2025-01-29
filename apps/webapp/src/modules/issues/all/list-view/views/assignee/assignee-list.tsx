import { AvatarText } from '@tegonhq/ui/components/avatar';
import { Button } from '@tegonhq/ui/components/button';
import { AssigneeLine } from '@tegonhq/ui/icons';
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

import type { User } from 'common/types';

import { ScrollManagedList } from 'components/scroll-managed-list';
import { useCycle } from 'hooks/cycles';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useIssueRowsAssignee } from './utils';

interface AssigneeListProps {
  users: User[];
}

export const AssigneeList = observer(({ users }: AssigneeListProps) => {
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

  const rows = useIssueRowsAssignee(filteredIssues, users);

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
    if (!row) {
      return null;
    }
    let childContent;

    if (row.key === 'no-value') {
      childContent = (
        <>
          <AssigneeLine className="h-5 w-5" />
          <h3 className="pl-2">No assignee</h3>
        </>
      );
    } else {
      const user = users.find((user) => user.id.includes(row.key));
      childContent = (
        <>
          <AvatarText text={user.fullname} className="h-5 w-5 text-[9px]" />

          <h3 className="pl-2">{user.fullname}</h3>
        </>
      );
    }

    return (
      <Button
        className={cn(
          'flex group items-center ml-4 mb-2 w-fit rounded-2xl bg-grayAlpha-100 cursor-default',
          index !== 0 && 'mt-4',
        )}
        variant="ghost"
        size="lg"
      >
        {childContent}
      </Button>
    );
  };

  const changeHeight = (_issueCount: number, index: number) => {
    cache.clear(index, 0);
    setHeightChange(!_heightChange);
  };

  const rowRender = ({ index, style, key, parent }: ListRowProps) => {
    const row = rows[index];
    if (!row) {
      return null;
    }
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
    <AutoSizer className="h-full">
      {({ width, height }) => (
        <ScrollManagedList
          className=""
          listId="assignee-list"
          height={height}
          overscanRowCount={10}
          noRowsRenderer={() => <></>}
          rowCount={rows.length + 2}
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
