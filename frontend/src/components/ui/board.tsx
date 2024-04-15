/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { DroppableProvided, DropResult } from '@hello-pangea/dnd';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React from 'react';

interface BoardProps {
  children: React.ReactElement;
  isCombineEnabled?: boolean;
  onDragEnd: (result: DropResult) => void;
}

export function Board({ children, isCombineEnabled, onDragEnd }: BoardProps) {
  const board = (
    <Droppable
      droppableId="board"
      type="COLUMN"
      direction="horizontal"
      ignoreContainerClipping
      isCombineEnabled={isCombineEnabled}
    >
      {(provided: DroppableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="h-full w-full p-1 inline-flex"
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div className="flex flex-col justify-start items-start h-full overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
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
}

export function BoardColumn({ children, id }: BoardColumnProps) {
  return (
    <Droppable droppableId={id} type="BoardColumn" ignoreContainerClipping>
      {(dropProvided: DroppableProvided) => (
        <div className="p-2" ref={dropProvided.innerRef}>
          <div className="bg-active/40 rounded-md w-[350px] flex flex-col h-full">
            {children}
          </div>
        </div>
      )}
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
