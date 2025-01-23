import {
  Draggable,
  Droppable,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DroppableProvided,
  type DroppableStateSnapshot,
} from '@hello-pangea/dnd';
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

import { PriorityIcons } from 'modules/issues/components';
import { BoardIssueItem } from 'modules/issues/components/issue-board-item';

import { useCycle } from 'hooks/cycles';
import { usePriorities } from 'hooks/priorities';
import { useProject } from 'hooks/projects';
import { useCurrentTeam } from 'hooks/teams';
import { useComputedWorkflows } from 'hooks/workflows';

import { useContextStore } from 'store/global-context-provider';

import { useFilterIssues } from '../../../../issues-utils';

interface PriorityBoardListProps {
  priority: number;
}

export const PriorityBoardList = observer(
  ({ priority }: PriorityBoardListProps) => {
    const { issuesStore, applicationStore } = useContextStore();
    const team = useCurrentTeam();
    const { workflows } = useComputedWorkflows();
    const project = useProject();
    const Priorities = usePriorities();
    const cycle = useCycle();

    const issues = issuesStore.getIssuesForPriority(priority, {
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

    const PriorityIcon = PriorityIcons[priority];

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
        droppableId={`${priority}`}
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
            ? computedIssues.length + 1
            : computedIssues.length;

          return (
            <div className="flex flex-col max-h-[100%] w-[350px]">
              <div className="flex gap-1 items-center mb-2 w-[310px]">
                <div className="flex items-center w-fit h-8 rounded-2xl px-4 py-2 bg-grayAlpha-100">
                  <PriorityIcon.icon size={20} />
                  <h3 className="pl-2">{Priorities[priority]}</h3>
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
