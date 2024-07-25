import { RiDeleteBin7Line } from '@remixicon/react';
import { DropdownMenuItem } from '@tegonhq/ui/components/dropdown-menu';
import React from 'react';

import { DropdownItem } from './dropdown-item';

interface DeleteIssueItemProps {
  setDeleteIssueDialog: (value: boolean) => void;
}

export function DeleteIssueItem({
  setDeleteIssueDialog,
}: DeleteIssueItemProps) {
  return (
    <>
      <DropdownMenuItem onClick={() => setDeleteIssueDialog(true)}>
        <DropdownItem Icon={RiDeleteBin7Line} title="Delete" />
      </DropdownMenuItem>
    </>
  );
}
