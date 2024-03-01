/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiLoader3Line, RiPencilFill } from '@remixicon/react';

import { WorkflowCategoryEnum, WorkflowType } from 'common/types/team';

import { Button } from 'components/ui/button';

interface WorkflowItemProps {
  workflow: WorkflowType;
}

const CATEGORY_ICONS = {
  Backlog: RiLoader3Line,
};

export function WorkflowItem({ workflow }: WorkflowItemProps) {
  return (
    <div
      key={workflow.name}
      className="w-full border border-slate-200 dark:border-slate-800 group flex justify-between mb-2 text-sm rounded-md bg-slate-100/80 dark:bg-slate-900 p-2 px-2"
    >
      <div className="flex">
        <RiLoader3Line size={18} className="text-muted-foreground" />
        <h3 className="pl-2"> {workflow.name} </h3>
      </div>

      <div className="hidden group-hover:flex items-center justify-center gap-4">
        <Button variant="ghost" size="xs" className="!p-0 !bg-transparent h-4">
          <RiPencilFill
            className="text-slate-500 hover:text-black dark:hover:text-white"
            size={16}
          />
        </Button>
      </div>
    </div>
  );
}
