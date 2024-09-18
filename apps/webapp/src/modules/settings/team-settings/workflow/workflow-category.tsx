import type { WorkflowCategoryEnum } from '@tegonhq/types';

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { BoardItem } from '@tegonhq/ui/components/board';
import { Button } from '@tegonhq/ui/components/button';
import { AddLine } from '@tegonhq/ui/icons';
import React from 'react';

import { capitalizeFirstLetter } from 'common/lib/common';
import type { WorkflowType } from 'common/types';

import { WorkflowAdd } from './workflow-add';
import { WorkflowItem } from './workflow-item';

interface WorkspaceCategory {
  categoryName: WorkflowCategoryEnum;
  workflows: WorkflowType[];
}

export function WorkflowCategory({
  categoryName,
  workflows,
}: WorkspaceCategory) {
  const [showNewWorkflowCreation, setNewWorkflowCreation] =
    React.useState(false);

  return (
    <div className="flex flex-col mb-6">
      <div className="flex justify-between items-center w-full mb-2">
        <h3 className="capitalize">{capitalizeFirstLetter(categoryName)}</h3>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setNewWorkflowCreation(true)}
        >
          <AddLine size={16} />
        </Button>
      </div>

      {workflows.map((workflow: WorkflowType, index: number) => (
        <BoardItem key={workflow.id} id={workflow.id}>
          <Draggable key={workflow.id} draggableId={workflow.id} index={index}>
            {(
              dragProvided: DraggableProvided,
              dragSnapshot: DraggableStateSnapshot,
            ) => {
              return (
                <WorkflowItem
                  key={workflow.name}
                  workflow={workflow}
                  isDragging={dragSnapshot.isDragging}
                  provided={dragProvided}
                />
              );
            }}
          </Draggable>
        </BoardItem>
      ))}

      {showNewWorkflowCreation && (
        <div className="my-3">
          <WorkflowAdd
            category={categoryName}
            onCancel={() => setNewWorkflowCreation(false)}
          />
        </div>
      )}
    </div>
  );
}
