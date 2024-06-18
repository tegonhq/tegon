/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { RiDeleteBin7Line, RiMoreFill, RiPencilFill } from '@remixicon/react';
import * as React from 'react';

import type { LabelType } from 'common/types/label';

import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

import { useDeleteLabelMutation } from 'services/labels/delete-label';

import { DeleteLabelAlert } from './delete-label-alert';

interface LabelProps {
  label: LabelType;
  setEditLabelState: (labelId: string) => void;
}

export function Label({ label, setEditLabelState }: LabelProps) {
  const [deleteAlert, setDeleteAlert] = React.useState(false);

  const { mutate: deleteLabelAPI } = useDeleteLabelMutation({});

  return (
    <div className="border border-slate-200 dark:border-slate-800 group flex justify-between mb-2 text-sm rounded-md bg-slate-100 dark:bg-slate-800/50 p-2 px-4">
      <div className="flex items-center justify-center gap-3">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: label.color }}
        ></div>
        <div>{label.name}</div>
      </div>

      <div className="items-center justify-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center">
            <Button variant="ghost" size="xs" className="flex items-center">
              <RiMoreFill
                className="text-slate-500 hover:text-black dark:hover:text-white"
                size={16}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditLabelState(label.id)}>
              <div className="flex items-center gap-2 text-xs">
                <RiPencilFill size={14} /> Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteAlert(true)}>
              <div className="flex items-center gap-2 text-xs">
                <RiDeleteBin7Line size={14} /> Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteLabelAlert
        open={deleteAlert}
        setOpen={setDeleteAlert}
        deleteLabel={() => deleteLabelAPI({ labelId: label.id })}
      />
    </div>
  );
}
