import type { DraggableProvided } from '@hello-pangea/dnd';
import type { WorkflowCategoryEnum } from '@tegonhq/types';

import { Button } from '@tegonhq/ui/components/button';
import { EditLine } from '@tegonhq/ui/icons';
import React from 'react';

import { getWorkflowColor } from 'common/status-color';
import type { WorkflowType } from 'common/types';
import { getWorkflowIcon } from 'common/workflow-icons';

import { WorkflowEdit } from './workflow-edit';

interface WorkflowItemProps {
  workflow: WorkflowType;
  isDragging: boolean;
  provided: DraggableProvided;
}

function getStyle(provided: DraggableProvided) {
  // Index signature for type '`--${string}`' is missing in type 'DraggingStyle'.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return provided.draggableProps.style as any;
}

export function WorkflowItem({ workflow, provided }: WorkflowItemProps) {
  const CategoryIcon = getWorkflowIcon(workflow);
  const [edit, setEdit] = React.useState(false);

  if (edit) {
    return (
      <WorkflowEdit
        category={workflow.category as WorkflowCategoryEnum}
        workflow={workflow}
        onCancel={() => setEdit(false)}
      />
    );
  }

  return (
    <div
      key={workflow.name}
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={getStyle(provided)}
      {...provided.dragHandleProps}
      className="w-full group flex justify-between mb-2 rounded-md bg-background-3 p-2 px-2"
    >
      <div className="flex items-center">
        <CategoryIcon
          size={20}
          className="text-muted-foreground"
          color={getWorkflowColor(workflow).color}
        />
        <h3 className="pl-2"> {workflow.name} </h3>
        <p className="pl-2 text-muted-foreground"> {workflow.description} </p>
      </div>

      <div className="hidden group-hover:flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="xs"
          className="!p-0 !bg-transparent h-4"
          onClick={() => setEdit(true)}
        >
          <EditLine
            className="text-slate-500 hover:text-black dark:hover:text-white"
            size={16}
          />
        </Button>
      </div>
    </div>
  );
}
