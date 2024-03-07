/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  RiCheckboxCircleFill,
  RiCircleLine,
  RiCloseCircleFill,
  RiLoader3Line,
  RiProgress4Line,
  RiProgress6Line,
} from '@remixicon/react';

import { WorkflowType } from 'common/types/team';

interface WorkflowItemProps {
  workflow: WorkflowType;
}

export const WORKFLOW_CATEGORY_ICONS = {
  Backlog: RiLoader3Line,
  Todo: RiCircleLine,
  'In Progress': RiProgress4Line,
  'In Review': RiProgress6Line,
  Done: RiCheckboxCircleFill,
  Duplicate: RiCloseCircleFill,
  Canceled: RiCloseCircleFill,
};

export function WorkflowItem({ workflow }: WorkflowItemProps) {
  const CategoryIcon =
    WORKFLOW_CATEGORY_ICONS[workflow.name] ??
    WORKFLOW_CATEGORY_ICONS['Backlog'];

  return (
    <div
      key={workflow.name}
      className="w-full border border-gray-200 dark:border-gray-800 group flex justify-between mb-2 text-sm rounded-md bg-gray-100/80 dark:bg-gray-800 p-2 px-2"
    >
      <div className="flex items-center">
        <CategoryIcon
          size={18}
          className="text-muted-foreground"
          color={workflow.color}
        />
        <h3 className="pl-2"> {workflow.name} </h3>
      </div>

      {/* <div className="hidden group-hover:flex items-center justify-center gap-4">
        <Button variant="ghost" size="xs" className="!p-0 !bg-transparent h-4">
          <RiPencilFill
            className="text-gray-500 hover:text-black dark:hover:text-white"
            size={16}
          />
        </Button>
      </div> */}
    </div>
  );
}
