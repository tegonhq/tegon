import type {
  Direction,
  DraggableChildrenFn,
  DragStart,
  DroppableProvided,
  DropResult,
  ResponderProvided,
} from '@hello-pangea/dnd';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React from 'react';

import { cn } from '../../lib/utils';

interface BoardProps {
  children: React.ReactElement;
  isCombineEnabled?: boolean;
  onDragEnd: (result: DropResult) => void;
  onDragStart?: (start: DragStart, provided: ResponderProvided) => void;
  className?: string;
  direction?: Direction;
}

export function Board({
  children,
  isCombineEnabled,
  onDragEnd,
  className,
  onDragStart,
  direction = 'horizontal',
}: BoardProps) {
  const board = (
    <Droppable
      droppableId="board"
      type="COLUMN"
      ignoreContainerClipping
      direction={direction}
      isCombineEnabled={isCombineEnabled}
    >
      {(provided: DroppableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="h-full w-full inline-flex"
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div
      className={cn(
        'flex flex-col justify-start items-start h-full overflow-hidden',
        className,
      )}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="overflow-auto overflow-y-hidden h-full w-full">
          {board}
        </div>
      </DragDropContext>
    </div>
  );
}

interface BoardColumnProps {
  children: React.ReactElement;
  id: string;
  renderClone?: DraggableChildrenFn | null;
}

export function BoardColumn({ children, id, renderClone }: BoardColumnProps) {
  return (
    <Droppable
      droppableId={id}
      type="BoardColumn"
      ignoreContainerClipping
      renderClone={renderClone}
    >
      {(dropProvided: DroppableProvided) => (
        <div ref={dropProvided.innerRef}>
          <div className="rounded-md w-[350px] flex flex-col h-full">
            {children}
          </div>
        </div>
      )}
    </Droppable>
  );
}

interface BoardRowProps {
  children: React.ReactElement;
  id: string;
  renderClone?: DraggableChildrenFn | null;
  isDropDisabled?: boolean;
  mode?: 'standard' | 'virtual';
}

export function BoardRow({
  children,
  id,
  renderClone,
  isDropDisabled,
  mode = 'standard',
}: BoardRowProps) {
  return (
    <Droppable
      droppableId={id}
      type="BoardColumn"
      ignoreContainerClipping
      mode={mode}
      isDropDisabled={isDropDisabled}
      renderClone={renderClone}
    >
      {(dropProvided: DroppableProvided) => {
        return (
          <div ref={dropProvided.innerRef}>
            <div className="rounded-md w-full flex flex-col h-full">
              {children}
            </div>
          </div>
        );
      }}
    </Droppable>
  );
}

export function BoardItem({
  children,
}: {
  id: string;
  children: React.ReactElement;
}) {
  return <div className="flex justify-center align-center">{children}</div>;
}
