import {
  Draggable,
  Droppable,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DroppableProvided,
  type DroppableStateSnapshot,
} from '@hello-pangea/dnd';
import { AvatarText } from '@tegonhq/ui/components/avatar';
import { AssigneeLine } from '@tegonhq/ui/icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  type ListRowProps,
} from 'react-virtualized';

import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import type { User } from 'common/types';

import { useCycle } from 'hooks/cycles';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface AssigneeBoardListProps {
  user: User;
}

export const AssigneeBoardList = observer(
  ({ user }: AssigneeBoardListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const { workflows } = useComputedWorkflows();
    const cycle = useCycle();
    const project = useProject();

    // Create a CellMeasurerCache instance
    const cache = new CellMeasurerCache({
      defaultHeight: 100, // Default row height
      fixedWidth: true, // Rows have fixed width but dynamic height
    });

    const issues = issuesStore.getIssuesForUser({
      userId: user.id,
      teamId: team?.id,
      projectId: project?.id,
      cycleId: cycle?.id,
    });

    const computedIssues = useFilterIssues(issues, workflows);

    if (
      computedIssues.length === 0 &&
      !applicationStore.displaySettings.showEmptyGroups
    ) {
      return null;
    }

    const rowRender = ({ index, style, key, parent }: ListRowProps) => {
      const issue = computedIssues[index];

      if (!issue) {
        return null;
      }

      return (
        <Draggable key={issue.id} draggableId={issue.id} index={index}>
          {(
            dragProvided: DraggableProvided,
            dragSnapshot: DraggableStateSnapshot,
          ) => (
            <CellMeasurer
              key={key}
              cache={cache}
              columnIndex={0}
              parent={parent}
              rowIndex={index}
            >
              <div style={style} key={key}>
                <BoardIssueItem
                  issueId={issue.id}
                  isDragging={dragSnapshot.isDragging}
                  provided={dragProvided}
                  key={key}
                />
              </div>
            </CellMeasurer>
          )}
        </Draggable>
      );
    };

    return (
      <Droppable
        droppableId={user.id}
        type="BoardColumn"
        mode="virtual"
        ignoreContainerClipping
        renderClone={(provided, snapshot) => {
          return (
            <BoardIssueItem
              issueId={provided.draggableProps['data-rfd-draggable-id']}
              isDragging={snapshot.isDragging}
              provided={provided}
            />
          );
        }}
      >
        {(
          droppableProvided: DroppableProvided,
          snapshot: DroppableStateSnapshot,
        ) => {
          const itemCount: number = snapshot.isUsingPlaceholder
            ? issues.length + 1
            : issues.length;

          return (
            <div className="flex flex-col max-h-[100%] w-[350px]">
              <div className="flex gap-1 items-center mb-2 w-[310px]">
                <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
                  <AvatarText
                    text={user.fullname}
                    className="h-5 w-5 text-[9px]"
                  />
                  <h3 className="pl-2">{user.fullname}</h3>
                </div>

                <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
                  {computedIssues.length}
                </div>
              </div>

              <div className="flex flex-col grow mr-3">
                <AutoSizer className="pb-10 h-full">
                  {({ width, height }) => (
                    <List
                      ref={(ref) => {
                        // react-virtualized has no way to get the list's ref that I can so
                        // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                        if (ref) {
                          // eslint-disable-next-line react/no-find-dom-node
                          const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                          if (whatHasMyLifeComeTo instanceof HTMLElement) {
                            droppableProvided.innerRef(whatHasMyLifeComeTo);
                          }
                        }
                      }}
                      height={height}
                      overscanRowCount={10}
                      noRowsRenderer={() => <></>}
                      width={width}
                      rowCount={itemCount}
                      outerRef={droppableProvided.innerRef}
                      rowHeight={cache.rowHeight}
                      deferredMeasurementCache={cache}
                      rowRenderer={rowRender}
                      shallowCompare
                    />
                  )}
                </AutoSizer>
              </div>
            </div>
          );
        }}
      </Droppable>
    );
  },
);

export const NoAssigneeView = observer(() => {
  const { issuesStore, applicationStore } = useContextStore();
  const team = useCurrentTeam();
  const { workflows } = useComputedWorkflows();
  const project = useProject();

  const issues = issuesStore.getIssuesForUser({
    userId: undefined,
    teamId: team?.id,
    projectId: project?.id,
  });
  const computedIssues = useFilterIssues(issues, workflows);

  if (
    computedIssues.length === 0 &&
    !applicationStore.displaySettings.showEmptyGroups
  ) {
    return null;
  }

  // Create a CellMeasurerCache instance
  const cache = new CellMeasurerCache({
    defaultHeight: 100, // Default row height
    fixedWidth: true, // Rows have fixed width but dynamic height
  });

  const rowRender = ({ index, style, key, parent }: ListRowProps) => {
    const issue = computedIssues[index];

    if (!issue) {
      return null;
    }

    return (
      <Draggable key={issue.id} draggableId={issue.id} index={index}>
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot,
        ) => (
          <CellMeasurer
            key={key}
            cache={cache}
            columnIndex={0}
            parent={parent}
            rowIndex={index}
          >
            <div style={style} key={key}>
              <BoardIssueItem
                issueId={issue.id}
                isDragging={dragSnapshot.isDragging}
                provided={dragProvided}
                key={key}
              />
            </div>
          </CellMeasurer>
        )}
      </Draggable>
    );
  };

  return (
    <Droppable
      droppableId="no-user"
      type="BoardColumn"
      mode="virtual"
      ignoreContainerClipping
      renderClone={(provided, snapshot) => {
        return (
          <BoardIssueItem
            issueId={provided.draggableProps['data-rfd-draggable-id']}
            isDragging={snapshot.isDragging}
            provided={provided}
          />
        );
      }}
    >
      {(
        droppableProvided: DroppableProvided,
        snapshot: DroppableStateSnapshot,
      ) => {
        const itemCount: number = snapshot.isUsingPlaceholder
          ? issues.length + 1
          : issues.length;

        return (
          <div className="flex flex-col max-h-[100%] w-[350px]">
            <div className="flex gap-1 items-center mb-2 w-[310px]">
              <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
                <AssigneeLine size={20} />
                <h3 className="pl-2">No Assignee</h3>
              </div>

              <div className="rounded-2xl bg-grayAlpha-100 p-1.5 px-2 font-mono">
                {computedIssues.length}
              </div>
            </div>

            <div className="flex flex-col grow mr-3">
              <AutoSizer className="pb-10 h-full">
                {({ width, height }) => (
                  <List
                    ref={(ref) => {
                      // react-virtualized has no way to get the list's ref that I can so
                      // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                      if (ref) {
                        // eslint-disable-next-line react/no-find-dom-node
                        const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                        if (whatHasMyLifeComeTo instanceof HTMLElement) {
                          droppableProvided.innerRef(whatHasMyLifeComeTo);
                        }
                      }
                    }}
                    height={height}
                    overscanRowCount={10}
                    noRowsRenderer={() => <></>}
                    width={width}
                    rowCount={itemCount}
                    outerRef={droppableProvided.innerRef}
                    rowHeight={cache.rowHeight}
                    deferredMeasurementCache={cache}
                    rowRenderer={rowRender}
                    shallowCompare
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        );
      }}
    </Droppable>
  );
});
