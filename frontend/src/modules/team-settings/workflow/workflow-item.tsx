/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiCloseCircleFill } from '@remixicon/react';

import type { WorkflowType } from 'common/types/team';

import {
  BacklogLine,
  DoneFill,
  InProgressLine,
  InReviewLine,
  TodoLine,
  TriageFill,
} from 'icons';

interface WorkflowItemProps {
  workflow: WorkflowType;
}

export const WORKFLOW_CATEGORY_ICONS = {
  Backlog: BacklogLine,
  Todo: TodoLine,
  'In Progress': InProgressLine,
  'In Review': InReviewLine,
  Done: DoneFill,
  Duplicate: RiCloseCircleFill,
  Canceled: RiCloseCircleFill,
  Triage: TriageFill,
};

export function WorkflowItem({ workflow }: WorkflowItemProps) {
  const CategoryIcon =
    WORKFLOW_CATEGORY_ICONS[workflow.name] ??
    WORKFLOW_CATEGORY_ICONS['Backlog'];

  return (
    <div
      key={workflow.name}
      className="w-full border border-slate-200 dark:border-slate-800 group flex justify-between mb-2 text-sm rounded-md bg-slate-100 dark:bg-slate-800/50 p-2 px-2"
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
            className="text-slate-500 hover:text-black dark:hover:text-white"
            size={16}
          />
        </Button>
      </div> */}
    </div>
  );
}
